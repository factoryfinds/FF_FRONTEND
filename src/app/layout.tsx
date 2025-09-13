// import './globals.css'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import CheckOutTray from '@/components/CheckoutTray'
// import { SpeedInsights } from "@vercel/speed-insights/next";
// import Script from 'next/script'
// import Analytics from '@/app/details';  // ✅ import tracker
// import { Suspense } from 'react';

// import { Montserrat } from 'next/font/google';



// const inter = Montserrat({
//   subsets: ["latin"],
//   weight: ["200", "300", "400", "500", "600", "700", "800"],
//   display: "swap",
// });

// export const metadata = {
//   title: "Factory Finds | Buy Premium Clothing Online in India",
//   description: "Factory Finds — your destination for premium clothing, unbeatable style, and fast nationwide delivery.",
//   openGraph: {
//     title: "Factory Finds | Premium Clothing Online in India",
//     description: "Unbeatable style, fast nationwide delivery.",
//     url: "https://factoryfinds.store",
//     siteName: "Factory Finds",
//     locale: "en_IN",
//     type: "website",
//   },
//   twitter: {
//     title: "Factory Finds | Premium Clothing Online in India",
//     description: "Unbeatable style, fast nationwide delivery.",
//   },
// };


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className={inter.className}>
//       <head>
//         <Script
//           src="https://www.googletagmanager.com/gtag/js?id=G-TMGD28RZK5"
//           strategy="afterInteractive"
//         />
//         <Script id="google-analytics" strategy="afterInteractive">
//           {`
//           window.dataLayer = window.dataLayer || [];
//           function gtag(){dataLayer.push(arguments);}
//           gtag('js', new Date());
//           gtag('config', 'G-TMGD28RZK5');
//         `}
//         </Script>
//       </head>

//       <body className="flex flex-col min-h-screen overflow-x-hidden">
//         <Navbar />
//         <main className="flex-1 w-full relative">
//           {children}
//           <CheckOutTray />
//         </main>
//         <Footer />
//         <SpeedInsights />

//         {/* ✅ Route-change analytics tracker */}
//         {/* ✅ Suspense fixes the CSR bailout issue */}
//         <Suspense fallback={null}>
//           <Analytics />
//         </Suspense>
//       </body>
//     </html>
//   )
// }




// app/layout.tsx - Enhanced with better SEO metadata
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
  metadataBase: new URL('https://factoryfinds.store'),
  title: {
    default: "Factory Finds | Buy Premium Clothing Online in India",
    template: "%s | Factory Finds"
  },
  description: "Factory Finds — your destination for premium clothing, unbeatable style, and fast nationwide delivery. Shop t-shirts, shirts, jeans, jackets and more.",
  keywords: [
    "premium clothing",
    "online shopping India",
    "t-shirts",
    "shirts", 
    "jeans",
    "jackets",
    "fashion",
    "clothing store",
    "factory finds"
  ],
  authors: [{ name: "Factory Finds" }],
  creator: "Factory Finds",
  publisher: "Factory Finds",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Factory Finds | Premium Clothing Online in India",
    description: "Discover premium clothing with unbeatable style and fast nationwide delivery. Shop our curated collection of t-shirts, shirts, jeans, and more.",
    url: "https://factoryfinds.store",
    siteName: "Factory Finds",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/api/og-image", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Factory Finds - Premium Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Finds | Premium Clothing Online in India",
    description: "Discover premium clothing with unbeatable style and fast nationwide delivery.",
    images: ["/api/og-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your verification code
  },
  alternates: {
    canonical: "https://www.factoryfinds.store",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Google Analytics */}
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
        
        {/* Schema.org structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              name: "Factory Finds",
              description: "Premium clothing store offering t-shirts, shirts, jeans, jackets and more with fast nationwide delivery in India.",
              url: "https://factoryfinds.store",
              logo: "https://factoryfinds.store/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"]
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN"
              },
              sameAs: [
                // Add your social media URLs here
              ]
            })
          }}
        />
      </head>

      <body className="flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Skip to main content for accessibility */}
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
        
        <Footer />
        <SpeedInsights />

        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
