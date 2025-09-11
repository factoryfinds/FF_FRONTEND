// components/ClientAnimationWrapper.tsx - New component for client-side animations
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import LoadingOverlay from "@/components/LoadingOverlay";


interface ClientAnimationWrapperProps {
  children: React.ReactNode;
}

export default function ClientAnimationWrapper({ children }: ClientAnimationWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { scrollYProgress } = useScroll();

  // Responsive check

  // Scroll animations
  const bannerY = useTransform(scrollYProgress, [0, 0.5], [0, 0]);
  const productY = useTransform(scrollYProgress, [0, 0.3, 0.6], ["100vh", "0vh", "-10vh"]);
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0.95]);

  // Save scroll position (optimized)
  useEffect(() => {
    let ticking = false;
    const saveScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          sessionStorage.setItem("homeScroll", window.scrollY.toString());
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", saveScroll);
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);

  // Show content immediately, then hide loader
  useEffect(() => {
    // Show content immediately for SEO
    setShowContent(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      const savedScroll = sessionStorage.getItem("homeScroll");
      if (savedScroll) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        });
      }
    }, 1000); // Reduced from 1500ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Animation - Non-blocking for SEO */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center pointer-events-none"
          >
            <LoadingOverlay isVisible={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Always visible for SEO, animated for UX */}
      <motion.div
        key="main"
        initial={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          "--banner-y": bannerY,
          "--product-y": productY,
          "--banner-opacity": bannerOpacity,
          "--banner-scale": bannerScale,
        } as unknown as React.CSSProperties}
      >
        {children}
      </motion.div>
    </>
  );
}