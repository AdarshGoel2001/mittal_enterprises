import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
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
