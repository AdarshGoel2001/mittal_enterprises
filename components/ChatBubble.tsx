'use client';

import { useEffect, useRef, useState } from 'react';

type Message = { from: 'bot' | 'user'; text: string };

const INITIAL_MESSAGES: Message[] = [
  { from: 'bot', text: 'Hi — I can help with product specs, lead time or bulk enquiries. What are you looking for?' },
];

const QUICK_REPLIES = [
  'Ultrasonic Interferometer specs',
  'Bulk order pricing',
  'International shipping',
  'Request a quote',
];

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { from: 'user', text: trimmed }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: 'bot',
          text: "Thanks — a team member will follow up shortly. For a faster response, you can also use the enquiry form.",
        },
      ]);
    }, 650);
  };

  return (
    <>
      {/* Panel */}
      <div
        aria-hidden={!open}
        className={`fixed bottom-24 right-5 z-50 w-[22rem] max-w-[calc(100vw-2.5rem)] bg-surface border border-rule shadow-2xl rounded-sm origin-bottom-right transition-all duration-200 ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule bg-ink text-paper">
          <div>
            <p className="mono text-[0.65rem] tracking-widest uppercase text-paper/60">Mittal Enterprises</p>
            <p className="text-sm font-medium">Ask us anything</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="w-8 h-8 flex items-center justify-center text-paper/70 hover:text-paper transition-colors"
          >
            ×
          </button>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-paper">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5 rounded-sm ${
                m.from === 'bot'
                  ? 'bg-surface border border-rule text-ink-2'
                  : 'bg-ink text-paper ml-auto'
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="px-4 pt-2 pb-3 border-t border-rule">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="mono text-[0.65rem] tracking-wide uppercase px-2.5 py-1 border border-rule text-ink-muted hover:text-ink hover:border-ink transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 px-3 py-2 text-sm bg-surface border border-rule rounded-sm focus:outline-none focus:border-ink transition-colors"
            />
            <button
              type="submit"
              className="bg-ink text-paper px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors"
              aria-label="Send message"
            >
              →
            </button>
          </form>
          <p className="mono text-[0.6rem] tracking-widest uppercase text-ink-muted mt-2">
            Beta · Replies are not live yet
          </p>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-ink text-paper shadow-lg hover:bg-accent transition-colors flex items-center justify-center"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        )}
      </button>
    </>
  );
}
