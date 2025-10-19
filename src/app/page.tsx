// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import MainScreen from "@/components/MainScreen";
// import MostSoldProduct from "@/components/MostSoldProduct";
// import MiddleBanner from "@/components/MiddleBanner";
// import LoadingOverlay from "@/components/LoadingOverlay";



// export default function HomePage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const { scrollYProgress } = useScroll();

//   // Responsive check
//   const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

//   // Scroll animations
//   const bannerY = useTransform(scrollYProgress, [0, 0.5], [0, 0]);
//   const productY = useTransform(scrollYProgress, [0, 0.3, 0.6], ["100vh", "0vh", "-10vh"]);
//   const bannerOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
//   const bannerScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0.95]);

//   // Save scroll position (optimized)
//   useEffect(() => {
//     let ticking = false;
//     const saveScroll = () => {
//       if (!ticking) {
//         requestAnimationFrame(() => {
//           sessionStorage.setItem("homeScroll", window.scrollY.toString());
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };
//     window.addEventListener("scroll", saveScroll);
//     return () => window.removeEventListener("scroll", saveScroll);
//   }, []);

//   // Restore scroll after loader
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       const savedScroll = sessionStorage.getItem("homeScroll");
//       if (savedScroll) {
//         requestAnimationFrame(() => {
//           window.scrollTo(0, parseInt(savedScroll, 10));
//         });
//       }
//     }, 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {/* Loading Animation */}
//       <AnimatePresence>
//         {isLoading && (
//           <motion.div
//             key="loader"
//             initial={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-50 bg-black flex items-center justify-center"
//           >
//             <LoadingOverlay isVisible={isLoading} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       {!isLoading && (
//         <motion.div
//           key="main"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           {/* Hero */}
//           <div className="relative z-10 ">
//             <MainScreen />
//           </div>

//           {/* Scrollable Banner & Product */}
//           <div className="relative min-h-[200vh]">
//             {/* Banner */}
//             <motion.div
//               className="sticky top-0 w-full h-screen flex items-center justify-center z-20"
//               style={{
//                 y: bannerY,
//                 opacity: bannerOpacity,
//                 scale: bannerScale,
//                 height: isMobile ? "80vh" : "100vh",
//               }}
//             >
//               <MiddleBanner />
//             </motion.div>

//             {/* Products */}
//             <motion.div className="relative z-30" style={{ y: productY }}>
//               <div className="bg-white pt-10 md:pt-20">
//                 <MostSoldProduct />
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       )}
//     </>
//   );
// }


// app/page.tsx - Remove "use client" to make it server-rendered
import MainScreen from "@/components/MainScreen";
import MostSoldProduct from "@/components/MostSoldProduct";
// import MiddleBanner from "@/components/MiddleBanner";
import ClientAnimationWrapper from "@/components/ClientAnimationWrapper";
// import the sale ribbon 
import DiwaliSaleRibbon from "@/components/saleRibbon";
import TrustBadges from "@/components/TrustBadges";
import WhyChooseUs from "@/components/WhyChooseUs";
import FounderStory from "@/components/FounderStory";
import FAQ from "@/components/FAQ";
// import StickyCountdownBanner from "@/components/StickyCountdownBanner";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import LandingPopup from "@/components/LandingPopup";
import StickyCountdownBanner from "@/components/StickyCountdownBanner";

export default function HomePage() {
  return (
    <ClientAnimationWrapper>
      <ExitIntentPopup/>
      <LandingPopup/>
      <StickyCountdownBanner />
      <DiwaliSaleRibbon/>
      {/* Hero Section - Server Rendered */}
      <div className="relative z-10">
        <MainScreen />
      </div>

      {/* Trust Badges - RIGHT AFTER HERO */}
      <TrustBadges />

      {/* Scrollable Banner & Product - Server Rendered */}
      <div className="relative min-h-[50vh]">
        {/* <div className="sticky top-0 w-full h-screen flex items-center justify-center z-20">
          <MiddleBanner />
        </div> */}

        <div className="relative z-30">
          <div className="bg-white mt-10">
            <MostSoldProduct />
          </div>
        </div>
      </div>
      {/* Trust Building Sections - AFTER PRODUCTS */}
      <WhyChooseUs />
      <FounderStory />
      <FAQ />
    </ClientAnimationWrapper>
  );
}