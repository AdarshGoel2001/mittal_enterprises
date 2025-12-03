import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const roboto = Roboto({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Mittal Enterprises - Laboratory Scientific Instruments",
  description: "Mittal Enterprises was established in 1976 with motto of providing quality products for Educational Institutions & Research Laboratories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased text-[#545454]`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
