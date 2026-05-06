import { companyKnowledgeSections, globalSupplyServices, profilePillars } from '@/lib/company-content';
import { companyInfo, productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';
import { extractModelsFromMarkdown, getProductMarkdown } from '@/lib/products-content';
import type { Chunk } from '@/lib/chat/chunks';
import embeddingsJson from '@/lib/chat/embeddings.json';

export type KnowledgeKind = 'company' | 'category' | 'product';

interface EmbeddedChunk extends Chunk {
  vector: number[];
}

interface EmbeddingsFile {
  model: string;
  dim: number;
  builtAt: string;
  chunks: EmbeddedChunk[];
}

const EMBEDDINGS = embeddingsJson as EmbeddingsFile;
const KEYWORD_SCORE_CEILING = 100;
const EMBED_MODEL = 'gemini-embedding-001';
const EMBED_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;
const EMBED_DIM = 768;

export interface ChatSource {
  id: string;
  kind: KnowledgeKind;
  title: string;
  url: string;
}

interface KnowledgeRecord extends ChatSource {
  text: string;
  searchText: string;
  itemCode?: string;
  itemCodeNormalized?: string;
}

const CONTACT_URL = '/contact';
const ENQUIRY_URL = '/enquiry';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'can',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'of',
  'or',
  'our',
  'tell',
  'the',
  'to',
  'we',
  'what',
  'which',
  'with',
  'you',
  'your',
]);

