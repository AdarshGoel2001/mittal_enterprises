'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productCategories } from '@/lib/data';
import PageHeader from '@/components/PageHeader';

function EnquiryForm() {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get('product') || '';
  const codeFromUrl = searchParams.get('code') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    category: categoryFromUrl,
    productName: codeFromUrl ? `${productFromUrl} (${codeFromUrl})` : productFromUrl,
    quantity: '', message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enquiry submitted:', formData);
    alert('Thank you for your enquiry. We will get back to you soon!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const input = 'w-full px-4 py-3 bg-surface border border-rule-strong rounded-sm text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors';
  const label = 'block text-xs mono uppercase tracking-widest text-ink-muted mb-2';

  return (
    <div className="bg-surface border border-rule p-6 md:p-10 max-w-3xl mx-auto">
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
            <label htmlFor="phone" className={label}>Phone *</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={input} />
          </div>
          <div>
            <label htmlFor="company" className={label}>Institution</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="category" className={label}>Product Category *</label>
          <select id="category" name="category" required value={formData.category} onChange={handleChange} className={input}>
            <option value="">Select a category</option>
            {productCategories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="productName" className={label}>Specific product</label>
            <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} className={input} placeholder="Model or item code, if known" />
          </div>
          <div>
            <label htmlFor="quantity" className={label}>Quantity</label>
            <input type="number" id="quantity" name="quantity" min="1" value={formData.quantity} onChange={handleChange} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="message" className={label}>Requirements *</label>
          <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className={input} placeholder="Frequency range, experiment, application, delivery timeline…" />
        </div>
        <button type="submit" className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-sm hover:bg-accent transition-colors">
          Submit enquiry <span aria-hidden>→</span>
        </button>
      </form>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product enquiry"
        title="Request specs, pricing and lead time."
        description="Tell us what your lab needs. We'll respond within one business day with documentation and a quote."
        breadcrumbs={[{ label: 'Enquiry', href: '/enquiry' }]}
      />

      <section>
        <div className="wrap py-16 md:py-24">
          <Suspense fallback={<div className="text-center text-ink-muted">Loading form…</div>}>
            <EnquiryForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
