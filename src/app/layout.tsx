import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckOutTray from '@/components/CheckoutTray'

// app/layout.tsx (Next.js 13+)
import { Inter, Montserrat } from 'next/font/google';


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
      <body>
        <Navbar />
        <main>
          {children}
          <CheckOutTray/>
          </main>
        <Footer />
      </body>
    </html>
  )
}
