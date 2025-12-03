import Link from 'next/link';
import InnerBanner from '@/components/InnerBanner';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

export default function GlobalSuppliesPage() {
  return (
    <>
      <InnerBanner />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6">
          <div className="md:col-span-4 lg:col-span-3">
            <Sidebar />
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <Breadcrumb items={[{ label: 'Global Supplies', href: '/global-supplies' }]} />

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Global Supplies
            </h1>

            <div className="bg-white p-8 md:p-12 rounded-lg shadow-md space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Worldwide Delivery</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mittal Enterprises is proud to serve educational institutions and research laboratories across the globe.
              Our commitment to quality and customer satisfaction has made us a trusted supplier of laboratory instruments worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We have successfully delivered our products to universities, research centers, and educational institutions
              in multiple countries, establishing ourselves as a reliable global supplier of scientific instruments.
            </p>
          </section>

          {/* Our Reach */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Global Reach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-[#3685d2] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">International Shipping</h3>
                <p className="text-gray-700">Reliable shipping to destinations worldwide</p>
              </div>
              <div className="text-center">
                <div className="bg-[#00c2c7] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Secure Packaging</h3>
                <p className="text-gray-700">Professional packaging ensuring safe delivery</p>
              </div>
              <div className="text-center">
                <div className="bg-[#6bbf39] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Global Support</h3>
                <p className="text-gray-700">Dedicated support team for international clients</p>
              </div>
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Services</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-[#3685d2] text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Custom Requirements</h3>
                  <p className="text-gray-700">We accommodate specific requirements from international clients and institutions</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[#3685d2] text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Technical Documentation</h3>
                  <p className="text-gray-700">Complete technical documentation and user manuals provided with all products</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[#3685d2] text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Installation Support</h3>
                  <p className="text-gray-700">Remote installation guidance and support for international customers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[#3685d2] text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Competitive Pricing</h3>
                  <p className="text-gray-700">Best prices for bulk orders and institutional purchases</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-[#00c2c7] text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
            <p className="mb-6 leading-relaxed">
              Contact us today to discuss your requirements and get a quote for international delivery.
              We are here to serve you wherever you are in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-[#00c2c7] py-3 px-8 inline-block hover:bg-gray-100 transition-colors font-semibold"
              >
                Contact Us
              </Link>
              <Link
                href="/enquiry"
                className="border-2 border-white text-white py-3 px-8 inline-block hover:bg-white hover:text-[#00c2c7] transition-colors font-semibold"
              >
                Request Quote
              </Link>
            </div>
          </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
