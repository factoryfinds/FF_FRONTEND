"use client";

import React, { memo } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.2s ease-out'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Simple Brand Icon - Static SVG */}
        <div className="mb-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 100 100"
            className="text-gray-800"
            aria-hidden="true"
          >
            {/* Simple T-shirt silhouette - no animations */}
            <path
              d="M30 25 L35 20 L40 18 L60 18 L65 20 L70 25 L75 30 L75 40 L70 45 L70 75 L30 75 L30 45 L25 40 L25 30 Z"
              fill="currentColor"
            />
            {/* Simple neckline */}
            <path
              d="M40 18 Q50 25 60 18"
              fill="white"
            />
          </svg>
        </div>

        {/* Ultra-light spinner - Pure CSS */}
        <div className="mb-4">
          <div 
            className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full"
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>

        {/* Simple text */}
        <p className="text-gray-600 text-sm font-light">
          Loading your experiance...
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default memo(LoadingOverlay);