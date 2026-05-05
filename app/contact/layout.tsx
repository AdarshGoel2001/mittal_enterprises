import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Mittal Enterprises — Lab Instruments, Delhi',
  description:
    'Contact Mittal Enterprises for specs, pricing and lead time on ultrasonic interferometers and laboratory instruments. Delhi, India. Replies within one business day.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
