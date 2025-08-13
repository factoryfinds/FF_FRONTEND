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

  const discountPercentage =
    originalPrice > discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  return (
    <div
      onClick={() => router.push(`/product/${_id}`)}
      className="group w-full max-w-[400px] sm:w-[350px] md:w-[380px] lg:w-[400px] bg-white cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative w-full h-[250px] sm:h-[280px] md:h-[300px] overflow-hidden rounded-sm bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={images?.[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/70 text-white text-[11px] tracking-wide font-light px-2 py-1 rounded-sm shadow-sm">
              -{discountPercentage}%
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>
      </div>

      {/* Details */}
      <div className="pt-3 px-1 space-y-1">
        {/* Title */}
        <h3 className="text-[15px] sm:text-[16px] md:text-[17px] text-gray-900 font-light tracking-wide truncate group-hover:text-black">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          {originalPrice > discountedPrice && (
            <span className="text-[13px] sm:text-[14px] text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-[17px] sm:text-[18px] text-gray-900 font-medium">
            ₹{discountedPrice.toLocaleString()}
          </span>
        </div>

        {/* View Details CTA */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[11px] uppercase tracking-widest text-gray-500 group-hover:text-gray-800">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
