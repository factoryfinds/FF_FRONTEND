"use client";

import React, { memo, useCallback } from "react";
import Image from "next/image";

interface ProductCardProps {
  _id: string;
  title?: string;
  name?: string; // Some APIs use 'name' instead of 'title'
  images?: string[];
  image?: string; // Some APIs use single 'image' field
  originalPrice: number;
  discountedPrice: number;
  onProductClick?: (productId: string) => void;
}

const ProductCard = memo<ProductCardProps>(({
  _id,
  title,
  name,
  images,
  image,
  originalPrice,
  discountedPrice,
  onProductClick,
}) => {
  // Handle different API response formats
  const productTitle = title || name || "Untitled Product";
  const productImage = images?.[0] || image || "/placeholder-product.jpg";

  const discountPercentage =
    originalPrice > discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  const handleClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(_id);
    }
  }, [onProductClick, _id]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent double navigation
    if (onProductClick) {
      onProductClick(_id);
    }
  }, [onProductClick, _id]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details for ${productTitle}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group bg-white cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 w-full max-w-full overflow-hidden border border-transparent hover:border-gray-200/70"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={productImage}
          alt={productTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-product.jpg";
          }}
        />

        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/70 text-white text-[11px] tracking-wide font-light px-2 py-1 rounded-sm shadow-sm backdrop-blur-sm">
              -{discountPercentage}%
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="text-xs sm:text-sm text-gray-900 font-normal leading-snug tracking-widest truncate uppercase group-hover:text-black transition-colors duration-200">
          {productTitle}
        </h3>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            {originalPrice > discountedPrice && (
              <span className="text-xs text-gray-500 line-through font-normal tracking-wide">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm text-black font-medium leading-snug tracking-wide">
              ₹{discountedPrice.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-red-600 font-medium">
                ({discountPercentage}% off)
              </span>
            )}
          </div>

          {/* Buy Now Button - Only shows on hover */}
          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleButtonClick}
              className="bg-black w-full text-white py-3 px-6 text-xs uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label={`Buy ${productTitle}`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;