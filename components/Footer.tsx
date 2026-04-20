import Image from 'next/image';
import Link from 'next/link';
import { companyInfo, productCategories } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="wrap py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex items-center justify-center w-11 h-11 shrink-0">
                <Image
                  src="/images/logo-mark.png"
                  alt="Mittal Enterprises logo"
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-ink font-semibold tracking-tight">Mittal Enterprises</span>
                <span className="eyebrow text-[0.65rem]">Lab Equipments · ISO 9001:2008</span>
              </div>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
              Manufacturer of ultrasonic, nanofluid and scientific laboratory instruments for universities and research institutions across India and globally.
            </p>
            <div className="mt-5 flex gap-3">
              <span className="mono text-[0.7rem] tracking-wider uppercase text-ink-muted border border-rule px-2 py-1 rounded-sm">
                ISO 9001:2008
              </span>
              <span className="mono text-[0.7rem] tracking-wider uppercase text-ink-muted border border-rule px-2 py-1 rounded-sm">
                FIEO Member
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow mb-4">Navigate</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-ink-2 hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/profile" className="text-ink-2 hover:text-accent transition-colors">Profile</Link></li>
              <li><Link href="/global-supplies" className="text-ink-2 hover:text-accent transition-colors">Global Supplies</Link></li>
              <li><Link href="/contact" className="text-ink-2 hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/enquiry" className="text-ink-2 hover:text-accent transition-colors">Request a Quote</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow mb-4">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {productCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products/${cat.slug}`} className="text-ink-2 hover:text-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="eyebrow mb-4">Reach us</h3>
            <address className="not-italic text-sm text-ink-2 leading-relaxed space-y-2">
              <p>{companyInfo.address}</p>
              <p className="mono text-xs">{companyInfo.phone.join(' · ')}</p>
              <p className="mono text-xs">{companyInfo.phoneOffice}</p>
              <a href={`mailto:${companyInfo.email}`} className="block text-accent hover:text-accent-hover break-all">
                {companyInfo.email}
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="wrap py-6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Mittal Enterprises. All rights reserved.
          </p>
          <p className="text-xs text-ink-muted">
            No part of this website may be reproduced, stored, or transmitted in any form without prior permission.
          </p>
          <p className="text-xs text-ink-muted">
            Made with <span className="text-accent">♥</span> by Adarsh Goel
          </p>
        </div>
      </div>
    </footer>
  );
}
