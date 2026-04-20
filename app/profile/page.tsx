import Link from 'next/link';
import { companyInfo } from '@/lib/data';
import PageHeader from '@/components/PageHeader';

const pillars = [
  {
    title: 'Quality products',
    body: 'All instruments manufactured to the highest standards and covered by Trademark, Design Registration and Copyright.',
  },
  {
    title: 'Expert support',
    body: 'Comprehensive support for installation, training and maintenance across every instrument we ship.',
  },
  {
    title: 'Research & development',
    body: 'Continuous R&D brings the latest innovations in laboratory instrumentation to our customers.',
  },
  {
    title: 'Global delivery',
    body: 'Serving educational institutions and research laboratories worldwide with timely delivery.',
  },
];

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Company Profile"
        title="Built on quality, precision and trust since 1976."
        description={companyInfo.about.short}
        breadcrumbs={[{ label: 'Profile', href: '/profile' }]}
      />

      <section>
        <div className="wrap py-16 md:py-24 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-4">Our distinction</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink leading-snug">
              The only manufacturer of Nanofluid Interferometers in India.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6 text-ink-2 leading-relaxed">
            <p>{companyInfo.about.distinction}</p>
            <p>
              Mittal Enterprises has a distinction in manufacturing Nanofluid Interferometer, Ultrasonic Interferometers and other scientific equipments for research and laboratory experiments in Physics, Chemistry, Polymer Science and Material Science departments of engineering colleges, post-graduate colleges and universities.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-rule bg-surface">
        <div className="wrap py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-4">What we offer</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-tight">
              Four pillars behind every instrument.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
            {pillars.map((p, i) => (
              <div key={i} className="bg-surface p-6 md:p-8">
                <p className="mono text-[0.7rem] tracking-widest uppercase text-accent mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="wrap py-20 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8">
            <p className="mono text-xs tracking-widest uppercase text-paper/60 mb-4">Our commitment</p>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
              Long-lasting relationships with institutions across the world.
            </h2>
            <p className="mt-6 text-paper/70 max-w-2xl leading-relaxed">
              We are committed to providing quality products for educational institutions and research laboratories. Our focus on customer satisfaction, competitive pricing and timely delivery continues to drive us as we expand our product range to meet the evolving needs of modern research and education.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 rounded-sm hover:bg-accent hover:text-paper transition-colors">
              Contact us <span aria-hidden>→</span>
            </Link>
            <Link href="/enquiry" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-paper/30 text-paper hover:border-paper transition-colors">
              Send enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
