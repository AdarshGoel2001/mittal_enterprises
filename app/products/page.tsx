import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ProductsBrowser from '@/components/ProductsBrowser';
import { productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';

export default function ProductsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="All instruments"
        title="Every instrument we make."
        description={`Filter ${products.length} laboratory instruments across ${productCategories.length} categories. Search by name or item code to find what your lab needs.`}
        breadcrumbs={[{ label: 'Products', href: '/products' }]}
      />

      <section>
        <div className="wrap py-14 md:py-16">
          <ProductsBrowser products={products} categories={productCategories} />
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="wrap py-16 md:py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8">
            <p className="mono text-xs tracking-widest uppercase text-paper/60 mb-4">Can&apos;t find what you need?</p>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
              Tell us about your experiment — we&apos;ll recommend the right instrument.
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 rounded-sm hover:bg-accent hover:text-paper transition-colors"
            >
              Send enquiry <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
