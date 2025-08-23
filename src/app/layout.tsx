import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckOutTray from '@/components/CheckoutTray'
import { SpeedInsights } from "@vercel/speed-insights/next";

// app/layout.tsx (Next.js 13+)
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
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        <main className="flex-1 w-full relative">
          {children}
          <CheckOutTray />
        </main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  )
}