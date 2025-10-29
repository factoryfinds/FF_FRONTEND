"use client";

// import { useState, useEffect } from 'react';

interface Message {
  text: string;
  emoji: string;
  highlight: boolean;
}

const DiwaliSaleRibbon = () => {
  
  const messages: Message[] = [
    { text: "EXTRA 5% ON PREPAID", emoji: "", highlight: false },
    { text: "FREE SHIPPING", emoji: "", highlight: false },
  ];

  // Triple the messages for seamless loop
  const repeatedMessages = [...messages, ...messages, ...messages];

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Subtle animated background shimmer */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px " />
      
      {/* Scrolling content */}
      <div className="relative py-1.5 overflow-hidden">
        <div className="flex animate-scroll-smooth whitespace-nowrap">
          {repeatedMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`inline-flex items-center mx-6 text-[10px] sm:text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
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
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33%);
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
          animation: scroll-smooth 10s linear infinite;
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