import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import FadeUp from "@/components/FadeUp";
import CountUp from "@/components/CountUp";
import { productCategories, companyInfo } from "@/lib/data";

type Stat = { value: string; label: string; count?: number };

const stats: Stat[] = [
  { value: "1976", label: "Established", count: 1976 },
  { value: "6", label: "Product Categories", count: 6 },
  { value: "ISO", label: "9001:2008 Certified" },
  { value: "FIEO", label: "Registered Member" },
];

const credentials = [
  {
    title: "Trademark & Design Registered",
    body: "Every instrument we manufacture is covered by Trademark, Design Registration and Copyright.",
  },
  {
    title: "Research-grade precision",
    body: "Digital micrometer accuracy to ±0.001mm. Cited in peer-reviewed journals.",
  },
  {
    title: "ISO 9001:2008 certified",
    body: "Quality systems aligned to international standards. Documentation included with every unit.",
  },
  {
    title: "Global delivery",
    body: "Supplying universities, PG colleges and research labs across India and worldwide.",
  },
];

const audiences = [
  "Engineering Colleges",
  "Post-Graduate Colleges",
  "Universities",
  "Physics Departments",
  "Chemistry Departments",
  "Polymer Science Labs",
  "Material Science Labs",
  "R&D Centres",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-rule bg-surface">
        <div className="wrap pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6">Laboratory Scientific Instruments · Since 1976</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-ink leading-[1.02]">
              Precision instruments for research that matters.
            </h1>
            <p className="mt-8 text-base md:text-lg text-ink-muted max-w-xl leading-relaxed">
              Mittal Enterprises manufactures ultrasonic interferometers, nanofluid apparatus and specialised laboratory instruments for universities, research labs and educational institutions across India and globally.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-sm hover:bg-accent transition-colors"
              >
                Browse Instruments
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-paper border border-rule overflow-hidden">
              <Image
                src="/images/generated/hero-interferometer.png"
                alt="Ultrasonic interferometer"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                <p className="mono text-[0.7rem] uppercase tracking-widest text-paper/70 mb-1">
                  Featured
                </p>
                <p className="text-paper text-sm font-medium">
                  Ultrasonic Interferometer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-b border-rule bg-paper">
        <div className="wrap py-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 divide-y md:divide-y-0 md:divide-x divide-rule">
          {stats.map((s, i) => (
            <FadeUp key={i} delay={i * 80} className={`${i > 0 ? 'md:pl-10' : ''} ${i > 1 ? 'pt-8 md:pt-0' : ''}`}>
              <p className="mono text-3xl md:text-4xl font-medium text-ink tracking-tight">
                {s.count !== undefined ? <CountUp end={s.count} /> : s.value}
              </p>
              <p className="mt-2 text-xs md:text-sm text-ink-muted">{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="wrap pt-20 md:pt-28 pb-16 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">What we build</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-ink leading-tight">
                Six categories. Built for the bench.
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-ink hover:text-accent transition-colors"
            >
              View all instruments <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
            {productCategories.map((product, i) => (
              <FadeUp key={product.id} delay={(i % 3) * 90} className="h-full">
                <ProductCard product={product} index={i} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="border-t border-rule bg-surface">
        <div className="wrap py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <p className="eyebrow mb-4">Why labs choose us</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-tight">
                Forty-plus years of manufacturing for researchers.
              </h2>
              <p className="mt-6 text-ink-muted leading-relaxed">
                {companyInfo.about.short}
              </p>
            </div>

            <div className="md:col-span-8 grid sm:grid-cols-2 gap-px bg-rule border border-rule">
              {credentials.map((c, i) => (
                <FadeUp key={i} delay={i * 80} className="bg-surface p-6 md:p-8">
                  <p className="mono text-[0.7rem] tracking-widest uppercase text-accent mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight text-ink mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{c.body}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="border-t border-rule">
        <div className="wrap py-20 md:py-24">
          <div className="max-w-3xl mb-10">
            <p className="eyebrow mb-4">Built for</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink leading-tight">
              Trusted by faculty and researchers across disciplines.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {audiences.map((a) => (
              <span
                key={a}
                className="inline-flex items-center px-4 py-2 text-sm text-ink-2 border border-rule bg-surface rounded-sm"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper">
        <div className="wrap py-20 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8">
            <p className="mono text-xs tracking-widest uppercase text-paper/60 mb-4">Ready when you are</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
              Find the instrument your lab needs.
            </h2>
            <p className="mt-6 text-paper/70 max-w-xl leading-relaxed">
              Tell us about your experiment, frequency range or quantity — we&apos;ll respond with specs, pricing and lead time.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 rounded-sm hover:bg-accent hover:text-paper transition-colors"
            >
              Request a Quote
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-paper/30 text-paper hover:border-paper transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
