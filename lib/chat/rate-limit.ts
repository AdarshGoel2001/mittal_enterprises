// Sliding-window rate limit for the chat API.
//
// Default: in-memory Map (single-region Vercel — fine for low traffic).
// If both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, switch
// to a distributed sliding-window via Upstash REST + Redis sorted sets. On any
// Upstash failure we fail open (return true) — availability over correctness
// for a low-stakes B2B chatbot.

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

const rateBuckets = new Map<string, number[]>();

function checkInMemory(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateBuckets.get(ip) || []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateBuckets.set(ip, hits);
  return true;
}

// Upstash REST pipeline returns an array of `{ result }` (success) or
// `{ error }` (per-command failure) entries, in command order.
type UpstashPipelineEntry = { result: unknown } | { error: string };
type UpstashPipelineResponse = UpstashPipelineEntry[];

async function checkUpstash(ip: string, url: string, token: string): Promise<boolean> {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const ttlSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
  const key = `ratelimit:chat:${ip}`;
  const member = `${now}-${Math.random().toString(36).slice(2, 10)}`;

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['ZREMRANGEBYSCORE', key, '0', String(cutoff)],
        ['ZCARD', key],
        ['ZADD', key, String(now), member],
        ['EXPIRE', key, String(ttlSeconds)],
      ]),
    });

    if (!response.ok) {
      console.warn(`[rate-limit] Upstash returned ${response.status}; failing open`);
      return true;
    }

    const payload = (await response.json()) as UpstashPipelineResponse;
    const zcardEntry = payload[1];
    if (!zcardEntry || 'error' in zcardEntry) {
      console.warn('[rate-limit] Upstash ZCARD missing/errored; failing open');
      return true;
    }

    const countRaw = zcardEntry.result;
    const count = typeof countRaw === 'number' ? countRaw : parseInt(String(countRaw), 10);
    if (Number.isNaN(count)) {
      console.warn('[rate-limit] Upstash ZCARD non-numeric; failing open');
      return true;
    }

    // ZCARD reflects the count BEFORE our ZADD for this request, so >= max
    // means we'd exceed the limit by adding this one. (We still ran the ADD;
    // a single extra entry per blocked request is acceptable and the EXPIRE
    // keeps the key bounded.)
    return count < RATE_LIMIT_MAX;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[rate-limit] Upstash request threw: ${message}; failing open`);
    return true;
  }
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return checkUpstash(ip, url, token);
  }
  return checkInMemory(ip);
}
