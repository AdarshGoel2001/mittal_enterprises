'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { companyInfo, productCategories } from '@/lib/data';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top Section */}
      <div className="bg-[#00c2c7] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-2">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm md:text-base">
              <span>+91-11-9810681132, 9868532156</span>
              <a href={`mailto:${companyInfo.email}`} className="hover:text-gray-200">
                {companyInfo.email}
              </a>
            </div>
            <div className="flex gap-2 items-center">
              <a href={companyInfo.social.facebook} target="_blank" rel="noopener noreferrer">
                <Image src="/images/faceboo.jpg" alt="Facebook" width={30} height={30} />
              </a>
              <a href={companyInfo.social.twitter} target="_blank" rel="noopener noreferrer">
                <Image src="/images/printrest.jpg" alt="Twitter" width={30} height={30} />
              </a>
              <Image src="/images/youtub.jpg" alt="YouTube" width={30} height={30} />
              <a href={companyInfo.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Image src="/images/linkd.jpg" alt="LinkedIn" width={30} height={30} />
              </a>
            </div>
          </div>
          <p className="text-center text-xs pb-2">
            Note: No part of this website may be reproduced, stored in a retrieval, or transmitted in any form or by any mean
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Mittal Enterprises"
              width={250}
              height={80}
              className="w-auto h-auto"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
            <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-3 text-black font-bold hover:bg-[#3685d2] hover:text-white transition-colors"
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-black font-bold hover:bg-[#3685d2] hover:text-white transition-colors"
                >
                  PROFILE
                </Link>
              </li>
              <li className="relative group">
                <button
                  className="block w-full text-left px-4 py-3 text-black font-bold hover:bg-[#3685d2] hover:text-white transition-colors"
                  onClick={() => setProductsOpen(!productsOpen)}
                >
                  OUR PRODUCTS
                </button>
                <ul className={`${productsOpen ? 'block' : 'hidden'} md:group-hover:block md:absolute md:left-0 md:top-full md:bg-white md:shadow-lg md:min-w-[280px] md:z-50`}>
                  {productCategories.map((category) => (
                    <li key={category.id} className="border-b border-[#6ac03d]">
                      <Link
                        href={`/products/${category.slug}`}
                        className="block px-4 py-2 text-black hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/global-supplies"
                  className="block px-4 py-3 text-black font-bold hover:bg-[#3685d2] hover:text-white transition-colors"
                >
                  GLOBAL SUPPLIES
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block px-4 py-3 text-black font-bold hover:bg-[#3685d2] hover:text-white transition-colors"
                >
                  CONTACT US
                </Link>
              </li>
              <li>
                <Link
                  href="/enquiry"
                  className="block px-4 py-3 text-black font-bold hover:bg-[#3685d2] hover:text-white transition-colors"
                >
                  ENQUIRY
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
