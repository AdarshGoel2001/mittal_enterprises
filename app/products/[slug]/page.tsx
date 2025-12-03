import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productCategories } from '@/lib/data';
import { getProductsByCategory } from '@/lib/products-data';
import InnerBanner from '@/components/InnerBanner';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateStaticParams() {
  return productCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = productCategories.find((p) => p.slug === slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.id);

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
              ]}
            />

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              {category.name}
            </h1>

            {/* Category Description */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">{category.description}</p>
              {category.fullDescription && (
                <p className="text-gray-700">{category.fullDescription}</p>
              )}
            </div>

            {/* Product Listings */}
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Product Image */}
                      <div className="md:col-span-4">
                        <Link href={`/products/${category.slug}/${product.slug}`}>
                          <div className="relative h-48 md:h-56 overflow-hidden rounded-lg group">
                            <Image
                              src={`/images/products/${product.image}`}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="md:col-span-8">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                          {product.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Code:</strong> {product.itemCode}
                        </p>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/products/${category.slug}/${product.slug}`}
                            className="bg-[#01c2c7] text-white py-2 px-6 hover:bg-[#3685d2] transition-colors inline-block"
                          >
                            More...
                          </Link>
                          <Link
                            href={`/enquiry?product=${encodeURIComponent(product.name)}`}
                            className="bg-[#6bbf39] text-white py-2 px-6 hover:bg-[#3685d2] transition-colors inline-block"
                          >
                            Enquiry
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-600">
                  Products in this category are coming soon. Please contact us for more information.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="bg-[#01c2c7] text-white py-3 px-8 inline-block hover:bg-[#3685d2] transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/enquiry"
                    className="bg-[#6bbf39] text-white py-3 px-8 inline-block hover:bg-[#3685d2] transition-colors"
                  >
                    Send Enquiry
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
