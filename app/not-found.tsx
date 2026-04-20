import Link from 'next/link';
import { productCategories } from '@/lib/data';

export default function NotFound() {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  return (
    <section>
      <div className="wrap py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="mono text-xs tracking-widest uppercase text-accent mb-6">Error · 404</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink leading-[1.05] mb-6">
            That page isn&apos;t here.
          </h1>
          <p className="text-ink-muted leading-relaxed mb-10 max-w-xl">
            The address you&apos;ve entered doesn&apos;t point to an instrument, category, or page on this site.
            If you followed a link from search, it may be outdated.
          </p>

          <div className="border border-rule bg-surface font-mono text-xs md:text-sm text-ink-2 mb-10">
            <div className="px-4 py-2 border-b border-rule bg-paper flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-ink-muted tracking-widest uppercase text-[0.65rem]">console</span>
            </div>
            <div className="px-4 py-4 space-y-1">
              <p><span className="text-ink-muted">$</span> resolve /requested-path</p>
              <p className="text-ink-muted">[{timestamp}] lookup failed — resource not found</p>
              <p><span className="text-ink-muted">$</span> suggest --alternatives</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 text-sm rounded-sm hover:bg-accent transition-colors"
            >
              Go home <span aria-hidden>→</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-ink text-ink px-5 py-2.5 text-sm rounded-sm hover:bg-ink hover:text-paper transition-colors"
            >
              Browse instruments
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-rule text-ink-2 px-5 py-2.5 text-sm rounded-sm hover:border-ink hover:text-ink transition-colors"
            >
              Contact us
            </Link>
          </div>

          <div>
            <p className="eyebrow mb-4">Or jump to a category</p>
            <ul className="border-l border-rule">
              {productCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="block pl-5 pr-3 py-3 text-sm leading-snug border-l-2 -ml-px border-transparent text-ink-muted hover:text-ink hover:border-rule-strong transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
