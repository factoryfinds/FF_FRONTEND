"use client";
import { useState, useEffect } from "react";

export default function LandingPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lastShown = window.localStorage?.getItem("landingPopupShown");
    const today = new Date().toDateString();
    if (lastShown === today) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      window.localStorage.setItem("landingPopupShown", today);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText("SAVE200");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={() => setIsVisible(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-orange-600 via-red-500 to-orange-700 text-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-popup">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light"
          >
            ×
          </button>

          <div className="px-8 py-10 text-center">
            <h2 className="text-5xl font-extrabold mb-2 tracking-tight">
              ₹200 OFF
            </h2>
            <p className="text-sm uppercase tracking-wider text-white/70 mb-6">
              On Any Product — Today Only ⚡
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl py-5 mb-6">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
                Your Coupon Code
              </p>
              <div className="text-3xl font-mono font-semibold mb-2">
                SAVE200
              </div>
              <button
                onClick={copyCode}
                className="text-xs tracking-wide uppercase text-white/90 hover:text-white transition flex items-center justify-center gap-2"
              >
                {copied ? "✓ Copied!" : "📋 Copy Code"}
              </button>
            </div>

            <div className="text-sm text-white/80 mb-6">
              Exclusive for first-time buyers — limited time only.
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-gray-100 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Shop Now
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="mt-4 text-sm text-white/70 hover:text-white"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-popup {
          animation: popup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
}
