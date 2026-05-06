# Chatbot Embeddings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the keyword-only retrieval in `lib/chat/catalog.ts` with semantic search using Gemini `text-embedding-004`, while preserving the existing exact-item-code shortcut and falling back to keyword scoring when embeddings are unavailable.

**Architecture:** Build-time script reads the same data sources `lib/chat/catalog.ts` already uses, splits product markdown on H2 headings into chunks, embeds each chunk with `RETRIEVAL_DOCUMENT` task type, writes `lib/chat/embeddings.json`. Runtime loads that JSON once at module init, embeds the user query with `RETRIEVAL_QUERY`, hybrid-scores `0.7 * cosine + 0.3 * keyword` per chunk, deduplicates by URL, returns top 6 sources. If the JSON is missing or runtime embedding fails, falls back to today's pure keyword scorer.

**Tech Stack:** Next.js 16, TypeScript, Gemini `text-embedding-004` (free tier), `tsx` for running the build script. No new runtime dependencies.

**Reference spec:** `docs/superpowers/specs/2026-05-06-chatbot-embeddings-design.md`

**Project convention:** No test framework is set up in this repo. Validation is `bun run build` (TypeScript + Next compile) plus manual smoke via `bun run dev`. Plan uses build + smoke verification, not unit tests.

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/build-embeddings.ts` (new) | One-shot script: build chunks, call Gemini batch embed, write JSON. |
| `lib/chat/chunks.ts` (new) | Pure functions to build the chunk list from existing data sources. Used by both the build script and (for fallback shape) the runtime. |
| `lib/chat/embeddings.json` (new, committed) | `{model, dim, builtAt, chunks: [{id, kind, title, url, text, vector}]}`. |
| `lib/chat/catalog.ts` (modified) | `searchKnowledge` becomes async; loads embeddings JSON, embeds query, hybrid-ranks, dedupes by URL. Falls back to existing keyword path on failure. |
| `app/api/chat/route.ts` (modified) | `await searchKnowledge(...)`. Add `retrievalMode` to the per-request log line. |
| `package.json` (modified) | Add `embed:build` script and `tsx` dev dep. |

Splitting chunk-building into `lib/chat/chunks.ts` keeps both the build script and `catalog.ts` reading the same chunking logic — no drift between what was embedded and what runtime expects.

---

### Task 1: Add `tsx` dev dep and `embed:build` script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install tsx as dev dependency**

Run: `bun add -d tsx`
Expected: `tsx` appears under `devDependencies`. (If `bun` is unavailable: `npm install --save-dev tsx`.)

- [ ] **Step 2: Add embed:build script**

Edit `package.json` `scripts` block. Final value:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "embed:build": "tsx scripts/build-embeddings.ts"
}
```

- [ ] **Step 3: Verify the script entry**

