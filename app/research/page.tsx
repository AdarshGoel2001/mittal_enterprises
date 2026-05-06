import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import ResearchBrowser from '@/components/ResearchBrowser';
import { verifiedCitations as citations } from '@/lib/citations-data';
import { products } from '@/lib/products-data';
import { SITE_URL } from '@/app/layout';

export const metadata: Metadata = {
  title: `Research Citations — ${citations.length} Papers Citing Mittal Enterprises Instruments`,
  description: `Browse ${citations.length} peer-reviewed research papers that have used Mittal Enterprises laboratory instruments. Indexed across acoustic, dielectric, thermal, and optical studies worldwide.`,
  alternates: { canonical: '/research' },
};

export default function ResearchIndexPage() {
  // Build product → name lookup, only for products that actually have hits.
  const productOptions = products
    .map((p) => ({ slug: p.slug, name: p.name, count: citations.filter((c) => c.products.includes(p.slug)).length }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count);

  // Build model code → count, sorted by frequency.
  const modelTally = new Map<string, number>();
  for (const c of citations) {
    for (const m of c.modelCodes) modelTally.set(m, (modelTally.get(m) ?? 0) + 1);
  }
  const modelOptions = Array.from(modelTally.entries())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);

  const years = citations
    .map((c) => c.year)
    .filter((y): y is number => typeof y === 'number');
  const yearMin = years.length ? Math.min(...years) : null;
  const yearMax = years.length ? Math.max(...years) : null;

  // Aggregate citation impact: how many times have these papers been cited
  // by other papers? OpenAlex-sourced entries carry this; CORE/IA = 0.
  const downstreamCitations = citations.reduce((sum, c) => sum + (c.citedByCount || 0), 0);

  // Distinct journals — proxy for "how many places these have been published."
  const journals = new Set(citations.map((c) => c.journal).filter(Boolean));

  // JSON-LD: ItemList of scholarly articles. Helps Google understand this is
  // a curated bibliography page, not a thin content page.
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Research papers citing Mittal Enterprises instruments',
    url: `${SITE_URL}/research`,
    numberOfItems: citations.length,
    isPartOf: { '@type': 'WebSite', name: 'Mittal Enterprises', url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <PageHeader
        eyebrow="Research"
        title={`Cited in ${citations.length} peer-reviewed papers.`}
        description={
          yearMin && yearMax
            ? `Researchers worldwide have used Mittal Enterprises instruments in published studies from ${yearMin} to ${yearMax}. Every citation below has been independently verified by reading the source PDF.`
            : `Researchers worldwide have used Mittal Enterprises instruments in published studies. Every citation below has been independently verified by reading the source PDF.`
        }
        breadcrumbs={[{ label: 'Research', href: '/research' }]}
      />

      <section className="border-y border-rule bg-surface">
        <div className="wrap py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div>
            <p className="mono text-[0.65rem] tracking-widest uppercase text-ink-muted">Verified citations</p>
            <p className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{citations.length}</p>
          </div>
          {yearMin && yearMax && (
            <div>
              <p className="mono text-[0.65rem] tracking-widest uppercase text-ink-muted">Years spanned</p>
              <p className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{yearMin}<span className="text-ink-muted">–</span>{yearMax}</p>
            </div>
          )}
          <div>
            <p className="mono text-[0.65rem] tracking-widest uppercase text-ink-muted">Distinct journals</p>
            <p className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{journals.size}</p>
          </div>
          <div>
            <p className="mono text-[0.65rem] tracking-widest uppercase text-ink-muted">Instrument variants</p>
            <p className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{modelOptions.length}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap py-14 md:py-16">
          <p className="text-sm text-ink-muted max-w-prose mb-8 italic">
            Every citation below has been independently verified — the quoted
            sentence was extracted directly from the source paper&apos;s PDF.
            Where authors named a specific Mittal model, it&apos;s shown as a
            chip on the card.
            {downstreamCitations > 0 && ` Across the corpus, these papers have themselves been cited ${downstreamCitations.toLocaleString()} times by other research.`}
          </p>
          <Suspense fallback={<p className="mono text-xs tracking-widest uppercase text-ink-muted">Loading…</p>}>
            <ResearchBrowser citations={citations} productOptions={productOptions} modelOptions={modelOptions} />
          </Suspense>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="wrap py-16 md:py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8">
            <p className="mono text-xs tracking-widest uppercase text-paper/60 mb-4">
              Published a paper using our equipment?
            </p>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
              Tell us — we&apos;ll add it to the index.
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 rounded-sm hover:bg-accent hover:text-paper transition-colors"
            >
              Get in touch <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
