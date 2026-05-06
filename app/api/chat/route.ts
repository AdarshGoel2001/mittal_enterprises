import { NextResponse } from 'next/server';
import { buildGroundingContext, type ChatSource } from '@/lib/chat/catalog';
import { logChatTurn } from '@/lib/chat/log';
import { checkRateLimit } from '@/lib/chat/rate-limit';
import { productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

const MAX_MESSAGE_CHARS = 1500;
const MAX_MESSAGES = 20;

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

interface PageContext {
  kind: 'product' | 'category' | 'other';
  productName?: string;
  productSlug?: string;
  itemCode?: string;
  categoryName?: string;
  categorySlug?: string;
}

function resolvePathContext(pathname: string | undefined): PageContext {
  if (!pathname) return { kind: 'other' };
  const productMatch = pathname.match(/^\/products\/([^/]+)\/([^/?#]+)/);
  if (productMatch) {
    const product = products.find((p) => p.slug === productMatch[2]);
    const category = product
      ? productCategories.find((c) => c.id === product.categoryId)
      : undefined;
    if (product) {
      return {
        kind: 'product',
        productName: product.name,
        productSlug: product.slug,
        itemCode: product.itemCode,
        categoryName: category?.name,
        categorySlug: category?.slug,
      };
    }
  }
  const categoryMatch = pathname.match(/^\/products\/([^/?#]+)/);
  if (categoryMatch) {
    const category = productCategories.find((c) => c.slug === categoryMatch[1]);
    if (category) {
      return { kind: 'category', categoryName: category.name, categorySlug: category.slug };
    }
  }
  return { kind: 'other' };
}

function pageContextLine(ctx: PageContext): string | null {
  if (ctx.kind === 'product') {
    return `The user is currently viewing the product page for ${ctx.productName} (item code ${ctx.itemCode}, category ${ctx.categoryName ?? 'unknown'}). Resolve ambiguous references like "this product", "it", or follow-up questions without an explicit subject as referring to ${ctx.productName} unless the user has clearly switched topics.`;
  }
  if (ctx.kind === 'category') {
    return `The user is currently viewing the ${ctx.categoryName} category page. Resolve "this category" or unscoped follow-ups as referring to ${ctx.categoryName} unless the user has clearly switched topics.`;
  }
  return null;
}

function systemPrompt(groundingContext: string, pageCtx: PageContext) {
  const pageLine = pageContextLine(pageCtx);
  return [
    'You are the website assistant for Mittal Enterprises, a Delhi-based manufacturer of laboratory scientific instruments established in 1976.',
    'Answer only from the supplied grounding context.',
    'Do not invent pricing, discounts, stock, lead time, shipping timelines, dimensions, voltage variants, certifications, or product specifications that are not explicitly present in the grounding context.',
    'If information is not available in the grounding context, say that it is not listed on the website and direct the user to request a quote or contact the company.',
    'Be concise, practical, and sales-supportive without sounding promotional.',
    'When you mention a specific product or category, include its item code in parentheses if available. Never include URLs or page paths in your reply — the source links are shown to the user separately.',
    'If the user wants pricing, a quote, bulk ordering, international delivery, or custom requirements, tell them to use /enquiry or /contact.',
    'Use short paragraphs or flat bullets when useful.',
    'Cite factual claims inline with the supplied source numbers like [1] or [2]. Use only source numbers that exist in the grounding context.',
    '',
    pageLine ? `Page context: ${pageLine}` : '',
    pageLine ? '' : '',
    'Grounding context:',
    groundingContext,
  ].filter((line, i, arr) => !(line === '' && arr[i - 1] === '')).join('\n');
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

function slugFromSourceId(id: string): string {
  return id.split(':')[1] ?? '';
}

function productTitle(title: string): string {
  return title.split(' — ')[0];
}

function detectSuggestion(
  latestUserMessage: string,
  sources: ChatSource[],
  pageCtx: PageContext
): ChatSuggestion | undefined {
  const wantsEnquiry = ENQUIRY_KEYWORDS.test(latestUserMessage);
  const wantsContact = CONTACT_KEYWORDS.test(latestUserMessage);
  if (!wantsEnquiry && !wantsContact) return undefined;

  const sourceProduct = sources.find((s) => s.kind === 'product');
  const sourceCategory = sources.find((s) => s.kind === 'category');

  const productSlug = sourceProduct ? slugFromSourceId(sourceProduct.id) : pageCtx.productSlug;
  const productName = sourceProduct ? productTitle(sourceProduct.title) : pageCtx.productName;
  const categorySlug = sourceCategory ? slugFromSourceId(sourceCategory.id) : pageCtx.categorySlug;
  const categoryName = sourceCategory?.title ?? pageCtx.categoryName;

  if (wantsEnquiry) {
    if (productSlug && productName) {
      return {
        kind: 'enquiry',
        productSlug,
        label: `Request a quote for ${productName}`,
        href: `/enquiry?product=${encodeURIComponent(productSlug)}`,
      };
    }
    if (categorySlug && categoryName) {
      return {
        kind: 'enquiry',
        categorySlug,
        label: `Request a quote for ${categoryName}`,
        href: `/enquiry?category=${encodeURIComponent(categorySlug)}`,
      };
    }
    return { kind: 'enquiry', label: 'Request a quote', href: '/enquiry' };
  }

  if (productSlug && productName) {
    return {
      kind: 'contact',
      productSlug,
      label: `Contact us about ${productName}`,
      href: '/contact',
    };
  }
  return { kind: 'contact', label: 'Contact us', href: '/contact' };
}

function extractText(payload: GeminiResponse) {
  return payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('') ?? '';
}

function sanitizeCitations(text: string, sourceCount: number): string {
  let out = text.replace(/\[(\d+)\]/g, (full, num: string) => {
    const n = parseInt(num, 10);
    if (Number.isNaN(n) || n < 1 || n > sourceCount) return '';
    return full;
  });
  out = out.replace(/(\[\d+\])(?:\1)+/g, '$1');
  return out;
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

  const body = (await request.json()) as { messages?: ApiMessage[]; pathname?: string };
  const messages = (body.messages || []).filter(
    (message): message is ApiMessage =>
      Boolean(message?.content) && (message.role === 'user' || message.role === 'assistant')
  );
  const pageCtx = resolvePathContext(typeof body.pathname === 'string' ? body.pathname : undefined);

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

  if (!(await checkRateLimit(ip))) {
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

  const baseQuery = buildEnrichedQuery(messages);
  const pageQueryHints = [pageCtx.productName, pageCtx.itemCode, pageCtx.categoryName]
    .filter((s): s is string => Boolean(s))
    .join(' ');
  const query = pageQueryHints ? `${baseQuery}\n${pageQueryHints}` : baseQuery;
  const { context, sources, mode: retrievalMode } = await buildGroundingContext(query);
  const suggestion = detectSuggestion(latestUser, sources, pageCtx);

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

  const upstream = await fetch(`${GEMINI_ENDPOINT}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt(context, pageCtx) }],
      },
      contents: toGeminiContents(messages.slice(-10)),
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 700,
        thinkingConfig: { thinkingBudget: 0 },
      },
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    let errorMessage = 'Gemini request failed.';
    try {
      const errPayload = (await upstream.json()) as GeminiResponse;
      errorMessage = errPayload.error?.message || errorMessage;
    } catch {
      // body wasn't JSON
    }
    console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds: sources.map((s) => s.id), latencyMs: Date.now() - start, status: upstream.status }));
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  const sourcesForStream = sources;
  const sourceIds = sources.map((s) => s.id);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('meta', { sources: sourcesForStream, suggestion });

      let fullText = '';
      let buffer = '';
      let blockReason: string | undefined;

      try {
        const reader = upstream.body!.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
          let sepIndex: number;
          while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
            const rawEvent = buffer.slice(0, sepIndex);
            buffer = buffer.slice(sepIndex + 2);
            const dataLines = rawEvent
              .split('\n')
              .filter((line) => line.startsWith('data:'))
              .map((line) => line.slice(5).trimStart());
            if (dataLines.length === 0) continue;
            const dataStr = dataLines.join('\n');
            if (!dataStr) continue;
            try {
              const payload = JSON.parse(dataStr) as GeminiResponse;
              if (payload.promptFeedback?.blockReason) {
                blockReason = payload.promptFeedback.blockReason;
              }
              const chunkText = extractText(payload);
              if (chunkText) {
                fullText += chunkText;
                send('token', { text: chunkText });
              }
            } catch {
              // partial / non-JSON data line; ignore
            }
          }
        }

        if (blockReason && !fullText) {
          send('error', {
            message: 'I could not answer that request because Gemini blocked the prompt. Please rephrase it and try again.',
          });
          console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds, latencyMs: Date.now() - start, status: 200, blocked: blockReason }));
        } else if (!fullText) {
          send('error', { message: 'Gemini did not return any text.' });
          console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds, latencyMs: Date.now() - start, status: 502 }));
        } else {
          const sanitized = sanitizeCitations(fullText, sourcesForStream.length);
          send('done', { text: sanitized });
          void logChatTurn({
            ip,
            pathname: typeof body.pathname === 'string' ? body.pathname : undefined,
            query: latestUser,
            response: sanitized,
            sourceIds,
            retrievalMode,
            latencyMs: Date.now() - start,
          }).catch(() => {});
          console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds, latencyMs: Date.now() - start, status: 200, retrievalMode }));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stream failed.';
        send('error', { message });
        console.log(JSON.stringify({ ip, query: latestUser.slice(0, 80), sourceIds, latencyMs: Date.now() - start, status: 502, streamError: message }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
