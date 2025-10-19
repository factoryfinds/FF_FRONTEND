"use client";

import { useState, useEffect } from 'react';

interface Message {
  text: string;
  emoji: string;
  highlight: boolean;
}

const DiwaliSaleRibbon = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 32,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const messages: Message[] = [
    { text: "40% OFF", emoji: "✦", highlight: true },
    { text: `ENDS IN ${timeLeft.hours}H ${timeLeft.minutes}M`, emoji: "⏰", highlight: false },
    { text: "EXTRA 5% ON PREPAID", emoji: "💳", highlight: false },
    { text: "FREE SHIPPING", emoji: "✓", highlight: false },
    { text: "BUY 2 GET 15% OFF", emoji: "🎁", highlight: true },
    { text: "3000+ ORDERS", emoji: "⭐", highlight: false },
    { text: "DIWALI COMBOS LIVE", emoji: "🪔", highlight: false },
  ];

  // Triple the messages for seamless loop
  const repeatedMessages = [...messages, ...messages, ...messages];

  return (
    <div className="relative overflow-hidden bg-black border-y border-amber-900/30">
      {/* Subtle animated background shimmer */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-transparent to-amber-600/20 animate-shimmer" />
      </div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      
      {/* Scrolling content */}
      <div className="relative py-2.5 overflow-hidden">
        <div className="flex animate-scroll-smooth whitespace-nowrap">
          {repeatedMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`inline-flex items-center mx-6 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
                msg.highlight 
                  ? 'text-amber-400 font-semibold' 
                  : 'text-white/90'
              }`}
            >
              <span className="mr-2 text-amber-500/60 text-base">{msg.emoji}</span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      
      <style jsx>{`
        @keyframes scroll-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-scroll-smooth {
          animation: scroll-smooth 20s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }
        
        @media (max-width: 640px) {
          .animate-scroll-smooth {
            animation: scroll-smooth 15s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default DiwaliSaleRibbon;