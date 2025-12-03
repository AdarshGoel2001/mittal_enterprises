'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const banners = [
  '/images/inner-banner.jpg',
  '/images/inner-banner1.jpg',
];

export default function InnerBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden mb-6">
      <div className="relative h-[200px] md:h-[250px] lg:h-[300px]">
        {banners.map((banner, index) => (
          <div
            key={banner}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={banner}
              alt={`Inner Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
