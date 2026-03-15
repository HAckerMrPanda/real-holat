import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModeToggle from "@/components/DemoModeToggle";
import { SearchProvider } from '@/context/SearchContext';
import { LanguageProvider } from '@/context/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real Holat - Мониторинг детских садов",
  description: "Система общественного контроля за госпроектами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50 flex flex-col min-h-screen`}>
        <LanguageProvider>
          <SearchProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </SearchProvider>
        </LanguageProvider>
        <DemoModeToggle />
      </body>
    </html>
  );
}