function stripMarkdown(input: string | undefined) {
  if (!input) return '';
  return input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\$\$[^$]*\$\$/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function compactCode(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function tokensFrom(input: string) {
  return Array.from(
    new Set(
      normalize(input)
        .split(' ')
        .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
    )
  );
}

const categoryById = new Map(productCategories.map((category) => [category.id, category]));

const categoryRecords: KnowledgeRecord[] = productCategories.map((category) => {
  const categoryProducts = products
    .filter((product) => product.categoryId === category.id)
    .map((product) => `${product.name} (${product.itemCode})`)
    .join(', ');

  const text = [
    `${category.name}.`,
    category.description,
    category.fullDescription,
    categoryProducts ? `Products in this category: ${categoryProducts}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: `category:${category.slug}`,
    kind: 'category',
    title: category.name,
    url: `/products/${category.slug}`,
    text,
    searchText: normalize(text),
  };
});

const productRecords: KnowledgeRecord[] = products.map((product) => {
  const category = categoryById.get(product.categoryId);
  const md = getProductMarkdown(product.slug);
  const extracted = extractModelsFromMarkdown(md);
  const details = stripMarkdown(extracted.markdown);
  const modelsText = extracted.models.length > 0 ? `Models: ${extracted.models.join(', ')}.` : '';
  const text = [
    `${product.name}.`,
    `Item code: ${product.itemCode}.`,
    category ? `Category: ${category.name}.` : '',
    product.description,
    details,
    modelsText,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: `product:${product.slug}`,
    kind: 'product',
    title: product.name,
    url: category ? `/products/${category.slug}/${product.slug}` : `/products`,
    text,
    searchText: normalize(text),
    itemCode: product.itemCode,
    itemCodeNormalized: compactCode(product.itemCode),
  };
});

const companyRecords: KnowledgeRecord[] = [
  {
    id: 'company:contact',
    kind: 'company',
    title: 'Contact details',
    url: CONTACT_URL,
    text: `Contact Mittal Enterprises at ${companyInfo.email}. Phones: ${companyInfo.phone.join(', ')} and office ${companyInfo.phoneOffice}. Address: ${companyInfo.address}.`,
    searchText: normalize(`contact ${companyInfo.email} ${companyInfo.phone.join(' ')} ${companyInfo.phoneOffice} ${companyInfo.address}`),
  },
  {
    id: 'company:quote',
    kind: 'company',
    title: 'Quotes and enquiries',
    url: ENQUIRY_URL,
    text: 'For quotes, pricing, lead time, bulk orders, custom requirements and delivery timelines, use the enquiry form and share category, product, quantity and experiment details.',
    searchText: normalize('quotes pricing lead time bulk orders custom requirements delivery timelines enquiry form'),
  },
  {
    id: 'company:services',
    kind: 'company',
    title: 'International and support services',
    url: '/global-supplies',
    text: globalSupplyServices.map((item) => `${item.title}: ${item.body}`).join(' '),
    searchText: normalize(globalSupplyServices.map((item) => `${item.title} ${item.body}`).join(' ')),
  },
  {
    id: 'company:profile-pillars',
    kind: 'company',
    title: 'Company strengths',
    url: '/profile',
    text: profilePillars.map((item) => `${item.title}: ${item.body}`).join(' '),
    searchText: normalize(profilePillars.map((item) => `${item.title} ${item.body}`).join(' ')),
  },
  {
    id: 'company:catalog-overview',
    kind: 'company',
    title: 'Product catalog overview',
    url: '/products',
    text: `Mittal Enterprises lists ${products.length} products across ${productCategories.length} categories. Categories: ${productCategories.map((category) => category.name).join(', ')}.`,
    searchText: normalize(`catalog overview all products all categories ${productCategories.map((category) => category.name).join(' ')}`),
  },
  ...companyKnowledgeSections.map((section) => ({
    id: `company:${section.id}`,
    kind: 'company' as const,
    title: section.title,
    url: section.url,
    text: section.body,
    searchText: normalize(section.body),
  })),
];

const KNOWLEDGE_BASE: KnowledgeRecord[] = [
  ...companyRecords,
  ...categoryRecords,
  ...productRecords,
];

function scoreRecord(query: string, record: KnowledgeRecord) {
  const normalizedQuery = normalize(query);
  const tokens = tokensFrom(query);
  const compactQuery = compactCode(query);
  let score = 0;

  if (!normalizedQuery) return score;

  const title = normalize(record.title);
  if (title.includes(normalizedQuery)) score += 30;
  if (record.searchText.includes(normalizedQuery)) score += 18;
  if (record.itemCodeNormalized && compactQuery === record.itemCodeNormalized) score += 80;

  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    if (record.searchText.includes(token)) score += 3;
    if (record.itemCodeNormalized?.includes(token)) score += 12;
  }

  if (record.kind === 'product' && /\b(spec|specs|model|models|code|item)\b/.test(normalizedQuery)) {
    score += 4;
  }

  if (record.kind === 'company' && /\b(price|pricing|quote|lead|time|bulk|shipping|international|contact|delivery)\b/.test(normalizedQuery)) {
    score += 7;
  }

  if (record.kind === 'category' && /\b(category|categories|catalog|products)\b/.test(normalizedQuery)) {
    score += 5;
  }

  return score;
}

function kindForSource(kind: Chunk['kind']): KnowledgeKind {
  if (
    kind === 'product-identity' ||
    kind === 'product-section' ||
    kind === 'product-citations-summary' ||
    kind === 'citation'
  ) return 'product';
  return kind;
}

async function embedQuery(query: string): Promise<number[] | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${EMBED_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: query }] },
        taskType: 'RETRIEVAL_QUERY',
        outputDimensionality: EMBED_DIM,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { embedding?: { values?: number[] } };
    const values = data.embedding?.values;
    if (!Array.isArray(values) || values.length === 0) return null;
    return values;
  } catch {
    return null;
  }
}

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function keywordScoreForChunk(query: string, chunk: Chunk): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  const tokens = tokensFrom(query);
  const compactQuery = compactCode(query);
  const title = normalize(chunk.title);
  const searchText = normalize(chunk.text);
  const itemCodeNormalized = chunk.itemCode ? compactCode(chunk.itemCode) : undefined;

  let score = 0;
  if (title.includes(normalizedQuery)) score += 30;
  if (searchText.includes(normalizedQuery)) score += 18;
  if (itemCodeNormalized && compactQuery === itemCodeNormalized) score += 80;

  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    if (searchText.includes(token)) score += 3;
    if (itemCodeNormalized?.includes(token)) score += 12;
  }

  if ((chunk.kind === 'product-identity' || chunk.kind === 'product-section') && /\b(spec|specs|model|models|code|item)\b/.test(normalizedQuery)) {
    score += 4;
  }
  if (chunk.kind === 'company' && /\b(price|pricing|quote|lead|time|bulk|shipping|international|contact|delivery)\b/.test(normalizedQuery)) {
    score += 7;
  }
  if (chunk.kind === 'category' && /\b(category|categories|catalog|products)\b/.test(normalizedQuery)) {
    score += 5;
  }

  return Math.min(score, KEYWORD_SCORE_CEILING);
}

function exactItemCodeMatch(query: string): EmbeddedChunk | undefined {
  const compactQuery = compactCode(query);
  if (!compactQuery) return undefined;
  return EMBEDDINGS.chunks.find(
    (chunk) => chunk.kind === 'product-identity' && chunk.itemCode && compactCode(chunk.itemCode) === compactQuery
  );
}

const DEFAULT_SOURCES: ChatSource[] = [
  { id: 'company:catalog-overview', kind: 'company', title: 'Product catalog overview', url: '/products' },
  { id: 'company:services', kind: 'company', title: 'International and support services', url: '/global-supplies' },
  { id: 'company:contact', kind: 'company', title: 'Contact details', url: '/contact' },
];

function keywordFallbackSources(query: string, limit: number): ChatSource[] {
  const scored = KNOWLEDGE_BASE
    .map((record) => ({ record, score: scoreRecord(query, record) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.record);

  if (scored.length > 0) {
    return scored.map(({ id, kind, title, url }) => ({ id, kind, title, url }));
  }
  return DEFAULT_SOURCES;
}

export async function searchKnowledge(
  query: string,
  limit = 6
): Promise<{ sources: ChatSource[]; mode: 'vector' | 'keyword-fallback' }> {
  if (EMBEDDINGS.chunks.length === 0) {
    return { sources: keywordFallbackSources(query, limit), mode: 'keyword-fallback' };
  }
  const queryVector = await embedQuery(query);
  if (!queryVector) {
    return { sources: keywordFallbackSources(query, limit), mode: 'keyword-fallback' };
  }

  const scored = EMBEDDINGS.chunks
    .map((chunk) => {
      const cos = cosine(queryVector, chunk.vector);
      const kw = keywordScoreForChunk(query, chunk) / KEYWORD_SCORE_CEILING;
      return { chunk, score: 0.7 * cos + 0.3 * kw };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.chunk);

  const exact = exactItemCodeMatch(query);
  const ordered: EmbeddedChunk[] = [];
  if (exact) ordered.push(exact);
  for (const chunk of scored) {
    if (exact && chunk.id === exact.id) continue;
    ordered.push(chunk);
  }

  const seenUrls = new Set<string>();
  const sources: ChatSource[] = [];
  for (const chunk of ordered) {
    if (seenUrls.has(chunk.url)) continue;
    seenUrls.add(chunk.url);
    sources.push({
      id: chunk.id,
      kind: kindForSource(chunk.kind),
      title: chunk.title,
      url: chunk.url,
    });
    if (sources.length >= limit) break;
  }

  return { sources, mode: 'vector' };
}

export async function buildGroundingContext(query: string, limit = 6) {
  const { sources, mode } = await searchKnowledge(query, limit);

  const lines: string[] = [];
  sources.forEach((source, index) => {
    let title = source.title;
    let text = '';
    let kind: string = source.kind;

    if (mode === 'vector') {
      const chunk = EMBEDDINGS.chunks.find((c) => c.id === source.id);
      if (chunk) {
        title = chunk.title;
        text = chunk.text;
        kind = chunk.kind;
      }
    }
    if (!text) {
      const record = KNOWLEDGE_BASE.find((r) => r.id === source.id);
      if (record) {
        title = record.title;
        text = record.text;
        kind = record.kind;
      }
    }

    lines.push(`[${index + 1}] ${title}\nURL: ${source.url}\nType: ${kind}\nContent: ${text}`);
  });

  return {
    sources,
    context: lines.join('\n\n'),
    mode,
  };
}

