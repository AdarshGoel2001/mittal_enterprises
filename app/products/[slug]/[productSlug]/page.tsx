import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productCategories } from '@/lib/data';
import { products, getProductBySlug } from '@/lib/products-data';
import InnerBanner from '@/components/InnerBanner';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateStaticParams() {
  return products.map((product) => {
    const category = productCategories.find(c => c.id === product.categoryId);
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

  if (!category || !product) {
    notFound();
  }

  return (
    <>
      <InnerBanner />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <Sidebar activeCategory={category.slug} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <Breadcrumb
              items={[
                { label: category.name, href: `/products/${category.slug}` },
                { label: product.name, href: `/products/${category.slug}/${product.slug}` },
              ]}
            />

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              {product.name}
            </h1>

            {/* Product Detail */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                {/* Product Image */}
                <div className="lg:col-span-5">
                  <div className="relative h-64 md:h-96 overflow-hidden rounded-lg bg-white border">
                    <Image
                      src={`/images/products/${product.image}`}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-7">
                  <div className="mb-4">
                    <span className="text-red-600 font-semibold">
                      Code: {product.itemCode}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Details</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p>{product.description}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <label className="font-semibold block mb-2">Quantity</label>
                      <input
                        type="number"
                        defaultValue={1}
                        min={1}
                        className="w-24 px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/enquiry?product=${encodeURIComponent(product.name)}`}
                        className="bg-[#01c2c7] text-white py-3 px-8 hover:bg-[#3685d2] transition-colors inline-block font-semibold"
                      >
                        Enquiry
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              {product.fullDescription && (
                <div className="border-t pt-8">
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                  />
                </div>
              )}
            </div>

            {/* Related Actions */}
            <div className="mt-8 bg-[#f6f6f6] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Interested in this product?</h3>
              <p className="text-gray-700 mb-6">
                Contact us to learn more about {product.name} and how it can benefit your laboratory or research institution.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/enquiry?product=${encodeURIComponent(product.name)}`}
                  className="bg-[#01c2c7] text-white py-3 px-8 hover:bg-[#3685d2] transition-colors inline-block"
                >
                  Send Enquiry
                </Link>
                <Link
                  href="/contact"
                  className="bg-[#6bbf39] text-white py-3 px-8 hover:bg-[#3685d2] transition-colors inline-block"
                >
                  Contact Us
                </Link>
                <Link
                  href={`/products/${category.slug}`}
                  className="border-2 border-gray-400 text-gray-700 py-3 px-8 hover:bg-gray-100 transition-colors inline-block"
                >
                  Back to {category.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
