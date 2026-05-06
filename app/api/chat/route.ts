import { NextResponse } from 'next/server';
import { buildGroundingContext, type ChatSource } from '@/lib/chat/catalog';
import { productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

const MAX_MESSAGE_CHARS = 1500;
const MAX_MESSAGES = 20;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
}

export interface ChatSuggestion {
  kind: 'enquiry' | 'contact';
  productSlug?: string;
  categorySlug?: string;
  label: string;
  href: string;
}

// Sliding-window rate limit. Single-region Vercel — module-level Map is fine.
const rateBuckets = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
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

function systemPrompt(groundingContext: string) {
  return [
    'You are the website assistant for Mittal Enterprises, a Delhi-based manufacturer of laboratory scientific instruments established in 1976.',
    'Answer only from the supplied grounding context.',
    'Do not invent pricing, discounts, stock, lead time, shipping timelines, dimensions, voltage variants, certifications, or product specifications that are not explicitly present in the grounding context.',
    'If information is not available in the grounding context, say that it is not listed on the website and direct the user to request a quote or contact the company.',
    'Be concise, practical, and sales-supportive without sounding promotional.',
    'When you mention a specific product or category, prefer to include its item code or page path when available.',
    'If the user wants pricing, a quote, bulk ordering, international delivery, or custom requirements, tell them to use /enquiry or /contact.',
    'Use short paragraphs or flat bullets when useful.',
    'Cite factual claims inline with the supplied source numbers like [1] or [2]. Use only source numbers that exist in the grounding context.',
    '',
    'Grounding context:',
    groundingContext,
  ].join('\n');
}

function toGeminiContents(messages: ApiMessage[]) {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
}

const ITEM_CODE_RE = /\b[A-Z]{2,}-?\d+[A-Z0-9-]*\b/g;
const CAPITAL_PHRASE_RE = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,4})\b/g;

const TITLE_INDEX: string[] = [
  ...productCategories.map((c) => c.name),
  ...products.map((p) => p.name),
];

function extractAssistantSignal(text: string): string[] {
  const signals = new Set<string>();
  for (const m of text.matchAll(ITEM_CODE_RE)) signals.add(m[0]);
  for (const m of text.matchAll(CAPITAL_PHRASE_RE)) signals.add(m[1]);
  for (const title of TITLE_INDEX) {
    if (text.toLowerCase().includes(title.toLowerCase())) signals.add(title);
  }
  return Array.from(signals);
}

function buildEnrichedQuery(messages: ApiMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')?.content || '';
  const priorUsers = messages
    .filter((m) => m.role === 'user')
    .slice(-3, -1)
    .map((m) => m.content);
  const signals = extractAssistantSignal(lastAssistant);
  return [...priorUsers, ...signals, lastUser].filter(Boolean).join('\n');
}

const ENQUIRY_KEYWORDS = /\b(quote|quotes|quotation|pricing|price|prices|cost|bulk|order|orders|buy|purchase|lead\s*time|delivery|shipping|ship|custom|customi[sz]ation|customi[sz]ed)\b/i;
const CONTACT_KEYWORDS = /\b(contact|call|email|phone|reach|speak|talk)\b/i;

function detectSuggestion(latestUserMessage: string, sources: ChatSource[]): ChatSuggestion | undefined {
  const wantsEnquiry = ENQUIRY_KEYWORDS.test(latestUserMessage);
  const wantsContact = CONTACT_KEYWORDS.test(latestUserMessage);
  if (!wantsEnquiry && !wantsContact) return undefined;

  const product = sources.find((s) => s.kind === 'product');
  const category = sources.find((s) => s.kind === 'category');

  if (wantsEnquiry) {
    if (product) {
      const slug = product.id.replace(/^product:/, '');
      return {
        kind: 'enquiry',
        productSlug: slug,
        label: `Request a quote for ${product.title}`,
        href: `/enquiry?product=${encodeURIComponent(slug)}`,
      };
    }
    if (category) {
      const slug = category.id.replace(/^category:/, '');
      return {
        kind: 'enquiry',
        categorySlug: slug,
        label: `Request a quote for ${category.title}`,
        href: `/enquiry?category=${encodeURIComponent(slug)}`,
      };
    }
    return { kind: 'enquiry', label: 'Request a quote', href: '/enquiry' };
  }

  // contact intent
  if (product) {
    const slug = product.id.replace(/^product:/, '');
    return {
      kind: 'contact',
      productSlug: slug,
      label: `Contact us about ${product.title}`,
      href: '/contact',
    };
  }
  return { kind: 'contact', label: 'Contact us', href: '/contact' };
}

