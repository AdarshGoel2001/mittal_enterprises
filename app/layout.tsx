import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "katex/dist/katex.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { companyInfo } from "@/lib/data";

export const SITE_URL = "https://www.mittalenterprises.com";

const themeBootstrap = `(function(){try{var u=new URL(location.href);var t=u.searchParams.get('theme')||localStorage.getItem('me-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mittal Enterprises — Laboratory Scientific Instruments",
    template: "%s | Mittal Enterprises",
  },
  description:
    "Manufacturer of ultrasonic, nanofluid and laboratory scientific instruments for universities and research labs. Est. 1976. ISO 9001:2008 · FIEO Registered.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Mittal Enterprises",
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: companyInfo.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  email: companyInfo.email,
  telephone: companyInfo.phone[0],
  foundingDate: "1976",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2151/T-7C, New Patel Nagar",
    addressLocality: "Delhi",
    postalCode: "110008",
    addressCountry: "IN",
  },
  sameAs: [
    companyInfo.social.facebook,
    companyInfo.social.twitter,
    companyInfo.social.linkedin,
  ],
  hasCredential: ["ISO 9001:2008", "FIEO Registered Member"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatBubble />
        <Suspense fallback={null}>
          <ThemeSwitcher />
        </Suspense>
      </body>
    </html>
  );
}
