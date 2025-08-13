"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  _id: string;
  title: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  images,
  originalPrice,
  discountedPrice,
}) => {
  const router = useRouter();

  const discountPercentage = originalPrice > discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => router.push(`/product/${_id}`)}
      className="group bg-white cursor-pointer transition-all duration-300 ease-out hover:shadow-xs hover:shadow-black/5 hover:-translate-y-1 w-full max-w-full overflow-hidden hover:border-gray-200/70"
    >
      {/* Product Image Container - 4:5 aspect ratio for clothing */}
      <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={images?.[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Discount Badge - Only show if there's a discount */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/70 text-white text-[11px] tracking-wide font-light px-2 py-1 rounded-sm shadow-sm">
              -{discountPercentage}%
            </div>
          </div>
        )}

        {/* Subtle overlay on hover for premium feel */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
      </div>

      {/* Content Section with better spacing */}
      <div className="p-3 sm:p-4 space-y-2">
        {/* Title with ellipsis truncation */}
        <h3 className="text-xs sm:text-sm text-gray-900 font-medium leading-tight truncate group-hover:text-black transition-colors duration-200">
          {title}
        </h3>

        {/* Price Section */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              {/* Current Price - Most prominent */}
              <span className="text-sm sm:text-sm md:text-sm text-black font-semibold tracking-normal">
                ₹{discountedPrice.toLocaleString()}
              </span>

              {/* Original Price - Smaller and muted when discounted */}
              {originalPrice > discountedPrice && (
                <span className="text-xs lg:text-xs sm:text-base text-gray-400 line-through font-normal tracking-wide">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Savings Amount - More compelling than percentage */}
            {originalPrice > discountedPrice && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-green-600 font-medium">
                  You Save
                </span>
                <span className="text-sm font-bold text-green-600">
                  ₹{(originalPrice - discountedPrice).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Subtle call-to-action hint */}
          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>View Details</span>
              <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;