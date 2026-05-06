'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Citation } from '@/lib/citations-data';
import { anchorForCitation } from '@/lib/citations-anchor';
import CitationCard from './CitationCard';

const INITIAL_VISIBLE = 3;

export default function ProductCitations({
  productSlug,
  citations,
}: {
  productSlug: string;
  citations: Citation[];
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const idx = citations.findIndex((c) => anchorForCitation(c.doi) === hash);
    if (idx === -1) return;
    if (idx >= INITIAL_VISIBLE) setExpanded(true);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [citations]);

  if (citations.length === 0) return null;

  const visible = expanded ? citations : citations.slice(0, INITIAL_VISIBLE);
  const remaining = citations.length - INITIAL_VISIBLE;

  return (
    <div id="research-citations" className="mt-16 pt-10 border-t border-rule scroll-mt-24">
      <div className="flex items-end justify-between mb-6 gap-6 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Research citations</p>
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
            Cited in {citations.length} peer-reviewed {citations.length === 1 ? 'paper' : 'papers'}.
          </h3>
          <p className="text-sm text-ink-muted mt-2 max-w-prose italic">
            Every citation below has been independently verified — the quoted
            sentence was extracted directly from the source paper&apos;s PDF.
          </p>
        </div>
        <Link
          href={`/research?product=${productSlug}`}
          className="text-sm text-ink-muted hover:text-ink transition-colors shrink-0"
        >
          View all citations →
        </Link>
      </div>

      <ul className="border border-rule divide-y divide-rule">
        {visible.map((c) => (
          <li key={c.url} id={anchorForCitation(c.doi)} className="px-5 py-5 scroll-mt-24">
            <CitationCard citation={c} />
          </li>
        ))}
      </ul>

      {remaining > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 text-sm mono uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
        >
          Show {remaining} more →
        </button>
      )}
    </div>
  );
}
