"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import MainScreen from "@/components/MainScreen";
import MostSoldProduct from "@/components/MostSoldProduct";
import MiddleBanner from "@/components/MiddleBanner";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  // Responsive check
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Scroll animations
  const bannerY = useTransform(scrollYProgress, [0, 0.5], [0, 0]);
  const productY = useTransform(scrollYProgress, [0, 0.3, 0.6], ["100vh", "0vh", "-10vh"]);
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0.95]);

  // Save scroll position before unload
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("homeScroll", window.scrollY.toString());
    };
    window.addEventListener("scroll", saveScroll);
    return () => {
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);

  // Restore scroll position after loader finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const savedScroll = sessionStorage.getItem("homeScroll");
      if (savedScroll) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Factory Finds | Buy Premium Clothing Online in India</title>
        <meta
          name="description"
          content="Factory Finds — your destination for premium clothing, unbeatable style, and fast nationwide delivery."
        />
      </Head>

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <LoadingOverlay isVisible={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!isLoading && (
        <motion.div
          key="main"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero */}
          <div className="relative z-10">
            <MainScreen />
          </div>

          {/* Scrollable Banner & Product */}
          <div className="relative min-h-[200vh]">
            {/* Banner */}
            <motion.div
              className="sticky top-0 w-full h-screen flex items-center justify-center z-20"
              style={{
                y: bannerY,
                opacity: bannerOpacity,
                scale: bannerScale,
                height: isMobile ? "80vh" : "100vh",
              }}
            >
              <MiddleBanner />
            </motion.div>

            {/* Products */}
            <motion.div className="relative z-30" style={{ y: productY }}>
              <div className="bg-white pt-10 md:pt-20">
                <MostSoldProduct />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
