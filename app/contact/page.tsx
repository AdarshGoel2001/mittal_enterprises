'use client';

import { useState } from 'react';
import { companyInfo } from '@/lib/data';
import PageHeader from '@/components/PageHeader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const input = 'w-full px-4 py-3 bg-surface border border-rule-strong rounded-sm text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors';
  const label = 'block text-xs mono uppercase tracking-widest text-ink-muted mb-2';

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Tell us about your lab."
        description="Specs, pricing, lead time — we'll get back within one business day."
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
      />

      <section>
        <div className="wrap py-16 md:py-24 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-6">Reach us directly</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Address</h3>
                <p className="text-ink-2 leading-relaxed">{companyInfo.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Phone</h3>
                <p className="mono text-sm text-ink-2">{companyInfo.phone.join(' · ')}</p>
                <p className="mono text-sm text-ink-2">{companyInfo.phoneOffice}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Email</h3>
                <a href={`mailto:${companyInfo.email}`} className="text-accent hover:text-accent-hover transition-colors">
                  {companyInfo.email}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Follow</h3>
                <div className="flex gap-4 text-sm">
                  <a href={companyInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-accent transition-colors">Facebook</a>
                  <a href={companyInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-accent transition-colors">Twitter</a>
                  <a href={companyInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-accent transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="bg-surface border border-rule p-6 md:p-10">
              <p className="eyebrow mb-6">Send a message</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={label}>Name *</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={input} />
                  </div>
                  <div>
                    <label htmlFor="email" className={label}>Email *</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={input} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className={label}>Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={input} />
                  </div>
                  <div>
                    <label htmlFor="subject" className={label}>Subject *</label>
                    <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className={input} />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className={label}>Message *</label>
                  <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className={input} />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-sm hover:bg-accent transition-colors">
                  Send message <span aria-hidden>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
