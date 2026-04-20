import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productCategories } from '@/lib/data';
import { getProductsByCategory } from '@/lib/products-data';
import PageHeader from '@/components/PageHeader';
import Sidebar from '@/components/Sidebar';

export async function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = productCategories.find((p) => p.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.id);

  return (
    <>
      <PageHeader
        eyebrow="Product category"
        title={category.name}
        description={[category.description, category.fullDescription].filter(Boolean).join(' ')}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: category.name, href: `/products/${category.slug}` },
        ]}
      />

      <section>
        <div className="wrap py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <aside className="md:col-span-3">
              <Sidebar activeCategory={category.slug} />
            </aside>

            <div className="md:col-span-9">
              {products.length > 0 ? (
                <>
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-rule">
                    <p className="eyebrow">{products.length} {products.length === 1 ? 'Instrument' : 'Instruments'}</p>
                  </div>
                  <div className="divide-y divide-rule">
                    {products.map((product) => (
                      <article key={product.id} className="py-10 first:pt-0 grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4">
                          <Link
                            href={`/products/${category.slug}/${product.slug}`}
                            className="block relative aspect-[4/3] bg-paper border border-rule overflow-hidden group"
                          >
                            <Image
                              src={`/images/products/${product.image}`}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              sizes="(min-width: 768px) 30vw, 100vw"
                            />
                          </Link>
                        </div>
                        <div className="md:col-span-8">
                          <span className="mono text-[0.65rem] tracking-widest uppercase px-2.5 py-1 border border-rule text-ink-muted inline-block mb-3">
                            {product.itemCode}
                          </span>
                          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-ink mb-3 leading-snug">
                            {product.name}
                          </h2>
                          <p className="text-ink-2 leading-relaxed mb-6 max-w-2xl">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={`/products/${category.slug}/${product.slug}`}
                              className="inline-flex items-center gap-2 text-sm text-ink border border-ink px-5 py-2.5 rounded-sm hover:bg-ink hover:text-paper transition-colors"
                            >
                              Specifications <span aria-hidden>→</span>
                            </Link>
                            <Link
                              href={`/enquiry?product=${encodeURIComponent(product.name)}&code=${encodeURIComponent(product.itemCode)}&category=${encodeURIComponent(category.slug)}`}
                              className="inline-flex items-center gap-2 text-sm bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-accent transition-colors"
                            >
                              Request quote
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="border border-rule bg-surface p-12 text-center">
                  <p className="eyebrow mb-4">Coming soon</p>
                  <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">
                    Instruments in this category are being catalogued.
                  </h2>
                  <p className="text-ink-muted mb-8 max-w-md mx-auto">
                    Contact us for full specifications, pricing and lead time on {category.name.toLowerCase()}.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/contact" className="inline-flex items-center gap-2 border border-ink text-ink px-5 py-2.5 rounded-sm hover:bg-ink hover:text-paper transition-colors">
                      Contact us
                    </Link>
                    <Link href="/enquiry" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-accent transition-colors">
                      Send enquiry <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
