import type { Metadata } from "next";
import { Poppins } from 'next/font/google'

import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import { I18nProvider } from "@/context/I18nContext";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Feel Alive",
  description: "Break the cycle, now. Feel Alive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="max-w-[1000px] mx-auto bg-gray-200">

        <I18nProvider>
          <div className="hidden md:block">
            <Navbar />
          </div>
          <div className="block md:hidden">
            <MobileNavbar />
          </div>
          {children}
        </I18nProvider>


      </body>
    </html>
  );
}
