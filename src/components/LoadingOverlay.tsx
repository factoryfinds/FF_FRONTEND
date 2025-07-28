"use client";

import React from "react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        
        {/* Factory Finds Custom Icon - Clothing Theme */}
        <div className="mb-8">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 100 100" 
            className="text-black"
          >
            {/* T-shirt silhouette */}
            <path 
              d="M30 25 L35 20 L40 18 L60 18 L65 20 L70 25 L75 30 L75 40 L70 45 L70 75 L30 75 L30 45 L25 40 L25 30 Z" 
              fill="currentColor"
            />
            
            {/* T-shirt neckline */}
            <path 
              d="M40 18 Q50 25 60 18" 
              fill="white" 
              stroke="currentColor" 
              strokeWidth="1"
            />
            
            {/* Hanging on hanger */}
            <line x1="35" y1="15" x2="65" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Animated floating elements - fabric particles */}
            <g className="animate-pulse">
              <circle cx="20" cy="30" r="1" fill="currentColor" opacity="0.4" />
              <circle cx="82" cy="35" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="15" cy="50" r="1" fill="currentColor" opacity="0.5" />
            </g>
            
            <g className="animate-pulse" style={{ animationDelay: '0.7s' }}>
              <circle cx="85" cy="55" r="1" fill="currentColor" opacity="0.4" />
              <circle cx="18" cy="65" r="1.5" fill="currentColor" opacity="0.3" />
            </g>
            
            {/* Subtle design lines on shirt */}
            <line x1="35" y1="35" x2="45" y2="35" stroke="white" strokeWidth="1" opacity="0.6" />
            <line x1="35" y1="40" x2="40" y2="40" stroke="white" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>

        {/* Simple Progress Circle */}
        <div className="relative mb-6">
          <div className="w-8 h-8 border-2 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-black text-sm font-extralight tracking-wide">
          Loading your experience...
        </p>
        
      </div>
    </div>
  );
}