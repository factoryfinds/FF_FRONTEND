"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// Dynamically import LoadingOverlay so it doesn't bloat initial JS
const LoadingOverlay = dynamic(() => import("./LoadingOverlay"), { ssr: false });

interface ProductCardProps {
  _id: string;
  title: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  onEdit?: (productId: string) => void; // Optional edit callback for admin
  showAdminControls?: boolean; // Optional prop to show admin controls
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  images,
  originalPrice,
  discountedPrice,
  onEdit,
  showAdminControls = false
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const discountPercentage =
    originalPrice > discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  // Check if user is admin from localStorage
  const isAdmin = () => {
    if (typeof window === 'undefined') return false;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role === "admin";
    } catch {
      return false;
    }
  };

  const handleClick = useCallback(() => {
    if (loading) return; // Prevent multiple navigations
    setLoading(true);
    // Small delay to allow fade-in before navigation starts
    setTimeout(() => {
      router.push(`/product/${_id}`);
    }, 50);
  }, [loading, router, _id]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(_id);
    }
  }, [onEdit, _id]);

  return (
    <>
      {loading && <LoadingOverlay isVisible={loading} />}
      <div
        role="button"
        aria-label={`View details for ${title}`}
        onClick={handleClick}
        className="group bg-white cursor-pointer transition-all duration-300 ease-out hover:shadow-xs hover:shadow-black/5 hover:-translate-y-1 w-full max-w-full overflow-hidden hover:border-gray-200/70 relative"
      >
        {/* Admin Edit Button - Only show for admins */}
        {isAdmin() && showAdminControls && onEdit && (
          <button
            onClick={handleEditClick}
            className="absolute top-3 left-3 z-20 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
            title="Edit Product"
            aria-label={`Edit ${title}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </button>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={images?.[0]}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
          <h3 className="text-xs sm:text-sm text-gray-900 font-medium leading-tight truncate group-hover:text-black transition-colors duration-200">
            {title}
          </h3>

          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm text-black font-semibold tracking-normal">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {originalPrice > discountedPrice && (
                  <span className="text-xs text-gray-400 line-through font-normal tracking-wide">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

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