import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productCategories } from '@/lib/data';
import { products, getProductBySlug } from '@/lib/products-data';
import { getProductMarkdown, extractModelsFromMarkdown } from '@/lib/products-content';
import PageHeader from '@/components/PageHeader';
import Sidebar from '@/components/Sidebar';
import RecentlyViewed from '@/components/RecentlyViewed';
import TrackRecent from '@/components/TrackRecent';
import MarkdownContent from '@/components/MarkdownContent';

export async function generateStaticParams() {
  return products.map((product) => {
    const category = productCategories.find((c) => c.id === product.categoryId);
    return {
      slug: category?.slug || '',
      productSlug: product.slug,
    };
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const category = productCategories.find((c) => c.slug === slug);
  const product = getProductBySlug(productSlug);

  if (!category || !product) notFound();

  const rawMarkdown = getProductMarkdown(product.slug);
  const { models, markdown } = extractModelsFromMarkdown(rawMarkdown);
  const related = products
    .filter((p) => p.categoryId === category.id && p.id !== product.id)
    .slice(0, 3);

  const enquiryHref = `/enquiry?product=${encodeURIComponent(product.name)}&code=${encodeURIComponent(product.itemCode)}&category=${encodeURIComponent(category.slug)}`;

  return (
    <>
      <TrackRecent productId={product.id} />
      <PageHeader
        eyebrow={`${category.name} · ${product.itemCode}`}
        title={product.name}
        description={product.description}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: category.name, href: `/products/${category.slug}` },
          { label: product.name, href: `/products/${category.slug}/${product.slug}` },
        ]}
      />

      <section>
        <div className="wrap py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <aside className="md:col-span-3">
              <Sidebar activeCategory={category.slug} />
            </aside>

            <div className="md:col-span-9">
              <div className="mb-6">
                <Link
                  href={`/products/${category.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  <span aria-hidden>←</span> Back to {category.name}
                </Link>
              </div>

              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-6">
                  <div className="relative aspect-square bg-paper border border-rule overflow-hidden">
                    <Image
                      src={`/images/products/${product.image}`}
                      alt={product.name}
                      fill
                      className="object-contain p-8"
                      priority
                    />
                  </div>
                </div>

                <div className="md:col-span-6">
                  <dl className="border border-rule divide-y divide-rule">
                    <div className="flex items-center justify-between px-5 py-4">
                      <dt className="mono text-xs tracking-widest uppercase text-ink-muted">Item code</dt>
                      <dd className="mono text-sm text-ink">{product.itemCode}</dd>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <dt className="mono text-xs tracking-widest uppercase text-ink-muted">Category</dt>
                      <dd className="text-sm text-ink">{category.name}</dd>
                    </div>
                  </dl>

                  {models.length > 0 && (
                    <div className="mt-6">
                      <p className="mono text-[0.7rem] tracking-widest uppercase text-ink-muted mb-3">
                        Available models
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {models.map((m) => (
                          <span
                            key={m}
                            className="mono text-xs tracking-wide px-3 py-1.5 border border-rule text-ink-2 bg-surface"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={enquiryHref}
                      className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-sm hover:bg-accent transition-colors"
                    >
                      Request quote <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>

              {markdown && (
                <div className="mt-16 pt-10 border-t border-rule">
                  <p className="eyebrow mb-6">Details</p>
                  <MarkdownContent source={markdown} />
                </div>
              )}

              {related.length > 0 && (
                <div className="mt-16 pt-10 border-t border-rule">
                  <div className="flex items-end justify-between mb-6">
                    <p className="eyebrow">Related in {category.name}</p>
                    <Link
                      href={`/products/${category.slug}`}
                      className="text-sm text-ink-muted hover:text-ink transition-colors"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-3 gap-px bg-rule border border-rule">
                    {related.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${category.slug}/${p.slug}`}
                        className="group bg-surface hover:bg-paper transition-colors p-5 flex flex-col gap-3"
                      >
                        <div className="relative aspect-square bg-paper overflow-hidden">
                          <Image
                            src={`/images/products/${p.image}`}
                            alt={p.name}
                            fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                            sizes="(min-width: 768px) 25vw, 50vw"
                          />
                        </div>
                        <div>
                          <p className="mono text-[0.65rem] tracking-widest uppercase text-ink-muted mb-1">
                            {p.itemCode}
                          </p>
                          <p className="text-sm font-medium text-ink leading-snug line-clamp-2">
                            {p.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <RecentlyViewed excludeId={product.id} />

              <div className="mt-16 bg-ink text-paper p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="mono text-xs tracking-widest uppercase text-paper/60 mb-2">
                    Interested in this instrument?
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                    Get full specs and pricing.
                  </h3>
                </div>
                <Link
                  href={enquiryHref}
                  className="shrink-0 inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 rounded-sm hover:bg-accent hover:text-paper transition-colors"
                >
                  Send enquiry <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
