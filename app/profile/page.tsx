import Link from 'next/link';
import { companyInfo } from '@/lib/data';
import InnerBanner from '@/components/InnerBanner';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

export default function ProfilePage() {
  return (
    <>
      <InnerBanner />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6">
          <div className="md:col-span-4 lg:col-span-3">
            <Sidebar />
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <Breadcrumb items={[{ label: 'Company Profile', href: '/profile' }]} />

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Company Profile
            </h1>

            <div className="bg-white p-8 md:p-12 rounded-lg shadow-md space-y-8">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">About Mittal Enterprises</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {companyInfo.about.short}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {companyInfo.about.distinction}
            </p>
          </section>

          {/* Our Distinction */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Distinction</h2>
            <p className="text-gray-700 leading-relaxed">
              Mittal Enterprises has distinction in manufacturing Nanofluid Interferometer, Ultrasonic Interferometers and other scientific equipments for Research and Laboratory experiments in Physics, Chemistry, Polymer Science and Material Science departments of Engineering colleges, Post Graduate colleges and Universities.
            </p>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f6f6f6] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#3685d2]">Quality Products</h3>
                <p className="text-gray-700">
                  All our instruments are manufactured with the highest quality standards and come with Trademark, Design Registration and Copyright protection.
                </p>
              </div>
              <div className="bg-[#f6f6f6] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#3685d2]">Expert Support</h3>
                <p className="text-gray-700">
                  Our team of experts provides comprehensive support for installation, training, and maintenance of all laboratory instruments.
                </p>
              </div>
              <div className="bg-[#f6f6f6] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#3685d2]">Research & Development</h3>
                <p className="text-gray-700">
                  We continuously invest in R&D to bring the latest innovations in laboratory instrumentation to our customers.
                </p>
              </div>
              <div className="bg-[#f6f6f6] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#3685d2]">Global Delivery</h3>
                <p className="text-gray-700">
                  We serve educational institutions and research laboratories across the globe with timely delivery and support.
                </p>
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="bg-[#00c2c7] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="leading-relaxed">
              We are committed to providing quality products for Educational Institutions & Research Laboratories.
              Our focus on customer satisfaction, competitive pricing, and timely delivery has helped us build
              long-lasting relationships with institutions across the world. We continue to innovate and expand
              our product range to meet the evolving needs of modern research and education.
            </p>
          </section>

          {/* Contact Section */}
          <section className="text-center border-t pt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Get in Touch</h2>
            <p className="text-gray-700 mb-6">
              Interested in learning more about our products and services? Contact us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
