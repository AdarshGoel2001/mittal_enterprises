import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const services = [
  { title: 'International shipping', body: 'Reliable shipping to destinations worldwide with documented tracking.' },
  { title: 'Secure packaging', body: 'Professional, lab-rated packaging ensuring instruments arrive calibrated and intact.' },
  { title: 'Custom requirements', body: 'Frequency ranges, cell volumes and voltage variants tailored to your setup.' },
  { title: 'Technical documentation', body: 'User manuals, calibration certificates and application notes included.' },
  { title: 'Installation support', body: 'Remote installation guidance and operational training for international customers.' },
  { title: 'Competitive pricing', body: 'Institutional pricing for bulk orders and multi-site procurement.' },
];


export default function GlobalSuppliesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Global supplies"
        title="We ship research instruments anywhere in the world."
        description="Universities, research centres and educational institutions across multiple countries rely on us for dependable scientific instrumentation."
        breadcrumbs={[{ label: 'Global Supplies', href: '/global-supplies' }]}
      />

      <section>
        <div className="wrap py-16 md:py-24">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="eyebrow mb-4">Services</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-tight">
              End-to-end support for international orders.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
            {services.map((s, i) => (
              <div key={i} className="bg-surface p-6 md:p-8">
                <p className="mono text-[0.7rem] tracking-widest uppercase text-accent mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="wrap py-20 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8">
            <p className="mono text-xs tracking-widest uppercase text-paper/60 mb-4">Ready to order</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
              Get a quote for international delivery.
            </h2>
            <p className="mt-6 text-paper/70 max-w-xl leading-relaxed">
              Share your requirements and destination — we&apos;ll respond with full specs, lead time and shipping options.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
            <Link href="/enquiry" className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 rounded-sm hover:bg-accent hover:text-paper transition-colors">
              Request a quote <span aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-paper/30 text-paper hover:border-paper transition-colors">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
