// components/ClientPopups.tsx
"use client";

// import dynamic from 'next/dynamic';

// ✅ NOW we can use ssr: false in a client component
// const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), {
//   ssr: false,
// });

// const LandingPopup = dynamic(() => import("@/components/LandingPopup"), {
//   ssr: false,
// });

// const StickyCountdownBanner = dynamic(() => import("@/components/StickyCountdownBanner"), {
//   ssr: false,
// });

export default function ClientPopups() {
  return (
    <>
      {/* <ExitIntentPopup /> */}
      {/* <LandingPopup /> */}
      {/* <StickyCountdownBanner /> */}
    </>
  );
}