// ============================================
// OPTION 2: EXIT-INTENT POPUP
// ============================================
// components/ExitIntentPopup.tsx
// USE THIS: Shows when user tries to leave, less annoying
"use client";

import { useState, useEffect } from 'react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves top of page (user trying to close tab)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  useEffect(() => {
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
        className="fixed inset-0 bg-black/70 z-50 animate-fadeIn"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-lg shadow-2xl pointer-events-auto animate-slideUp relative">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close popup"
          >
            ×
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mb-4">
              <span className="text-4xl">⏰</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-wider text-gray-900 mb-2">
              Wait!
            </h2>
            
            <p className="text-sm uppercase tracking-widest text-red-600 font-semibold mb-6">
              Diwali Sale Ends Soon
            </p>

            {/* Countdown */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="text-center">
                <div className="bg-black text-white px-4 py-3 rounded text-2xl font-bold min-w-[60px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase mt-2 text-gray-600">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-black text-white px-4 py-3 rounded text-2xl font-bold min-w-[60px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase mt-2 text-gray-600">Mins</div>
              </div>
              <div className="text-center">
                <div className="bg-black text-white px-4 py-3 rounded text-2xl font-bold min-w-[60px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase mt-2 text-gray-600">Secs</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Get up to <span className="font-bold text-red-600">40% OFF</span> + Extra 5% on prepaid orders. 
              Don&apos;t miss out on premium tees at unbeatable prices!
            </p>

            <button
              onClick={() => setIsVisible(false)}
              className="w-full bg-black text-white py-3 px-6 uppercase tracking-wider text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
