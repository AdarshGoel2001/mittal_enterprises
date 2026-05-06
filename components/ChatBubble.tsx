'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { products } from '@/lib/products-data';
import { productCategories } from '@/lib/data';

type Source = {
  id: string;
  kind: 'company' | 'category' | 'product';
  title: string;
  url: string;
};

type Suggestion = {
  kind: 'enquiry' | 'contact';
  productSlug?: string;
  categorySlug?: string;
  label: string;
  href: string;
};

type Message = {
  role: 'assistant' | 'user';
  content: string;
  sources?: Source[];
  suggestion?: Suggestion;
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      'Ask about products, item codes, company details, international shipping, or quote guidance. I only answer from the website catalog.',
  },
];

const DEFAULT_QUICK_REPLIES = [
  'Show ultrasonic interferometer options',
  'Which products are in nano science instruments?',
  'How do I request a bulk quote?',
  'What international shipping support do you offer?',
];

export function quickRepliesFor(pathname: string): string[] {
  if (!pathname) return DEFAULT_QUICK_REPLIES;

  // /products/[slug]/[productSlug]
  const productMatch = pathname.match(/^\/products\/([^/]+)\/([^/]+)\/?$/);
  if (productMatch) {
    const productSlug = productMatch[2];
    const product = products.find((p) => p.slug === productSlug);
    const name = product?.name || 'this product';
    return [
      `What models are available for the ${name}?`,
      `What is the item code for the ${name}?`,
      `Request a quote for the ${name}`,
      `What specs are listed for the ${name}?`,
    ];
  }

  // /products/[slug]
  const categoryMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
  if (categoryMatch) {
    const categorySlug = categoryMatch[1];
    const category = productCategories.find((c) => c.slug === categorySlug);
    const name = category?.name || 'this category';
    return [
      `Which products are in ${name}?`,
      `Show me item codes in ${name}`,
      `Request a quote for ${name}`,
      'What international shipping support do you offer?',
    ];
  }

  if (pathname.startsWith('/global-supplies')) {
    return [
      'What international shipping support do you offer?',
      'Which countries do you export to?',
      'How do I request an export quote?',
      'What documentation do you provide for exports?',
    ];
  }

  if (pathname.startsWith('/profile')) {
    return [
      'When was Mittal Enterprises established?',
      'What certifications does the company hold?',
      'What product categories do you manufacture?',
      'How do I contact the company?',
    ];
  }

  if (pathname.startsWith('/research')) {
    return [
      'Which instruments are used in nanofluid research?',
      'What parameters can the ultrasonic interferometer measure?',
      'Which products support thermal conductivity studies?',
      'Request a quote for a research lab',
    ];
  }

  if (pathname.startsWith('/contact')) {
    return [
      'What is the company address?',
      'What are the contact phone numbers?',
      'How do I request a quote instead?',
      'What international shipping support do you offer?',
    ];
  }

  if (pathname.startsWith('/enquiry')) {
    return [
      'What information should I include in an enquiry?',
      'How do I request a bulk quote?',
      'Do you ship internationally?',
      'Which categories do you manufacture?',
    ];
  }

  return DEFAULT_QUICK_REPLIES;
}

function citationsToMarkdownLinks(content: string, sources?: Source[]): string {
  if (!sources || sources.length === 0) return content;
  return content.replace(/\[(\d+)\]/g, (full, num) => {
    const idx = parseInt(num, 10) - 1;
    const source = sources[idx];
    if (!source) return full;
    const safeTitle = source.title.replace(/"/g, '');
    return `[\\[${num}\\]](${source.url} "${safeTitle}")`;
  });
}

function userMessageBody(content: string) {
  return content.split('\n').map((line, index) => (
    <p key={index} className={index > 0 ? 'mt-2' : ''}>
      {line}
    </p>
  ));
}

function assistantMessageBody(content: string, sources?: Source[]) {
  const prepared = citationsToMarkdownLinks(content, sources);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="first:mt-0 mt-2">{children}</p>,
        ul: ({ children }) => <ul className="mt-2 space-y-1 pl-4 list-disc marker:text-ink-muted">{children}</ul>,
        ol: ({ children }) => <ol className="mt-2 space-y-1 pl-5 list-decimal marker:text-ink-muted">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="mono rounded-sm bg-rule/30 px-1 py-px text-[0.85em]">{children}</code>,
        a: ({ href, title, children }) => {
          const childText = Array.isArray(children) ? children.join('') : String(children ?? '');
          const looksLikeCitation = /^\[\d+\]$/.test(childText);
          const className = looksLikeCitation
            ? 'mono text-[0.7em] text-ink-muted no-underline hover:text-ink hover:underline'
            : 'text-ink underline underline-offset-2 hover:text-accent';
          if (href && href.startsWith('/')) {
            return (
              <Link href={href} title={title} className={className}>
                {children}
              </Link>
            );
          }
          return (
            <a href={href} title={title} className={className}>
              {children}
            </a>
          );
        },
      }}
    >
      {prepared}
    </ReactMarkdown>
  );
}

