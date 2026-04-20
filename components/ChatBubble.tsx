'use client';

import { useEffect, useRef, useState } from 'react';

type Source = {
  id: string;
  kind: 'company' | 'category' | 'product';
  title: string;
  url: string;
};

type Message = {
  role: 'assistant' | 'user';
  content: string;
  sources?: Source[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      'Ask about products, item codes, company details, international shipping, or quote guidance. I only answer from the website catalog.',
  },
];

const QUICK_REPLIES = [
  'Show ultrasonic interferometer options',
  'Which products are in nano science instruments?',
  'How do I request a bulk quote?',
  'What international shipping support do you offer?',
];

function messageBody(content: string) {
  return content.split('\n').map((line, index) => (
    <p key={index} className={index > 0 ? 'mt-2' : ''}>
      {line}
    </p>
  ));
}

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const nextMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

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
        }),
      });

      const payload = (await response.json()) as {
        configured?: boolean;
        message?: string;
        error?: string;
        sources?: Source[];
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
        },
      ]);
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
                  {messageBody(message.content)}
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 flex max-w-[90%] flex-wrap gap-1.5">
                    {message.sources.map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        className="mono inline-flex items-center border border-rule px-2 py-1 text-[0.65rem] uppercase tracking-wide text-ink-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="max-w-[90%] rounded-sm border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink-muted">
                Checking the catalog...
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <div className="border-t border-rule px-4 pb-4 pt-3">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {QUICK_REPLIES.map((reply) => (
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
              <a href="/enquiry" className="text-ink-muted transition-colors hover:text-ink">
                Quote
              </a>
              <a href="/contact" className="text-ink-muted transition-colors hover:text-ink">
                Contact
              </a>
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
