'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { productCategories } from '@/lib/data';

const nav = [
  { label: 'Profile', href: '/profile' },
  { label: 'Products', href: '/products', hasMenu: true },
  { label: 'Global Supplies', href: '/global-supplies' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-rule">
      <div className="wrap flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative flex items-center justify-center w-10 h-10 shrink-0">
            <Image
              src="/images/logo-mark.png"
              alt="Mittal Enterprises logo"
              fill
              className="object-contain"
              priority
              sizes="40px"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-ink font-semibold tracking-tight uppercase">Mittal Enterprises</span>
            <span className="eyebrow text-[0.65rem]">Lab Equipments · ISO 9001:2008</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) =>
            item.hasMenu ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm text-ink-2 hover:text-ink transition-colors inline-flex items-center gap-1"
                >
                  {item.label}
                  <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
                {productsOpen && (
                  <div className="absolute left-0 top-full pt-2 min-w-[280px]">
                    <div className="bg-surface border border-rule rounded-sm shadow-sm overflow-hidden">
                      {productCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products/${cat.slug}`}
                          className="block px-4 py-3 text-sm text-ink-2 hover:bg-paper hover:text-ink border-b border-rule last:border-b-0 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-ink-2 hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/enquiry"
            className="ml-3 inline-flex items-center gap-2 bg-ink text-paper text-sm px-4 py-2 rounded-sm hover:bg-accent transition-colors"
          >
            Request Quote
            <span aria-hidden>→</span>
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-rule bg-surface">
          <div className="wrap py-4 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="px-2 py-3 text-ink-2 hover:text-ink">
              Home
            </Link>
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-3 text-ink-2 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/enquiry"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-ink text-paper text-center px-4 py-3 rounded-sm"
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
