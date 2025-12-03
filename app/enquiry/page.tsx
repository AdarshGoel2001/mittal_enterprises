'use client';

import { useState } from 'react';
import { productCategories } from '@/lib/data';
import InnerBanner from '@/components/InnerBanner';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    productName: '',
    quantity: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Enquiry submitted:', formData);
    alert('Thank you for your enquiry. We will get back to you soon!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <InnerBanner />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6">
          <div className="md:col-span-4 lg:col-span-3">
            <Sidebar />
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <Breadcrumb items={[{ label: 'Product Enquiry', href: '/enquiry' }]} />

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Product Enquiry
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 mb-8 text-center">
            Please fill out the form below to enquire about our laboratory instruments. We will respond to your enquiry as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2 font-semibold">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-gray-700 mb-2 font-semibold">Company/Institution</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 mb-2 font-semibold">Product Category *</label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
              >
                <option value="">Select a category</option>
                {productCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="productName" className="block text-gray-700 mb-2 font-semibold">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                  placeholder="If you know the specific product"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-gray-700 mb-2 font-semibold">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold">Additional Details/Requirements *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                placeholder="Please provide any additional details about your requirements..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#01c2c7] text-white py-4 px-8 hover:bg-[#3685d2] transition-colors font-semibold text-lg"
            >
              Submit Enquiry
            </button>
          </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
