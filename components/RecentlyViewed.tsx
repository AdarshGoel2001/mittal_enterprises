'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, type Product } from '@/lib/products-data';
import { productCategories } from '@/lib/data';

const KEY = 'me:recent-products';
const MAX = 6;

export function recordRecentlyViewed(productId: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = [productId, ...list.filter((id) => id !== productId)].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setIds(list.filter((id) => id !== excludeId));
    } catch {}
  }, [excludeId]);

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  if (items.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-rule">
      <div className="flex items-end justify-between mb-6">
        <p className="eyebrow">Recently viewed</p>
        <p className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-rule border border-rule">
        {items.map((p) => {
          const cat = productCategories.find((c) => c.id === p.categoryId);
          if (!cat) return null;
          return (
            <Link
              key={p.id}
              href={`/products/${cat.slug}/${p.slug}`}
              className="group bg-surface hover:bg-paper transition-colors p-4 flex flex-col gap-3"
            >
              <div className="relative aspect-square bg-paper overflow-hidden">
                <Image
                  src={`/images/products/${p.image}`}
                  alt={p.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 25vw, 50vw"
                />
              </div>
              <div>
                <p className="mono text-[0.65rem] tracking-widest uppercase text-ink-muted mb-1">
                  {p.itemCode}
                </p>
                <p className="text-sm font-medium text-ink leading-snug line-clamp-2">{p.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
