import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Send an Enquiry — Request a Quote',
  description:
    'Request a quote on any Mittal Enterprises laboratory instrument. Provide your institution details and we will respond with specifications, pricing and lead time.',
  alternates: { canonical: '/enquiry' },
};

export default function EnquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
