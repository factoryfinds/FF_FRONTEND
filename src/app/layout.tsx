import './globals.css'
import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
import CheckOutTray from '@/components/CheckoutTray'
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script'
import Analytics from '@/app/details';
import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://www.factoryfinds.store'),
  title: {
    default: "Factory Finds | Buy Premium Clothing Online in India",
    template: "%s | Factory Finds"
  },
  description: "Factory Finds — your destination for premium clothing, unbeatable style, and fast nationwide delivery. Shop t-shirts, shirts, jeans, jackets and more.",
  keywords: [
    "premium clothing", "online shopping India", "t-shirts",
    "shirts", "jeans", "jackets", "fashion", "clothing store", "factory finds"
  ],
  authors: [{ name: "Factory Finds" }],
  creator: "Factory Finds",
  publisher: "Factory Finds",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "Factory Finds | Premium Clothing Online in India",
    description: "Discover premium clothing with unbeatable style and fast nationwide delivery.",
    url: "https://www.factoryfinds.store",
    siteName: "Factory Finds",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/api/og-image", width: 1200, height: 630, alt: "Factory Finds - Premium Clothing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Finds | Premium Clothing Online in India",
    description: "Discover premium clothing with unbeatable style and fast nationwide delivery.",
    images: ["/api/og-image"],
  },
  robots: { index: true, follow: true },
  verification: { google: "your-google-verification-code" },
  alternates: { canonical: "https://www.factoryfinds.store" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-TMGD28RZK5" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TMGD28RZK5');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1170618384910953');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1170618384910953&ev=PageView&noscript=1"
          />
        </noscript>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tsgn0ixy92");
          `}
        </Script>
      </head>

      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1 w-full relative">
          {children}
          <CheckOutTray />
        </main>

        {/* <Footer /> */}
        <SpeedInsights />

        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
