"use client";

import { useState, useEffect } from 'react';
import HeroBanner from '@/components/HeroBanner';
import MainScreen from '@/components/MainScreen';
import MostSoldProduct from '@/components/MostSoldProduct';
// import PackageService from '@/components/PackagingService';
import MiddleBanner from '@/components/MiddleBanner';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for actual data to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  // Alternative: Wait for all components to be ready
  // useEffect(() => {
  //   const handleLoad = () => {
  //     setIsLoading(false);
  //   };

  //   if (document.readyState === 'complete') {
  //     handleLoad();
  //   } else {
  //     window.addEventListener('load', handleLoad);
  //     return () => window.removeEventListener('load', handleLoad);
  //   }
  // }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <HeroBanner />
      <MainScreen />
      <MiddleBanner />
      <MostSoldProduct />
    </>
  );
}