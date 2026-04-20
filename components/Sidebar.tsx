'use client';

import Link from 'next/link';
import { productCategories } from '@/lib/data';

export default function Sidebar({ activeCategory }: { activeCategory?: string }) {
  return (
    <nav aria-label="Product categories" className="sticky top-24">
      <p className="eyebrow mb-4">Categories</p>
      <ul className="border-l border-rule">
        {productCategories.map((category) => {
          const active = activeCategory === category.slug;
          return (
            <li key={category.id}>
              <Link
                href={`/products/${category.slug}`}
                className={`block pl-5 pr-3 py-3 text-sm leading-snug border-l-2 -ml-px transition-colors ${
                  active
                    ? 'border-accent text-ink font-medium'
                    : 'border-transparent text-ink-muted hover:text-ink hover:border-rule-strong'
                }`}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
