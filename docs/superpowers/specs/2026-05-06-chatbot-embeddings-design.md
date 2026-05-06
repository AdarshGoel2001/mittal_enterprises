# Chatbot embeddings — design

## Context

The Mittal Enterprises website chatbot (`components/ChatBubble.tsx` → `app/api/chat/route.ts` → `lib/chat/catalog.ts`) is grounded in a small knowledge base of company info, product categories, and product detail pages. Today retrieval is a hand-rolled keyword scorer over `searchText.includes(token)`, which misses natural-language queries like "instrument to measure ultrasonic velocity in liquids" when the right tokens don't co-occur.

This spec replaces the retrieval layer with semantic search using Gemini embeddings, while preserving the existing exact-item-code shortcut behavior the keyword scorer already gets right.

## Audience and intent (drives the design)

Audience priority for the chatbot, per Adarsh:

1. **Spec lookup (primary)** — visitor on a product page asking factual questions about that product.
2. **Qualification (high)** — "should we buy from Mittal?" — certifications, history, international shipping, customer base.
3. **Quote handoff (medium)** — already handled by the `suggestion` field on the API response, unchanged by this work.
4. **Discovery (lowest)** — "I need to measure X, what do you have?"

## Constraints

- **No paid API.** Gemini `text-embedding-004` is on the free tier; quota is generous for a B2B site's chat traffic.
- **No data fabrication** (CLAUDE.md, hard rule). Source of truth is the Next.js project's `lib/data.ts`, `lib/products-data.ts`, `lib/company-content.ts`, and `content/products/*.md`. The old PHP/DB dump is explicitly excluded from this work.
- **Deploys to Vercel.** Embedding JSON is committed; build script is manual, not part of `next build`.
- **No new runtime dependencies.** `tsx` is added as a dev dep only, to run the build script.

## What gets embedded

Three record kinds, ~80 chunks total. Each chunk: `{id, kind, title, url, text, vector}`.

### Product chunks (~60)

For each product in `lib/products-data.ts`:

- **One identity chunk** — name, item code, category name, one-line description. Guarantees identity and item-code questions hit even when the product markdown body is sparse.
- **One chunk per H2 section** of the product's markdown (`## Theory`, `## Specifications`, `## Instrument`, etc.). The H2 title is included in the chunk text so queries containing that word match. Sections shorter than 40 words are merged into the next sibling section rather than embedded as a stub.

### Category chunks (~7)

One per `productCategories` entry — name, description, full description, and a flat list of products in that category with item codes. Covers "what's in nano fluid science"-style questions.

### Company chunks (~10)

One per existing record in `lib/chat/catalog.ts` `companyRecords` (contact, quote, services, profile pillars, catalog overview, plus `companyKnowledgeSections`). Already short — no further splitting.

## Retrieval

`searchKnowledge(query, limit)` becomes async.

1. **Item-code short-circuit.** If `compactCode(query)` matches any product's `itemCodeNormalized`, that product's identity chunk is forced to position 1. Other top results follow per the hybrid score below.
2. **Hybrid score per record:**
   `score = 0.7 * cosine(queryVec, recordVec) + 0.3 * normalizedKeywordScore`
   `normalizedKeywordScore` is the existing `scoreRecord` output, divided by a constant ceiling so it lands in [0, 1] and doesn't dominate cosine.
3. **Top K = 6** (unchanged). Multiple chunks from the same product collapse to one source citation in the UI (deduplicated by product URL), but all selected chunk texts go into the grounding context for the model.
4. **Fallback.** If `embeddings.json` is missing or the runtime embed call fails (network, quota, missing key), fall back to today's pure keyword scorer. Log the fallback. Chat keeps working, retrieval is slightly worse.

## Embedding pipeline

- **Model.** Gemini `text-embedding-004`, 768-dim.
- **Task types.** `RETRIEVAL_DOCUMENT` for build-time corpus embeddings, `RETRIEVAL_QUERY` for runtime query embeddings. Same-task pairing meaningfully improves cosine quality on Gemini's embedding model.
- **Build script.** `scripts/build-embeddings.ts`:
  - Reads the same data sources as `lib/chat/catalog.ts`.
  - Builds chunks per the rules above. Deterministic chunk IDs (e.g. `product:abbe-refractometers:specifications`).
  - Embeds in batches.
  - Writes `lib/chat/embeddings.json` with shape `{model, dim, builtAt, chunks: [{id, kind, title, url, text, vector}]}`.
  - Idempotent and safe to re-run.
- **Runtime.** `lib/chat/catalog.ts` loads `embeddings.json` once at module init via dynamic import. `searchKnowledge` embeds the query (one Gemini call per chat turn), cosine-ranks, applies hybrid scoring, returns top sources.
- **Grounding context.** `buildGroundingContext` is unchanged in shape — it still returns `{sources, context}` and still numbers sources `[1]`, `[2]`, …

## API and UI impact

- `app/api/chat/route.ts` — change `searchKnowledge` call to `await`. Add a `retrievalMode: "vector" | "keyword-fallback"` field to the per-request log line. No response-shape change.
- `components/ChatBubble.tsx` — no changes. Source chips and inline citations work as-is.

## Files

| File | Change |
|---|---|
| `scripts/build-embeddings.ts` | New |
| `lib/chat/embeddings.json` | New, committed |
| `lib/chat/catalog.ts` | Modified — chunk builder, async `searchKnowledge`, hybrid scoring, keyword fallback |
| `app/api/chat/route.ts` | Modified — `await` and logging |
| `package.json` | Modified — `embed:build` script, `tsx` dev dep |

## Expected questions the bot should handle well after this

**Spec lookup:**
- "What's the refractive index range of the Abbe refractometer?" → Abbe Specifications chunk
- "Does the ultrasonic interferometer for solids include a CRO?" → Instrument chunk
- "Item code for the digital interferometer" → identity chunk, exact-code short-circuit
- "What's included with the Boltzmann constant kit?" → Instrument / what's-included chunk
- "Accuracy of the Abbe in sugar solution" → Specifications chunk

**Qualification:**
- "Are you ISO certified?" → company credentials / overview
- "Do you ship internationally?" → global-supplies
- "Who buys from you?" → companyAudiences (universities, IITs cited in product copy)
- "How long has Mittal been around?" → home-overview ("established in 1976")
- "Are your instruments cited in research?" → research-grade-precision credential

**Discovery (weakest by design):**
- "What do you have for measuring thermal conductivity?" → category chunk + thermal-conductivity-apparatus identity chunk

## Out of scope

- The old PHP/DB dump.
- Eval harness / golden query set (separate workstream).
- Re-embedding on content edits via CI hook.
- Streaming responses.
- Persistent conversation memory across sessions.