Run: `bun run embed:build` (it will fail because the script file doesn't exist yet — that's expected here).
Expected: error like `Cannot find module 'scripts/build-embeddings.ts'` or similar — confirms the npm/bun script entry is wired.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lockb package-lock.json 2>/dev/null
git commit -m "Add tsx dev dep and embed:build script"
```

(Stage only the lockfile that actually changed.)

---

### Task 2: Create `lib/chat/chunks.ts` — chunk builder

**Files:**
- Create: `lib/chat/chunks.ts`

This module exports `buildChunks(): Chunk[]` and is pure (no network, no fs). Both the build script and catalog.ts use it so types stay aligned.

- [ ] **Step 1: Write the chunk types and product-section splitter**

Create `lib/chat/chunks.ts`:

```ts
import { companyKnowledgeSections, globalSupplyServices, profilePillars } from '@/lib/company-content';
import { companyInfo, productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';
import { extractModelsFromMarkdown, getProductMarkdown } from '@/lib/products-content';

export type ChunkKind = 'company' | 'category' | 'product-identity' | 'product-section';

export interface Chunk {
  id: string;
  kind: ChunkKind;
  title: string;
  url: string;
  text: string;
  itemCode?: string;
  productSlug?: string;
  categorySlug?: string;
}

const MIN_SECTION_WORDS = 40;

function decodeEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripMarkdown(input: string): string {
  if (!input) return '';
  return decodeEntities(input)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\$\$[^$]*\$\$/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function slugifySection(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface RawSection {
  title: string;
  body: string;
}

function splitOnH2(markdown: string): { intro: string; sections: RawSection[] } {
  const lines = markdown.split('\n');
  let intro: string[] = [];
  const sections: RawSection[] = [];
  let current: RawSection | null = null;

  for (const line of lines) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    if (h2) {
      if (current) sections.push(current);
      current = { title: h2[1], body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line;
    } else {
      intro.push(line);
    }
  }
  if (current) sections.push(current);

  return {
    intro: intro.join('\n').trim(),
    sections: sections.map((s) => ({ title: s.title, body: s.body.trim() })),
  };
}

function mergeSmallSections(sections: RawSection[]): RawSection[] {
  const merged: RawSection[] = [];
  for (const section of sections) {
    const cleaned = stripMarkdown(section.body);
    if (cleaned && wordCount(cleaned) < MIN_SECTION_WORDS && merged.length > 0) {
      const last = merged[merged.length - 1];
      last.title = `${last.title} & ${section.title}`;
      last.body = `${last.body}\n\n${section.body}`;
    } else {
      merged.push({ ...section });
    }
  }
  return merged;
}
```

- [ ] **Step 2: Add the buildChunks function**

Append to `lib/chat/chunks.ts`:

```ts
export function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  const categoryById = new Map(productCategories.map((c) => [c.id, c]));

  // Company chunks
  chunks.push({
    id: 'company:contact',
    kind: 'company',
    title: 'Contact details',
    url: '/contact',
    text: `Contact Mittal Enterprises at ${companyInfo.email}. Phones: ${companyInfo.phone.join(', ')} and office ${companyInfo.phoneOffice}. Address: ${companyInfo.address}.`,
  });
  chunks.push({
    id: 'company:quote',
    kind: 'company',
    title: 'Quotes and enquiries',
    url: '/enquiry',
    text: 'For quotes, pricing, lead time, bulk orders, custom requirements and delivery timelines, use the enquiry form and share category, product, quantity and experiment details.',
  });
  chunks.push({
    id: 'company:services',
    kind: 'company',
    title: 'International and support services',
    url: '/global-supplies',
    text: globalSupplyServices.map((item) => `${item.title}: ${item.body}`).join(' '),
  });
  chunks.push({
    id: 'company:profile-pillars',
    kind: 'company',
    title: 'Company strengths',
    url: '/profile',
    text: profilePillars.map((item) => `${item.title}: ${item.body}`).join(' '),
  });
  chunks.push({
    id: 'company:catalog-overview',
    kind: 'company',
    title: 'Product catalog overview',
    url: '/products',
    text: `Mittal Enterprises lists ${products.length} products across ${productCategories.length} categories. Categories: ${productCategories.map((c) => c.name).join(', ')}.`,
  });
  for (const section of companyKnowledgeSections) {
    chunks.push({
      id: `company:${section.id}`,
      kind: 'company',
      title: section.title,
      url: section.url,
      text: section.body,
    });
  }

  // Category chunks
  for (const category of productCategories) {
    const categoryProducts = products
      .filter((p) => p.categoryId === category.id)
      .map((p) => `${p.name} (${p.itemCode})`)
      .join(', ');
    const text = [
      `${category.name}.`,
      category.description,
      category.fullDescription,
      categoryProducts ? `Products in this category: ${categoryProducts}.` : '',
    ]
      .filter(Boolean)
      .join(' ');
    chunks.push({
      id: `category:${category.slug}`,
      kind: 'category',
      title: category.name,
      url: `/products/${category.slug}`,
      text,
      categorySlug: category.slug,
    });
  }

  // Product chunks: identity + per-section
  for (const product of products) {
    const category = categoryById.get(product.categoryId);
    const url = category ? `/products/${category.slug}/${product.slug}` : '/products';
    const md = getProductMarkdown(product.slug) || '';
    const extracted = extractModelsFromMarkdown(md);
    const modelsLine = extracted.models.length > 0 ? ` Models: ${extracted.models.join(', ')}.` : '';

    // Identity chunk — always present
    chunks.push({
      id: `product:${product.slug}:identity`,
      kind: 'product-identity',
      title: product.name,
      url,
      text: `${product.name}. Item code: ${product.itemCode}.${category ? ` Category: ${category.name}.` : ''} ${product.description}${modelsLine}`.trim(),
      itemCode: product.itemCode,
      productSlug: product.slug,
      categorySlug: category?.slug,
    });

    // Section chunks from the markdown body
    const { intro, sections } = splitOnH2(extracted.markdown);
    const allSections: RawSection[] = [];
    if (intro && wordCount(stripMarkdown(intro)) >= MIN_SECTION_WORDS) {
      allSections.push({ title: 'Overview', body: intro });
    } else if (intro && sections.length > 0) {
      // Prepend small intro to the first section so we don't lose it
      sections[0] = { ...sections[0], body: `${intro}\n\n${sections[0].body}` };
    }
    allSections.push(...sections);

    const merged = mergeSmallSections(allSections);
    for (const section of merged) {
      const text = stripMarkdown(section.body);
      if (!text) continue;
      chunks.push({
        id: `product:${product.slug}:${slugifySection(section.title)}`,
        kind: 'product-section',
        title: `${product.name} — ${section.title}`,
        url,
        text: `${section.title}: ${text}`,
        itemCode: product.itemCode,
        productSlug: product.slug,
        categorySlug: category?.slug,
      });
    }
  }

  return chunks;
}
```

- [ ] **Step 3: Type-check via build**

Run: `bun run build`
Expected: PASS. No imports yet from this file in app code, so it just type-checks in isolation.

- [ ] **Step 4: Commit**

```bash
git add lib/chat/chunks.ts
git commit -m "Add chunk builder for chatbot embeddings"
```

---

### Task 3: Create `scripts/build-embeddings.ts`

**Files:**
- Create: `scripts/build-embeddings.ts`

- [ ] **Step 1: Write the script**

Create `scripts/build-embeddings.ts`:

```ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { buildChunks, type Chunk } from '../lib/chat/chunks';

const MODEL = 'text-embedding-004';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:batchEmbedContents`;
const BATCH_SIZE = 100;
const OUTPUT = resolve(__dirname, '../lib/chat/embeddings.json');

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
```

- [ ] **Step 2: Type-check**

Run: `bun run build`
Expected: PASS. The script isn't wired into Next's build, but `tsc` (via `next build`) won't include it; tsx will type-check on run.

- [ ] **Step 3: Commit**

```bash
git add scripts/build-embeddings.ts
git commit -m "Add Gemini embeddings build script"
```

---

### Task 4: Run the build script and commit `embeddings.json`

**Files:**
- Create: `lib/chat/embeddings.json`

- [ ] **Step 1: Confirm GEMINI_API_KEY is set**

Run: `[ -n "$GEMINI_API_KEY" ] || [ -n "$GOOGLE_API_KEY" ] && echo set || echo missing`
Expected: `set`. If missing, source `.env.local` or export the key for this shell.

- [ ] **Step 2: Run the build script**

Run: `bun run embed:build`
Expected: prints `Built N chunks. Embedding...` then progress lines, then `Wrote .../lib/chat/embeddings.json (N chunks, dim=768)`. N should be ~80 (60 product + 7 category + 10 company, exact number depends on H2 splitting).

- [ ] **Step 3: Sanity-check the JSON**

Run: `node -e "const d=require('./lib/chat/embeddings.json'); console.log({chunks: d.chunks.length, dim: d.dim, sample: d.chunks[0].id, vecLen: d.chunks[0].vector.length})"`
Expected: chunks > 50, dim = 768, sample id starts with `company:` or `category:`, vecLen = 768.

- [ ] **Step 4: Commit**

```bash
git add lib/chat/embeddings.json
git commit -m "Generate initial chatbot embeddings"
```

---

### Task 5: Wire async hybrid retrieval in `lib/chat/catalog.ts`

**Files:**
- Modify: `lib/chat/catalog.ts`

The existing keyword scorer becomes the fallback. Vector retrieval is the primary path.

- [ ] **Step 1: Replace `searchKnowledge` with async hybrid version**

Open `lib/chat/catalog.ts`. At the top of the file, add imports and types:

```ts
import { buildChunks, type Chunk } from '@/lib/chat/chunks';
import embeddingsData from '@/lib/chat/embeddings.json';

interface EmbeddedChunk extends Chunk { vector: number[] }
interface EmbeddingsFile { model: string; dim: number; builtAt: string; chunks: EmbeddedChunk[] }

const EMBEDDINGS = embeddingsData as EmbeddingsFile;
```

(Keep the existing `KnowledgeRecord`, `scoreRecord`, `KNOWLEDGE_BASE` etc. — they power the fallback.)

Add a helper at the bottom of the file (above `buildGroundingContext`):

```ts
const QUERY_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent`;

async function embedQuery(query: string): Promise<number[] | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(`${QUERY_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text: query }] },
        taskType: 'RETRIEVAL_QUERY',
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { embedding?: { values?: number[] } };
    return payload.embedding?.values ?? null;
  } catch {
    return null;
  }
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

const KEYWORD_SCORE_CEILING = 100;

function keywordScoreForChunk(query: string, chunk: EmbeddedChunk): number {
  // Adapter — reuses the same scoring shape as scoreRecord but against a Chunk.
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  const tokens = tokensFrom(query);
  const compactQuery = compactCode(query);
  const title = normalize(chunk.title);
  const search = normalize(chunk.text);
  let score = 0;
  if (title.includes(normalizedQuery)) score += 30;
  if (search.includes(normalizedQuery)) score += 18;
  if (chunk.itemCode && compactQuery === compactCode(chunk.itemCode)) score += 80;
  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    if (search.includes(token)) score += 3;
    if (chunk.itemCode && compactCode(chunk.itemCode).includes(token)) score += 12;
  }
  return Math.min(score, KEYWORD_SCORE_CEILING);
}

function exactItemCodeMatch(query: string): EmbeddedChunk | undefined {
  const compactQuery = compactCode(query);
  if (!compactQuery) return undefined;
  return EMBEDDINGS.chunks.find(
    (c) => c.kind === 'product-identity' && c.itemCode && compactCode(c.itemCode) === compactQuery
  );
}
```

- [ ] **Step 2: Replace the existing `searchKnowledge` function**

Find the current `export function searchKnowledge` (around `catalog.ts:257`) and replace the entire function with:

```ts
export async function searchKnowledge(
  query: string,
  limit = 6
): Promise<{ sources: ChatSource[]; mode: 'vector' | 'keyword-fallback' }> {
  const queryVec = await embedQuery(query);

  if (!queryVec || EMBEDDINGS.chunks.length === 0) {
    return { sources: keywordFallback(query, limit), mode: 'keyword-fallback' };
  }

  const exact = exactItemCodeMatch(query);
  const scored = EMBEDDINGS.chunks.map((chunk) => {
    const cos = cosine(queryVec, chunk.vector);
    const kw = keywordScoreForChunk(query, chunk) / KEYWORD_SCORE_CEILING;
    return { chunk, score: 0.7 * cos + 0.3 * kw };
  });

  scored.sort((a, b) => b.score - a.score);

  const seenUrls = new Set<string>();
  const picked: EmbeddedChunk[] = [];
  if (exact) {
    picked.push(exact);
    seenUrls.add(exact.url);
  }
  for (const { chunk } of scored) {
    if (picked.length >= limit) break;
    if (seenUrls.has(chunk.url)) continue;
    picked.push(chunk);
    seenUrls.add(chunk.url);
  }

  return {
    sources: picked.map((c) => ({ id: c.id, kind: kindForSource(c.kind), title: c.title, url: c.url })),
    mode: 'vector',
  };
}

function kindForSource(kind: Chunk['kind']): KnowledgeKind {
  if (kind === 'product-identity' || kind === 'product-section') return 'product';
  return kind;
}

function keywordFallback(query: string, limit: number): ChatSource[] {
  const scored = KNOWLEDGE_BASE
    .map((record) => ({ record, score: scoreRecord(query, record) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.record);
  if (scored.length > 0) {
    return scored.map(({ id, kind, title, url }) => ({ id, kind, title, url }));
  }
  return [
    { id: 'company:catalog-overview', kind: 'company', title: 'Product catalog overview', url: '/products' },
    { id: 'company:services', kind: 'company', title: 'International and support services', url: '/global-supplies' },
    { id: 'company:contact', kind: 'company', title: 'Contact details', url: '/contact' },
  ];
}
```

- [ ] **Step 3: Update `buildGroundingContext` to be async and use chunks**

Replace the existing `buildGroundingContext` with:

```ts
export async function buildGroundingContext(query: string, limit = 6) {
  const { sources, mode } = await searchKnowledge(query, limit);

  const contextRecords = sources
    .map((source) => {
      const chunk = EMBEDDINGS.chunks.find((c) => c.id === source.id);
      if (chunk) return { title: chunk.title, url: chunk.url, kind: chunk.kind, text: chunk.text };
      const fallback = KNOWLEDGE_BASE.find((r) => r.id === source.id);
      if (fallback) return { title: fallback.title, url: fallback.url, kind: fallback.kind, text: fallback.text };
      return null;
    })
    .filter((r): r is { title: string; url: string; kind: string; text: string } => r !== null);

  const context = contextRecords
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nType: ${r.kind}\nContent: ${r.text}`)
    .join('\n\n');

  return { sources, context, mode };
}
```

- [ ] **Step 4: Allow JSON module imports in tsconfig (only if not already enabled)**

Run: `grep -E '"resolveJsonModule"' tsconfig.json`
Expected: `"resolveJsonModule": true` is present. If absent, add it under `compilerOptions` in `tsconfig.json`.

- [ ] **Step 5: Type-check via build**

Run: `bun run build`
Expected: PASS. If TS complains about the `embeddings.json` import shape, ensure `"resolveJsonModule": true` and `"esModuleInterop": true` are both set in `tsconfig.json`.

- [ ] **Step 6: Commit**

```bash
git add lib/chat/catalog.ts tsconfig.json
git commit -m "Hybrid embedding + keyword retrieval in chat catalog"
```

(Stage `tsconfig.json` only if it was actually modified.)

---

### Task 6: Update `app/api/chat/route.ts` to await + log retrieval mode

**Files:**
- Modify: `app/api/chat/route.ts`

- [ ] **Step 1: Await the new async retrieval**

Find the line in `app/api/chat/route.ts` that reads:

```ts
const { context, sources } = buildGroundingContext(query);
```

Replace with:

```ts
const { context, sources, mode: retrievalMode } = await buildGroundingContext(query);
```

- [ ] **Step 2: Add retrievalMode to the per-request log**

Find the `console.log(JSON.stringify({...}))` log lines added by the prior backend hardening work. In the **success branch only** (after the Gemini call returns text), add `retrievalMode` to the logged object. Other branches (rate limit, validation) don't have a retrieval mode and should leave it off.

- [ ] **Step 3: Build to verify**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "Await async chat retrieval and log mode"
```

---

### Task 7: Smoke test end-to-end

**Files:** none modified.

- [ ] **Step 1: Start dev server**

Run: `bun run dev` (in a background-capable shell)
Expected: server running at `http://localhost:3000`.

- [ ] **Step 2: Open the chat bubble and ask a spec-lookup question**

Open `http://localhost:3000` in a browser. Click the "Assistant" button.

Type: `What's the refractive index range of the Abbe refractometer?`

Expected:
- An assistant response that cites the value `1.300 to 1.700` (it appears verbatim in the Abbe markdown specifications).
- A source chip linking to `/products/.../abbe-refractometers`.
- Server log line includes `"retrievalMode":"vector"`.

- [ ] **Step 3: Item-code shortcut**

Type the item code of any product (look one up in `lib/products-data.ts`, e.g. the Abbe refractometer's code).

Expected: the matching product is the first source chip.

- [ ] **Step 4: Qualification question**

Type: `Are you ISO certified?`

Expected: response cites the ISO 9001:2008 certification (from `companyCredentials` / `companyKnowledgeSections`). Source chip links to `/profile` or similar.

- [ ] **Step 5: Fallback path**

Stop the dev server. Temporarily rename `lib/chat/embeddings.json` (e.g. `mv lib/chat/embeddings.json lib/chat/embeddings.json.bak`). Restart `bun run dev`.

Expected: dev server fails to start because the module import is unresolved. This is fine — it confirms the JSON is required at build time.

To actually test the runtime fallback (network failure path, not missing-file), unset `GEMINI_API_KEY` and `GOOGLE_API_KEY` in the dev shell, restore the JSON, and re-run. Ask a question.

Expected: response still arrives (or the existing "not configured" message if the chat completion API key is also unset — that's separate from the embedding key). Server log line shows `"retrievalMode":"keyword-fallback"`.

Restore env vars and the JSON file before continuing.

- [ ] **Step 6: No commit needed for this task**

Smoke verification only.

---

### Task 8: Final build, lint, and summary commit

**Files:** none.

- [ ] **Step 1: Build**

Run: `bun run build`
Expected: PASS. Note bundle size impact — `embeddings.json` will be inlined in the API route's serverless function. ~500KB is acceptable; if it balloons past a few MB, switch to `fs.readFile` at runtime instead of `import`.

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: PASS, or only warnings (not errors).

- [ ] **Step 3: Confirm git state is clean**

Run: `git status`
Expected: working tree clean. All changes committed across prior tasks.

---

## Self-review

**Spec coverage:**
- Section 1 (what gets embedded — identity + per-section + category + company): Task 2.
- Section 2 (hybrid retrieval, item-code shortcut, top-K dedupe by URL, keyword fallback): Task 5.
- Section 3 (build script, RETRIEVAL_DOCUMENT, RETRIEVAL_QUERY, JSON shape): Tasks 3, 4, 5.
- API/UI impact (await, log mode, no UI change): Task 6.
- Files list: matches Tasks 1–6.
- Out-of-scope items (old PHP dump, evals, CI re-embed, streaming, persistent memory): not in plan. Correct.

**Placeholder scan:** none of the forbidden patterns. Each step has actual content.

**Type consistency:** `Chunk` defined in Task 2, used by name in Tasks 3 and 5. `EmbeddedChunk` extends it with `vector` in Task 5. `searchKnowledge` returns `{sources, mode}` in Task 5; consumed in Task 5's `buildGroundingContext` and Task 6's route handler. Match.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-05-06-chatbot-embeddings.md`.
