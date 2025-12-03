'use client';

import { useState } from 'react';
import { companyInfo } from '@/lib/data';
import InnerBanner from '@/components/InnerBanner';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <Breadcrumb items={[{ label: 'Contact Us', href: '/contact' }]} />

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Contact Us
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Get In Touch</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{companyInfo.name}</h3>
                <p>{companyInfo.address}</p>
              </div>
              <div>
                <p className="font-semibold">Mobile:</p>
                <p>{companyInfo.phone.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>{companyInfo.phoneOffice}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <a href={`mailto:${companyInfo.email}`} className="text-[#3685d2] hover:underline">
                  {companyInfo.email}
                </a>
              </div>
              <div className="pt-4">
                <p className="font-semibold mb-2">Follow Us:</p>
                <div className="flex gap-4">
                  <a href={companyInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="text-[#3685d2] hover:text-[#00c2c7]">
                    Facebook
                  </a>
                  <a href={companyInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="text-[#3685d2] hover:text-[#00c2c7]">
                    Twitter
                  </a>
                  <a href={companyInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#3685d2] hover:text-[#00c2c7]">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Name *</label>
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
                <label htmlFor="email" className="block text-gray-700 mb-2">Email *</label>
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
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3685d2]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#01c2c7] text-white py-3 px-8 hover:bg-[#3685d2] transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
