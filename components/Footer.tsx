import Link from 'next/link';
import { companyInfo, productCategories } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-[#f0f0f0] mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#3685d2]">
              Navigations
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-700 hover:text-[#3685d2] flex items-center">
                  <span className="mr-2">▸</span> Home
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-700 hover:text-[#3685d2] flex items-center">
                  <span className="mr-2">▸</span> Profile
                </Link>
              </li>
              <li>
                <Link href="/products/nano-science-instruments" className="text-gray-700 hover:text-[#3685d2] flex items-center">
                  <span className="mr-2">▸</span> Our Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-[#3685d2] flex items-center">
                  <span className="mr-2">▸</span> Contact
                </Link>
              </li>
              <li>
                <Link href="/global-supplies" className="text-gray-700 hover:text-[#3685d2] flex items-center">
                  <span className="mr-2">▸</span> Global Supplies
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="text-gray-700 hover:text-[#3685d2] flex items-center">
                  <span className="mr-2">▸</span> Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Categories */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#3685d2]">
              Our Categories
            </h2>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products/${category.slug}`}
                    className="text-gray-700 hover:text-[#3685d2] flex items-center"
                  >
                    <span className="mr-2">▸</span> {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach Us */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#3685d2]">
              Reach Us
            </h2>
            <div className="text-gray-700 space-y-2">
              <strong className="block text-gray-800">{companyInfo.name}</strong>
              <p>{companyInfo.address}</p>
              <p>
                Mobile: {companyInfo.phone.join(', ')}<br />
                Phone: {companyInfo.phoneOffice}<br />
                Email:{' '}
                <a href={`mailto:${companyInfo.email}`} className="text-gray-700 hover:text-[#3685d2]">
                  {companyInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#2d2d2d] py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-sm">
            Copyright 2024, All Rights Reserved, Site Developed By DIGIHIVESOL Website Powered By TRADEBRIO
          </p>
        </div>
      </div>
    </footer>
  );
}
