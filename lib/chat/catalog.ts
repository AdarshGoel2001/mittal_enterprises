import { companyKnowledgeSections, globalSupplyServices, profilePillars } from '@/lib/company-content';
import { companyInfo, productCategories } from '@/lib/data';
import { extractModels } from '@/lib/product-utils';
import { products } from '@/lib/products-data';

export type KnowledgeKind = 'company' | 'category' | 'product';

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

function decodeEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtml(input: string | undefined) {
  if (!input) return '';
  return decodeEntities(input)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(strong|b|em|i|p|ul|ol|li)[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+\n/g, '\n')
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
  const extracted = extractModels(product.fullDescription);
  const details = stripHtml(extracted.html || product.fullDescription);
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

export function searchKnowledge(query: string, limit = 6): ChatSource[] {
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

export function buildGroundingContext(query: string, limit = 6) {
  const sources = searchKnowledge(query, limit);
  const records = sources
    .map((source) => KNOWLEDGE_BASE.find((record) => record.id === source.id))
    .filter((record): record is KnowledgeRecord => Boolean(record));

  const context = records
    .map((record, index) => {
      return `[${index + 1}] ${record.title}\nURL: ${record.url}\nType: ${record.kind}\nContent: ${record.text}`;
    })
    .join('\n\n');

  return {
    sources,
    context,
  };
}

