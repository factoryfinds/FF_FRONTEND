// ============================================
// OPTION 1: STICKY TOP COUNTDOWN BANNER
// ============================================
// components/StickyCountdownBanner.tsx
// USE THIS: Best for ongoing sales, always visible, professional
"use client";

import { useState, useEffect } from 'react';

export default function StickyCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // SET YOUR ACTUAL SALE END TIME HERE
    // Format: 'October 25, 2025 23:59:59'
    const saleEndTime = new Date('October 25, 2025 23:59:59').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = saleEndTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-0 z-0 bg-red-600 text-white py-3 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-4 text-center flex-wrap">
        <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold">
          🔥 DIWALI SALE ENDS IN:
        </span>
        <div className="flex items-center gap-2">
          <div className="bg-white text-red-600 px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base min-w-[40px] sm:min-w-[50px]">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span className="font-bold">:</span>
          <div className="bg-white text-red-600 px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base min-w-[40px] sm:min-w-[50px]">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span className="font-bold">:</span>
          <div className="bg-white text-red-600 px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base min-w-[40px] sm:min-w-[50px]">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
        <span className="text-xs uppercase tracking-wider hidden sm:inline">
          Don&apos;t Miss Out!
        </span>
      </div>
    </div>
  );
}
