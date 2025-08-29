import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckOutTray from '@/components/CheckoutTray'
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script'
import Analytics from '@/app/analytics'  // ✅ import tracker

import { Montserrat } from 'next/font/google';

const inter = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: 'Factory Find',
  description: 'E-commerce for fashion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TMGD28RZK5"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TMGD28RZK5');
        `}
      </Script>

      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        <main className="flex-1 w-full relative">
          {children}
          <CheckOutTray />
        </main>
        <Footer />
        <SpeedInsights />

        {/* ✅ Route-change analytics tracker */}
        <Analytics />
      </body>
    </html>
  )
}
