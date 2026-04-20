import { NextResponse } from 'next/server';
import { buildGroundingContext } from '@/lib/chat/catalog';

export const dynamic = 'force-dynamic';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

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

function latestUserQuery(messages: ApiMessage[]) {
  const recentUserMessages = messages.filter((message) => message.role === 'user').slice(-3);
  return recentUserMessages.map((message) => message.content).join('\n');
}

function extractText(payload: GeminiResponse) {
  return payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();
}

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: ApiMessage[] };
  const messages = (body.messages || []).filter(
    (message): message is ApiMessage =>
      Boolean(message?.content) && (message.role === 'user' || message.role === 'assistant')
  );

  if (messages.length === 0) {
    return NextResponse.json({ error: 'Missing chat messages.' }, { status: 400 });
  }

  const query = latestUserQuery(messages);
  const { context, sources } = buildGroundingContext(query);

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      message:
        'The assistant is wired up, but the Gemini API key is not configured yet. Add GEMINI_API_KEY or GOOGLE_API_KEY to .env.local, restart the Next.js server, and the chat will start answering from the website catalog.',
      sources,
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
    }),
  });

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    return NextResponse.json(
      {
        error: payload.error?.message || 'Gemini request failed.',
      },
      { status: 502 }
    );
  }

  if (payload.promptFeedback?.blockReason) {
    return NextResponse.json({
      configured: true,
      message: 'I could not answer that request because Gemini blocked the prompt. Please rephrase it and try again.',
      sources,
    });
  }

  const message = extractText(payload);
  if (!message) {
    return NextResponse.json(
      {
        error: 'Gemini did not return any text.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    configured: true,
    message,
    sources,
  });
}
