'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Citation } from '@/lib/citations-data';
import CitationCard from './CitationCard';

const PAGE_SIZE = 25;

export default function ResearchBrowser({
  citations,
  productOptions,
  modelOptions,
}: {
  citations: Citation[];
  productOptions: { slug: string; name: string; count: number }[];
  modelOptions: { code: string; count: number }[];
}) {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get('product') || '';
  const initialModel = searchParams.get('model') || '';
  const [product, setProduct] = useState(initialProduct);
  const [model, setModel] = useState(initialModel);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [product, model, query]);

  const q = query.trim().toLowerCase();

  // Apply each filter individually so we can compute facet counts that
  // reflect what would happen if a user picked a different option *given*
  // the other selections (faceted-search pattern).
  function passSearch(c: Citation) {
    if (!q) return true;
    const hay = `${c.title} ${c.authors} ${c.journal} ${c.evidenceSnippet}`.toLowerCase();
    return hay.includes(q);
  }
  function passProduct(c: Citation) {
    return !product || c.products.includes(product);
  }
  function passModel(c: Citation) {
    return !model || c.modelCodes.includes(model);
  }

  const filtered = useMemo(
    () => citations.filter((c) => passProduct(c) && passModel(c) && passSearch(c)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [citations, product, model, q]
  );

  // Facet counts for the *other* dropdowns are computed against the rest of
  // the filter set (excluding the dropdown's own selection). That way the
  // numbers shown match what selecting that option would actually yield.
  const productFacet = useMemo(() => {
    const pool = citations.filter((c) => passModel(c) && passSearch(c));
    const counts = new Map<string, number>();
    for (const c of pool) for (const p of c.products) counts.set(p, (counts.get(p) ?? 0) + 1);
    return productOptions
      .map((p) => ({ ...p, count: counts.get(p.slug) ?? 0 }))
      .filter((p) => p.count > 0 || p.slug === product); // keep current selection visible even if 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citations, productOptions, model, q, product]);

  const modelFacet = useMemo(() => {
    const pool = citations.filter((c) => passProduct(c) && passSearch(c));
    const counts = new Map<string, number>();
    for (const c of pool) for (const m of c.modelCodes) counts.set(m, (counts.get(m) ?? 0) + 1);
    return modelOptions
      .map((m) => ({ ...m, count: counts.get(m.code) ?? 0 }))
      .filter((m) => m.count > 0 || m.code === model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citations, modelOptions, product, q, model]);

  const allInstrumentsCount = useMemo(
    () => citations.filter((c) => passModel(c) && passSearch(c)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [citations, model, q]
  );
  const allModelsCount = useMemo(
    () => citations.filter((c) => passProduct(c) && passSearch(c)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [citations, product, q]
  );

  const visible = filtered.slice(0, visibleCount);
  const filtersActive = product || model || q;

  return (
    <div>
      <div className="grid md:grid-cols-12 gap-4 mb-2">
        <div className="md:col-span-5">
          <label className="block">
            <span className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted">
              Search title, author, journal, quote
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. binary mixture, ultrasonic velocity, IIT…"
              className="mt-2 w-full bg-paper border border-rule px-4 py-3 text-sm focus:outline-none focus:border-ink"
            />
          </label>
        </div>
        <div className="md:col-span-4">
          <label className="block">
            <span className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted">
              Filter by instrument
            </span>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-2 w-full bg-paper border border-rule px-4 py-3 text-sm focus:outline-none focus:border-ink"
            >
              <option value="">All instruments ({allInstrumentsCount})</option>
              {productFacet.map((p) => (
                <option key={p.slug} value={p.slug} disabled={p.count === 0 && p.slug !== product}>
                  {p.name} ({p.count})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="md:col-span-3">
          <label className="block">
            <span className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted">
              Filter by model
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-2 w-full bg-paper border border-rule px-4 py-3 text-sm focus:outline-none focus:border-ink"
            >
              <option value="">Any model ({allModelsCount})</option>
              {modelFacet.map((m) => (
                <option key={m.code} value={m.code} disabled={m.count === 0 && m.code !== model}>
                  {m.code} ({m.count})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <p className="mono text-xs tracking-widest uppercase text-ink-muted">
          Showing {visible.length} of {filtered.length} papers
        </p>
        {filtersActive && (
          <button
            type="button"
            onClick={() => { setProduct(''); setModel(''); setQuery(''); }}
            className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted hover:text-ink transition-colors"
          >
            Clear filters ×
          </button>
        )}
      </div>

      <ul className="border border-rule divide-y divide-rule bg-surface">
        {visible.map((c) => (
          <li key={c.url} className="px-5 py-5">
            <CitationCard citation={c} />
          </li>
        ))}
        {visible.length === 0 && (
          <li className="px-5 py-12 text-center text-sm text-ink-muted">
            No papers match the current filter.
          </li>
        )}
      </ul>

      {visibleCount < filtered.length && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="mono text-xs tracking-widest uppercase text-ink-muted hover:text-ink transition-colors px-6 py-3 border border-rule"
          >
            Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
          </button>
        </div>
      )}
    </div>
  );
}
