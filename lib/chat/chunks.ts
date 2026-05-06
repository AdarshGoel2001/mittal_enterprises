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
  const intro: string[] = [];
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

export function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  const categoryById = new Map(productCategories.map((c) => [c.id, c]));

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

  for (const product of products) {
    const category = categoryById.get(product.categoryId);
    const url = category ? `/products/${category.slug}/${product.slug}` : '/products';
    const md = getProductMarkdown(product.slug) || '';
    const extracted = extractModelsFromMarkdown(md);
    const modelsLine = extracted.models.length > 0 ? ` Models: ${extracted.models.join(', ')}.` : '';

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

    const { intro, sections } = splitOnH2(extracted.markdown);
    const allSections: RawSection[] = [];
    if (intro && wordCount(stripMarkdown(intro)) >= MIN_SECTION_WORDS) {
      allSections.push({ title: 'Overview', body: intro });
    } else if (intro && sections.length > 0) {
      sections[0] = { ...sections[0], body: `${intro}\n\n${sections[0].body}` };
    } else if (intro && sections.length === 0) {
      allSections.push({ title: 'Overview', body: intro });
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
