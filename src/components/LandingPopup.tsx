
// ============================================
// OPTION 3: LANDING POPUP (IMMEDIATE)
// ============================================
// components/LandingPopup.tsx
// USE THIS: Shows immediately on page load. ONLY if sale is genuinely ending!
"use client";

import { useState, useEffect } from 'react';

export default function LandingPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Check if popup was already shown today
    const lastShown = localStorage.getItem('landingPopupShown');
    const today = new Date().toDateString();

    if (lastShown === today) {
      return; // Don't show again today
    }

    // Show popup after 1 second delay (let page load first)
    const timer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem('landingPopupShown', today);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // SET YOUR ACTUAL SALE END TIME HERE
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
      }
    };

    if (isVisible) {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-50 animate-fadeIn"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white max-w-lg w-full p-8 sm:p-10 rounded-lg shadow-2xl pointer-events-auto animate-scaleIn relative">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
            aria-label="Close popup"
          >
            ×
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mb-4">
              <span className="text-5xl">🪔</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-wider text-gray-900 mb-2">
              Diwali Sale
            </h2>
            
            <p className="text-base uppercase tracking-widest text-red-600 font-bold mb-6">
              Ending Soon!
            </p>

            {/* Large Countdown */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-6 px-4 rounded-lg mb-6">
              <p className="text-xs uppercase tracking-wider mb-3 opacity-90">
                Sale Ends In
              </p>
              <div className="flex justify-center gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="bg-white text-red-600 px-3 sm:px-5 py-3 sm:py-4 rounded text-3xl sm:text-4xl font-bold min-w-[60px] sm:min-w-[80px]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase mt-2">Hours</div>
                </div>
                <div className="flex items-center text-2xl sm:text-3xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 px-3 sm:px-5 py-3 sm:py-4 rounded text-3xl sm:text-4xl font-bold min-w-[60px] sm:min-w-[80px]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase mt-2">Minutes</div>
                </div>
                <div className="flex items-center text-2xl sm:text-3xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 px-3 sm:px-5 py-3 sm:py-4 rounded text-3xl sm:text-4xl font-bold min-w-[60px] sm:min-w-[80px]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase mt-2">Seconds</div>
                </div>
              </div>
            </div>

            {/* Offer details */}
            <div className="mb-6 space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                UP TO 40% OFF
              </p>
              <p className="text-sm text-gray-600">
                + Extra 5% on Prepaid Orders
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Auto-Applied • No Code Needed
              </p>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="w-full bg-black text-white py-4 px-6 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors mb-3"
            >
              Shop Now
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-700"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}