function extractText(payload: GeminiResponse) {
  return payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();
}

const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

export async function POST(request: Request) {
  const start = Date.now();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  const body = (await request.json()) as { messages?: ApiMessage[] };
  const messages = (body.messages || []).filter(
    (message): message is ApiMessage =>
      Boolean(message?.content) && (message.role === 'user' || message.role === 'assistant')
  );

  if (messages.length === 0) {
    console.log(JSON.stringify({ ip, query: '', sourceIds: [], latencyMs: Date.now() - start, status: 400 }));
    return NextResponse.json({ error: 'Missing chat messages.' }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    console.log(JSON.stringify({ ip, query: '', sourceIds: [], latencyMs: Date.now() - start, status: 400 }));
    return NextResponse.json(
      {
        configured: true,
        message: 'This conversation is getting long. Please refresh the chat to start a new session.',
        sources: [],
      },
      { status: 400 }
    );
  }

  const latestUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  if (latestUser.length > MAX_MESSAGE_CHARS) {
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: [], latencyMs: Date.now() - start, status: 400 }));
    return NextResponse.json(
      {
        configured: true,
        message: `Please keep messages under ${MAX_MESSAGE_CHARS} characters.`,
        sources: [],
      },
      { status: 400 }
    );
  }

  if (!rateLimit(ip)) {
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: [], latencyMs: Date.now() - start, status: 429 }));
    return NextResponse.json(
      {
        configured: true,
        message: 'You have sent a lot of messages in a short window. Please wait a few minutes and try again.',
        sources: [],
      },
      { status: 429 }
    );
  }

  const query = buildEnrichedQuery(messages);
  const { context, sources, mode: retrievalMode } = await buildGroundingContext(query);
  const suggestion = detectSuggestion(latestUser, sources);

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: sources.map((s) => s.id), latencyMs: Date.now() - start, status: 200 }));
    return NextResponse.json({
      configured: false,
      message:
        'The assistant is wired up, but the Gemini API key is not configured yet. Add GEMINI_API_KEY or GOOGLE_API_KEY to .env.local, restart the Next.js server, and the chat will start answering from the website catalog.',
      sources,
      suggestion,
    });
  }

  const response = await fetch(`${GEMINI_ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt(context) }],
      },
      contents: toGeminiContents(messages.slice(-10)),
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 700,
      },
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: sources.map((s) => s.id), latencyMs: Date.now() - start, status: response.status }));
    return NextResponse.json(
      {
        error: payload.error?.message || 'Gemini request failed.',
      },
      { status: 502 }
    );
  }

  if (payload.promptFeedback?.blockReason) {
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: sources.map((s) => s.id), latencyMs: Date.now() - start, status: 200, blocked: payload.promptFeedback.blockReason }));
    return NextResponse.json({
      configured: true,
      message: 'I could not answer that request because Gemini blocked the prompt. Please rephrase it and try again.',
      sources,
      suggestion,
    });
  }

  const message = extractText(payload);
  if (!message) {
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: sources.map((s) => s.id), latencyMs: Date.now() - start, status: 502 }));
    return NextResponse.json(
      {
        error: 'Gemini did not return any text.',
      },
      { status: 502 }
    );
  }

  console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: sources.map((s) => s.id), latencyMs: Date.now() - start, status: 200, retrievalMode }));
  return NextResponse.json({
    configured: true,
    message,
    sources,
    suggestion,
  });
}
