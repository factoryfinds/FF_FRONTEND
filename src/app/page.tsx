"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
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

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Head>
        <title>Factory Finds | Buy Premium Clothing Online in India</title>
        <meta
          name="description"
          content="Factory Finds — your destination for premium clothing, unbeatable style, and fast nationwide delivery."
        />
      </Head>
      {/* <HeroBanner /> */}
      <MainScreen />
      <MiddleBanner />
      <MostSoldProduct />
    </>
  );
}