const STORAGE_KEY = 'mittal:chat:v1';
const LEAD_DISMISSED_KEY = 'mittal:chat:lead-dismissed:v1';
const LEAD_CAPTURED_KEY = 'mittal:chat:lead-captured:v1';
const LEAD_PROMPT_THRESHOLD = 3;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readSessionFlag(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeSessionFlag(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // sessionStorage unavailable
  }
}

interface PersistedState {
  open: boolean;
  messages: Message[];
}

function loadPersisted(): PersistedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() || '/';

  const quickReplies = useMemo(() => quickRepliesFor(pathname).slice(0, 4), [pathname]);
  const hasUserSent = messages.some((m) => m.role === 'user');
  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  const [leadDismissed, setLeadDismissed] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadOrg, setLeadOrg] = useState('');
  const [leadContext, setLeadContext] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadConfirmedEmail, setLeadConfirmedEmail] = useState<string | null>(null);

  const inferredTopic = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role !== 'assistant' || !m.sources) continue;
      const productSource = m.sources.find((s) => s.kind === 'product');
      if (productSource) return productSource.title;
    }
    return '';
  }, [messages]);

  const showLeadPrompt =
    hydrated &&
    !leadCaptured &&
    !leadDismissed &&
    !leadFormOpen &&
    userMessageCount >= LEAD_PROMPT_THRESHOLD;

  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      setMessages(persisted.messages);
      setOpen(persisted.open);
    }
    setLeadDismissed(readSessionFlag(LEAD_DISMISSED_KEY));
    setLeadCaptured(readSessionFlag(LEAD_CAPTURED_KEY));
    setHydrated(true);
  }, []);

  function dismissLead() {
    setLeadDismissed(true);
    writeSessionFlag(LEAD_DISMISSED_KEY);
  }

  function openLeadForm() {
    setLeadContext(inferredTopic ? `Following up on chat about ${inferredTopic}` : '');
    setLeadError(null);
    setLeadFormOpen(true);
  }

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    if (leadSubmitting) return;
    const name = leadName.trim();
    const email = leadEmail.trim();
    if (!name) {
      setLeadError('Please enter your name.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setLeadError('Please enter a valid email address.');
      return;
    }
    setLeadError(null);
    setLeadSubmitting(true);
    try {
      const transcript = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));
      const response = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          organization: leadOrg.trim() || undefined,
          context: leadContext.trim() || undefined,
          pathname,
          transcript,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setLeadError(payload.error || 'Could not send. Please try again.');
        return;
      }
      setLeadConfirmedEmail(email);
      setLeadCaptured(true);
      setLeadFormOpen(false);
      writeSessionFlag(LEAD_CAPTURED_KEY);
    } catch {
      setLeadError('Could not send. Please check your connection and retry.');
    } finally {
      setLeadSubmitting(false);
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ open, messages }));
    } catch {
      // sessionStorage may be unavailable (Safari private mode); silently skip
    }
  }, [hydrated, open, messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, sending]);

  function clearChat() {
    setMessages(INITIAL_MESSAGES);
    setInput('');
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const nextMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    setStreaming(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          pathname,
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (!contentType.includes('text/event-stream')) {
        const payload = (await response.json()) as {
          configured?: boolean;
          message?: string;
          error?: string;
          sources?: Source[];
          suggestion?: Suggestion;
        };

        if (!response.ok) {
          throw new Error(payload.error || 'The assistant could not respond.');
        }

        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            content: payload.message || 'I could not generate an answer.',
            sources: payload.sources,
            suggestion: payload.suggestion,
          },
        ]);
        return;
      }

      if (!response.body) {
        throw new Error('The assistant could not respond.');
      }

      let assistantCreated = false;
      const upsertAssistant = (mutate: (m: Message) => Message, init?: Partial<Message>) => {
        setMessages((current) => {
          const copy = current.slice();
          if (!assistantCreated) {
            assistantCreated = true;
            copy.push({ role: 'assistant', content: '', ...init });
          }
          const idx = copy.length - 1;
          copy[idx] = mutate(copy[idx]);
          return copy;
        });
      };
      const ensureAssistant = (init?: Partial<Message>) => upsertAssistant((m) => ({ ...m, ...init }), init);
      const updateAssistant = (updater: (m: Message) => Message) => upsertAssistant(updater);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const handleEvent = (rawEvent: string) => {
        let eventName = 'message';
        const dataLines: string[] = [];
        for (const line of rawEvent.split('\n')) {
          if (line.startsWith('event:')) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trimStart());
          }
        }
        if (dataLines.length === 0) return;
        let data: unknown;
        try {
          data = JSON.parse(dataLines.join('\n'));
        } catch {
          return;
        }

        if (eventName === 'meta') {
          const meta = data as { sources?: Source[]; suggestion?: Suggestion };
          ensureAssistant({ sources: meta.sources, suggestion: meta.suggestion });
        } else if (eventName === 'token') {
          const tokenData = data as { text?: string };
          if (!tokenData.text) return;
          ensureAssistant();
          setStreaming(true);
          updateAssistant((m) => ({ ...m, content: m.content + (tokenData.text || '') }));
        } else if (eventName === 'done') {
          const doneData = data as { text?: string };
          ensureAssistant();
          updateAssistant((m) => ({ ...m, content: doneData.text ?? m.content }));
        } else if (eventName === 'error') {
          const errData = data as { message?: string };
          ensureAssistant();
          updateAssistant((m) => ({
            ...m,
            content: errData.message || 'The assistant could not respond. Please try again in a moment.',
          }));
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
        let sepIndex: number;
        while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
          const rawEvent = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);
          if (rawEvent.trim()) handleEvent(rawEvent);
        }
      }
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : 'The assistant could not respond. Please try again in a moment.';

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: fallback,
        },
      ]);
    } finally {
      setSending(false);
      setStreaming(false);
    }
  }

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed bottom-24 right-5 z-50 w-[24rem] max-w-[calc(100vw-2rem)] border border-rule bg-surface shadow-2xl rounded-sm origin-bottom-right transition-all duration-200 ${
          open ? 'pointer-events-auto opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
        }`}
      >
        <div className="flex items-center justify-between border-b border-rule bg-ink px-4 py-3 text-paper">
          <div>
            <p className="mono text-[0.65rem] uppercase tracking-widest text-paper/60">Mittal Enterprises</p>
            <p className="text-sm font-medium">Product Assistant</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center text-paper/70 transition-colors hover:text-paper"
          >
            ×
          </button>
        </div>

        <div className="h-[28rem] overflow-y-auto bg-paper p-4">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`}>
                <div
                  className={`max-w-[90%] rounded-sm px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'border border-rule bg-surface text-ink-2'
                      : 'ml-auto bg-ink text-paper'
                  }`}
                >
                  {message.role === 'assistant'
                    ? assistantMessageBody(message.content, message.sources)
                    : userMessageBody(message.content)}
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 flex max-w-[90%] flex-wrap gap-1.5">
                    {message.sources.map((source) => (
                      <Link
                        key={source.id}
                        href={source.url}
                        className="mono inline-flex items-center border border-rule px-2 py-1 text-[0.65rem] uppercase tracking-wide text-ink-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        {source.title}
                      </Link>
                    ))}
                  </div>
                )}
                {message.suggestion && message.suggestion.href && message.suggestion.label && (
                  <div className="mt-2 max-w-[90%]">
                    <Link
                      href={message.suggestion.href}
                      className="mono inline-flex w-full items-center justify-center bg-ink px-3 py-2 text-[0.7rem] uppercase tracking-widest text-paper transition-colors hover:bg-accent"
                    >
                      {message.suggestion.label}
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {sending && !streaming && (
              <div className="max-w-[90%] rounded-sm border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink-muted">
                Checking the catalog...
              </div>
            )}

            {showLeadPrompt && (
              <div className="rounded-sm border border-rule bg-surface p-3.5">
                <p className="mono text-[0.6rem] uppercase tracking-widest text-ink-muted">
                  Tailored Quote
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  Want a quote tailored to your use case? Share your details and we&apos;ll follow up with the conversation context.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openLeadForm}
                    className="mono inline-flex items-center justify-center bg-ink px-3 py-2 text-[0.7rem] uppercase tracking-widest text-paper transition-colors hover:bg-accent"
                  >
                    Yes, send →
                  </button>
                  <button
                    type="button"
                    onClick={dismissLead}
                    className="mono inline-flex items-center justify-center border border-rule px-3 py-2 text-[0.7rem] uppercase tracking-widest text-ink-muted transition-colors hover:border-ink hover:text-ink"
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}

            {leadFormOpen && !leadCaptured && (
              <form
                onSubmit={submitLead}
                className="space-y-2 rounded-sm border border-rule bg-surface p-3.5"
              >
                <p className="mono text-[0.6rem] uppercase tracking-widest text-ink-muted">
                  Your Details
                </p>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Name"
                  required
                  disabled={leadSubmitting}
                  className="w-full border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none disabled:opacity-50"
                />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={leadSubmitting}
                  className="w-full border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none disabled:opacity-50"
                />
                <input
                  type="text"
                  value={leadOrg}
                  onChange={(e) => setLeadOrg(e.target.value)}
                  placeholder="Organization (optional)"
                  disabled={leadSubmitting}
                  className="w-full border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none disabled:opacity-50"
                />
                <input
                  type="text"
                  value={leadContext}
                  onChange={(e) => setLeadContext(e.target.value)}
                  placeholder="Context (optional)"
                  disabled={leadSubmitting}
                  className="w-full border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none disabled:opacity-50"
                />
                {leadError && (
                  <p className="text-xs text-red-700">{leadError}</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="mono inline-flex items-center justify-center bg-ink px-3 py-2 text-[0.7rem] uppercase tracking-widest text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {leadSubmitting ? 'Sending…' : 'Send details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadFormOpen(false);
                      setLeadError(null);
                    }}
                    disabled={leadSubmitting}
                    className="mono inline-flex items-center justify-center border border-rule px-3 py-2 text-[0.7rem] uppercase tracking-widest text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {leadCaptured && leadConfirmedEmail && (
              <div className="rounded-sm border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink-2">
                Thanks — Adarsh will follow up at <span className="mono">{leadConfirmedEmail}</span> shortly.
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <div className="border-t border-rule px-4 pb-4 pt-3">
          {!hasUserSent && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => send(reply)}
                  disabled={sending}
                  className="mono border border-rule px-2.5 py-1 text-[0.65rem] uppercase tracking-wide text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, specs, or quotes"
              className="flex-1 border border-rule bg-surface px-3 py-2 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-ink px-3 py-2 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="mono text-[0.6rem] uppercase tracking-widest text-ink-muted">
              Gemini server-side only
            </p>
            <div className="flex gap-3 text-xs">
              {hasUserSent && (
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  Clear
                </button>
              )}
              <Link href="/enquiry" className="text-ink-muted transition-colors hover:text-ink">
                Quote
              </Link>
              <Link href="/contact" className="text-ink-muted transition-colors hover:text-ink">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 border border-ink bg-ink px-4 py-3 text-sm text-paper shadow-lg transition-colors hover:bg-accent"
      >
        <span className="mono text-[0.65rem] uppercase tracking-widest text-paper/70">Ask</span>
        <span>{open ? 'Close' : 'Assistant'}</span>
      </button>
    </>
  );
}
