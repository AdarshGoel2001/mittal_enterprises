'use client';

import Link from 'next/link';
import Image from 'next/image';
import { productCategories } from '@/lib/data';
import { companyInfo } from '@/lib/data';
import { useState } from 'react';

export default function Sidebar({ activeCategory }: { activeCategory?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#f1f1f1]">
      {/* Mobile Toggle */}
      <button
        className="md:hidden bg-[#3685d2] text-white w-full p-3 text-left font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        Our Products
      </button>

      {/* Desktop & Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        {/* Products Navigation */}
        <div className="mb-8">
          <h2 className="bg-[#3685d2] text-white p-3 text-lg font-semibold">
            Our Products
          </h2>
          <ul className="bg-white">
            {productCategories.map((category) => (
              <li
                key={category.id}
                className={`border-t border-[#6ac03d] ${
                  activeCategory === category.slug ? 'bg-gray-100' : ''
                }`}
              >
                <Link
                  href={`/products/${category.slug}`}
                  className="block p-3 hover:bg-gray-50 text-gray-800 relative pl-6"
                >
                  <span className="absolute left-2">▸</span>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div className="mb-8">
          <h2 className="bg-[#3685d2] text-white p-3 text-lg font-semibold">
            Follow Us
          </h2>
          <div className="bg-white p-4 flex gap-2">
            <a href={companyInfo.social.twitter} target="_blank" rel="noopener noreferrer">
              <Image src="/images/logo-twitter.jpg" alt="Twitter" width={24} height={25} />
            </a>
            <a href={companyInfo.social.facebook} target="_blank" rel="noopener noreferrer">
              <Image src="/images/logo-facebook.jpg" alt="Facebook" width={24} height={25} />
            </a>
            <a href={companyInfo.social.linkedin} target="_blank" rel="noopener noreferrer">
              <Image src="/images/linkedin.jpg" alt="LinkedIn" width={24} height={25} />
            </a>
          </div>
        </div>

        {/* FIEO Certificate */}
        <div>
          <a
            href="https://www.fieo.org/certificateview.php?memberfieo2009token=L8S0avDL7x_41898"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.fieo.org/images/fieovertS.jpg"
              alt="FIEO Certificate"
              className="w-full"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
