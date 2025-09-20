"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import LoadingOverlay so it doesn't bloat initial JS
const LoadingOverlay = dynamic(() => import("./LoadingOverlay"), { ssr: false });

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
  const [loading, setLoading] = useState(false);

  const discountPercentage =
    originalPrice > discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  const handleClick = useCallback(() => {
    if (loading) return; // Prevent multiple navigations
    setLoading(true);
    // Small delay to allow fade-in before navigation starts
    setTimeout(() => {
      router.push(`/product/${_id}`);
    }, 50);
  }, [loading, router, _id]);

  return (
    <>
      {loading && <LoadingOverlay isVisible={loading} />}
      <div
        role="button"
        aria-label={`View details for ${title}`}
        onClick={handleClick}
        className="group bg-white cursor-pointer transition-all duration-300 ease-out hover:shadow-xs hover:shadow-black/5 hover:-translate-y-1 w-full max-w-full overflow-hidden hover:border-gray-200/70"
      >

        {/* Product Image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={images?.[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-black/70 text-white text-[11px] tracking-wide font-light px-2 py-1 rounded-sm shadow-sm">
                -{discountPercentage}%
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
        </div>


        {/* Content */}
        <div className="p-3 sm:p-4 space-y-2">
          <h3 className="text-xs sm:text-xs text-gray-900 font-bold leading-snug tracking-tight truncate uppercase group-hover:text-black transition-colors duration-200">
            {title}
          </h3>

          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-semibold leading-snug tracking-normal">
                  RS. {discountedPrice.toLocaleString()}
                </span>
                {originalPrice > discountedPrice && (
                  <span className="text-xs text-gray-500 line-through font-normal tracking-wide">
                    RS. {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* {originalPrice > discountedPrice && (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-green-600 font-medium">
                    You Save
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    ₹{(originalPrice - discountedPrice).toLocaleString()}
                  </span>
                </div>
              )} */}
            </div>

            <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>View Details</span>
                <svg
                  className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
