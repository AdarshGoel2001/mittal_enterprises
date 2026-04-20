'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductCategory } from '@/lib/data';
import type { Product } from '@/lib/products-data';

type Sort = 'category' | 'name-asc' | 'name-desc';

export default function ProductsBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: ProductCategory[];
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<Sort>('category');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.categoryId, (map.get(p.categoryId) || 0) + 1);
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (selected.size > 0 && !selected.has(p.categoryId)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.itemCode.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
    if (sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'name-desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    else {
      const order = new Map(categories.map((c, i) => [c.id, i]));
      list = [...list].sort((a, b) => {
        const ai = order.get(a.categoryId) ?? 999;
        const bi = order.get(b.categoryId) ?? 999;
        if (ai !== bi) return ai - bi;
        return a.name.localeCompare(b.name);
      });
    }
    return list;
  }, [products, categories, query, selected, sort]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setQuery('');
    setSelected(new Set());
    setSort('category');
  };

  const activeCount = selected.size + (query ? 1 : 0);

  return (
    <div className="grid md:grid-cols-12 gap-10 md:gap-12">
      <button
        onClick={() => setMobileFiltersOpen((v) => !v)}
        className="md:hidden flex items-center justify-between w-full px-4 py-3 border border-rule text-sm text-ink"
      >
        <span>Filters {activeCount > 0 && <span className="ml-2 mono text-xs text-accent">({activeCount})</span>}</span>
        <span aria-hidden>{mobileFiltersOpen ? '×' : '+'}</span>
      </button>

      <aside className={`md:col-span-3 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-24 space-y-8">
          <div>
            <label htmlFor="prod-search" className="eyebrow block mb-3">Search</label>
            <div className="relative">
              <input
                id="prod-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name or item code…"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface border border-rule-strong rounded-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="m14 14 4 4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3">Category</p>
            <ul className="space-y-1.5">
              {categories.map((c) => {
                const count = countsByCategory.get(c.id) || 0;
                const isActive = selected.has(c.id);
                return (
                  <li key={c.id}>
                    <label
                      className={`flex items-center gap-3 cursor-pointer px-2 py-1.5 -mx-2 rounded-sm group transition-colors ${
                        isActive ? 'bg-accent-soft' : 'hover:bg-paper'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggle(c.id)}
                        className="w-4 h-4 accent-[var(--color-accent)]"
                      />
                      <span className={`flex-1 text-sm leading-snug transition-colors ${isActive ? 'text-accent font-medium' : 'text-ink-2 group-hover:text-ink'}`}>
                        {c.name}
                      </span>
                      <span className={`mono text-[0.65rem] tracking-widest ${isActive ? 'text-accent' : 'text-ink-muted'}`}>{count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <label htmlFor="prod-sort" className="eyebrow block mb-3">Sort</label>
            <select
              id="prod-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full px-3 py-2.5 text-sm bg-surface border border-rule-strong rounded-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
            >
              <option value="category">By category</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
            </select>
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted hover:text-ink transition-colors"
            >
              ← Clear filters
            </button>
          )}
        </div>
      </aside>

      <div className="md:col-span-9">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-rule">
          <p className="eyebrow">
            {filtered.length} {filtered.length === 1 ? 'instrument' : 'instruments'}
            {activeCount > 0 && <span className="text-ink-muted ml-2">· filtered from {products.length}</span>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-rule bg-surface p-12 text-center">
            <p className="eyebrow mb-3">No matches</p>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">
              Nothing here fits those filters.
            </h2>
            <p className="text-ink-muted mb-6 max-w-md mx-auto">
              Try a different search term, or clear filters to see all instruments.
            </p>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 text-sm border border-ink text-ink px-5 py-2.5 rounded-sm hover:bg-ink hover:text-paper transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
            {filtered.map((p) => {
              const cat = categories.find((c) => c.id === p.categoryId);
              if (!cat) return null;
              return (
                <Link
                  key={p.id}
                  href={`/products/${cat.slug}/${p.slug}`}
                  className="group relative flex flex-col bg-surface hover:bg-paper transition-colors h-full"
                >
                  <span aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10" />
                  <div className="relative aspect-square bg-paper overflow-hidden">
                    <Image
                      src={`/images/products/${p.image}`}
                      alt={p.name}
                      fill
                      className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                    />
                    <span className="absolute top-3 left-3 mono text-[0.6rem] tracking-widest uppercase bg-paper/90 backdrop-blur-sm border border-rule text-ink-2 px-2 py-1">
                      {p.itemCode}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="mono text-[0.6rem] tracking-widest uppercase text-ink-muted mb-2">
                      {cat.name}
                    </p>
                    <h3 className="text-sm md:text-base font-semibold tracking-tight text-ink leading-snug mb-2 min-h-[3rem]">
                      {p.name}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-4">
                      {p.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 text-xs text-ink font-medium group-hover:gap-3 transition-all">
                      View details
                      <span aria-hidden className="group-hover:text-accent transition-colors">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
