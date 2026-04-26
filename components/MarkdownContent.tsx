'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function MarkdownContent({ source }: { source: string }) {
  if (!source) return null;
  return (
    <div className="md-content max-w-3xl text-ink-2 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h2 className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted mt-10 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted mt-10 mb-3 first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted mt-8 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="my-3 first:mt-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-3 space-y-1.5 list-none pl-0">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-ink-muted">
              {children}
            </li>
          ),
          strong: ({ children }) => <strong className="text-ink font-semibold">{children}</strong>,
          img: ({ src, alt }) => (
            <span className="block my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof src === 'string' ? src : ''}
                alt={alt || ''}
                className="max-w-full h-auto border border-rule bg-paper"
              />
              {alt ? (
                <span className="mono text-[0.7rem] tracking-wide uppercase text-ink-muted block mt-2">
                  {alt}
                </span>
              ) : null}
            </span>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent underline-offset-4 hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
