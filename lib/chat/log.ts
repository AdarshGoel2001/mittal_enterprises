// Best-effort chat conversation log to Upstash Redis (REST). Mirrors the
// env-detection + fail-quiet pattern used by lib/chat/rate-limit.ts. If the
// Upstash credentials are absent or the request fails, this is a no-op — chat
// logging must never break the user-facing response.

const MAX_FIELD_CHARS = 4000;
const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

interface LogEntry {
  ip: string;
  pathname?: string;
  query: string;
  response: string;
  sourceIds: string[];
  retrievalMode: 'vector' | 'keyword-fallback';
  latencyMs: number;
}

function truncate(text: string): string {
  if (text.length <= MAX_FIELD_CHARS) return text;
  return text.slice(0, MAX_FIELD_CHARS - 1) + '…';
}

export async function logChatTurn(entry: LogEntry): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;

  const dateKey = new Date().toISOString().slice(0, 10);
  const key = `chatlog:${dateKey}`;
  const record = JSON.stringify({
    ts: Date.now(),
    ...entry,
    query: truncate(entry.query),
    response: truncate(entry.response),
  });

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['LPUSH', key, record],
        ['EXPIRE', key, String(TTL_SECONDS)],
      ]),
    });
    if (!response.ok) {
      console.warn(`[chat-log] upstash write failed: HTTP ${response.status}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[chat-log] upstash write failed:', message);
  }
}
