import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { buildChunks } from '../lib/chat/chunks';

const MODEL = 'text-embedding-004';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:batchEmbedContents`;
const BATCH_SIZE = 100;
const OUTPUT = resolve(process.cwd(), 'lib/chat/embeddings.json');

interface BatchEmbedResponse {
  embeddings?: Array<{ values?: number[] }>;
  error?: { message?: string };
}

async function embedBatch(apiKey: string, texts: string[]): Promise<number[][]> {
  const body = {
    requests: texts.map((text) => ({
      model: `models/${MODEL}`,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT',
    })),
  };
  const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as BatchEmbedResponse;
  if (!response.ok || !payload.embeddings) {
    throw new Error(`Gemini embed failed: ${payload.error?.message || response.statusText}`);
  }
  return payload.embeddings.map((e, i) => {
    if (!e.values) throw new Error(`Missing vector for batch index ${i}`);
    return e.values;
  });
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY (or GOOGLE_API_KEY) is required.');
    process.exit(1);
  }

  const chunks = buildChunks();
  console.log(`Built ${chunks.length} chunks. Embedding...`);

  const vectors: number[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embedded = await embedBatch(apiKey, batch.map((c) => c.text));
    vectors.push(...embedded);
    console.log(`  embedded ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`);
  }

  const dim = vectors[0]?.length ?? 0;
  if (!vectors.every((v) => v.length === dim)) {
    throw new Error('Inconsistent vector dimensions across chunks.');
  }

  const out = {
    model: MODEL,
    dim,
    builtAt: new Date().toISOString(),
    chunks: chunks.map((c, i) => ({ ...c, vector: vectors[i] })),
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(out));
  console.log(`Wrote ${OUTPUT} (${out.chunks.length} chunks, dim=${dim})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
