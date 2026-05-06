import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { buildChunks } from '../lib/chat/chunks';

const MODEL = 'gemini-embedding-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent`;
const OUTPUT_DIM = 768;
const CONCURRENCY = 5;
const OUTPUT = resolve(process.cwd(), 'lib/chat/embeddings.json');

interface EmbedResponse {
  embedding?: { values?: number[] };
  error?: { message?: string };
}

function parseRetrySeconds(message: string | undefined): number | null {
  if (!message) return null;
  const m = /retry in ([\d.]+)s/i.exec(message);
  return m ? Math.ceil(parseFloat(m[1])) : null;
}

async function embedOne(apiKey: string, text: string, attempt = 0): Promise<number[]> {
  const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${MODEL}`,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT',
      outputDimensionality: OUTPUT_DIM,
    }),
  });
  const payload = (await response.json()) as EmbedResponse;
  if (response.status === 429 && attempt < 3) {
    const wait = parseRetrySeconds(payload.error?.message) ?? 60;
    console.log(`  rate limited, waiting ${wait}s (attempt ${attempt + 1})`);
    await new Promise((r) => setTimeout(r, wait * 1000 + 500));
    return embedOne(apiKey, text, attempt + 1);
  }
  if (!response.ok || !payload.embedding?.values) {
    throw new Error(`Gemini embed failed: ${payload.error?.message || response.statusText}`);
  }
  return payload.embedding.values;
}

async function embedAll(apiKey: string, texts: string[]): Promise<number[][]> {
  const out: number[][] = new Array(texts.length);
  let next = 0;
  let done = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= texts.length) return;
      out[i] = await embedOne(apiKey, texts[i]);
      done++;
      if (done % 10 === 0 || done === texts.length) {
        console.log(`  embedded ${done}/${texts.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY (or GOOGLE_API_KEY) is required.');
    process.exit(1);
  }

  const chunks = buildChunks();
  console.log(`Built ${chunks.length} chunks. Embedding with ${MODEL} (dim=${OUTPUT_DIM})...`);

  const vectors = await embedAll(apiKey, chunks.map((c) => c.text));

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
