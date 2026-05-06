import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { buildChunks } from '../lib/chat/chunks';

const MODEL = 'gemini-embedding-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:batchEmbedContents`;
const OUTPUT_DIM = 768;
const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 1000;
const OUTPUT = resolve(process.cwd(), 'lib/chat/embeddings.json');

interface BatchEmbedResponse {
  embeddings?: Array<{ values?: number[] }>;
  error?: { message?: string };
}

interface CachedChunk {
  hash?: string;
  vector?: number[];
}

interface CachedFile {
  model?: string;
  chunks?: CachedChunk[];
}

function hashText(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

function loadCache(): Map<string, number[]> {
  const map = new Map<string, number[]>();
  if (!existsSync(OUTPUT)) return map;
  try {
    const raw = readFileSync(OUTPUT, 'utf8');
    const parsed = JSON.parse(raw) as CachedFile;
    if (parsed.model !== MODEL) return map;
    if (!Array.isArray(parsed.chunks)) return map;
    for (const chunk of parsed.chunks) {
      if (typeof chunk.hash === 'string' && Array.isArray(chunk.vector)) {
        map.set(chunk.hash, chunk.vector);
      }
    }
  } catch {
    return new Map();
  }
  return map;
}

function parseRetrySeconds(message: string | undefined): number | null {
  if (!message) return null;
  const m = /retry in ([\d.]+)s/i.exec(message);
  return m ? Math.ceil(parseFloat(m[1])) : null;
}

async function embedBatch(apiKey: string, texts: string[], attempt = 0): Promise<number[][]> {
  const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: texts.map((text) => ({
        model: `models/${MODEL}`,
        content: { parts: [{ text }] },
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: OUTPUT_DIM,
      })),
    }),
  });
  const payload = (await response.json()) as BatchEmbedResponse;
  if (response.status === 429 && attempt < 3) {
    const wait = parseRetrySeconds(payload.error?.message) ?? 60;
    console.log(`  rate limited, waiting ${wait}s (attempt ${attempt + 1})`);
    await new Promise((r) => setTimeout(r, wait * 1000 + 500));
    return embedBatch(apiKey, texts, attempt + 1);
  }
  if (!response.ok || !payload.embeddings) {
    throw new Error(`Gemini batch embed failed: ${payload.error?.message || response.statusText}`);
  }
  if (payload.embeddings.length !== texts.length) {
    throw new Error(
      `Gemini batch embed returned ${payload.embeddings.length} embeddings for ${texts.length} requests`,
    );
  }
  return payload.embeddings.map((e, i) => {
    if (!e.values) throw new Error(`Missing values in embedding ${i}`);
    return e.values;
  });
}

async function embedAll(apiKey: string, texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  const totalBatches = Math.ceil(texts.length / BATCH_SIZE);
  for (let b = 0; b < totalBatches; b++) {
    const start = b * BATCH_SIZE;
    const slice = texts.slice(start, start + BATCH_SIZE);
    const vectors = await embedBatch(apiKey, slice);
    out.push(...vectors);
    console.log(`  embedded ${out.length}/${texts.length} (batch ${b + 1}/${totalBatches})`);
    if (b < totalBatches - 1) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }
  return out;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY (or GOOGLE_API_KEY) is required.');
    process.exit(1);
  }

  const chunks = buildChunks();
  const cache = loadCache();

  const hashes = chunks.map((c) => hashText(c.text));
  const reusedVectors: Array<number[] | null> = chunks.map((_, i) => {
    const cached = cache.get(hashes[i]);
    if (cached && cached.length === OUTPUT_DIM) return cached;
    return null;
  });

  const toEmbedIndices: number[] = [];
  const toEmbedTexts: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (reusedVectors[i] === null) {
      toEmbedIndices.push(i);
      toEmbedTexts.push(chunks[i].text);
    }
  }

  const reusedCount = chunks.length - toEmbedTexts.length;
  console.log(`Built ${chunks.length} chunks. ${reusedCount} cached, ${toEmbedTexts.length} to embed.`);

  let freshVectors: number[][] = [];
  if (toEmbedTexts.length > 0) {
    console.log(`Embedding ${toEmbedTexts.length} chunks with ${MODEL} (dim=${OUTPUT_DIM})...`);
    freshVectors = await embedAll(apiKey, toEmbedTexts);
  }

  const finalVectors: number[][] = new Array(chunks.length);
  for (let i = 0; i < chunks.length; i++) {
    const reused = reusedVectors[i];
    if (reused !== null) finalVectors[i] = reused;
  }
  for (let j = 0; j < toEmbedIndices.length; j++) {
    finalVectors[toEmbedIndices[j]] = freshVectors[j];
  }

  const dim = finalVectors[0]?.length ?? 0;
  if (!finalVectors.every((v) => v.length === dim)) {
    throw new Error('Inconsistent vector dimensions across chunks.');
  }

  const out = {
    model: MODEL,
    dim,
    builtAt: new Date().toISOString(),
    chunks: chunks.map((c, i) => ({ ...c, hash: hashes[i], vector: finalVectors[i] })),
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(out));
  console.log(`Wrote ${OUTPUT} (${out.chunks.length} chunks, dim=${dim}, ${reusedCount} reused from cache)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
