import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

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
  title: "Mittal Enterprises — Laboratory Scientific Instruments",
  description:
    "Manufacturer of ultrasonic, nanofluid and laboratory scientific instruments for universities and research labs. Est. 1976. ISO 9001:2008 · FIEO Registered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatBubble />
      </body>
    </html>
  );
}
