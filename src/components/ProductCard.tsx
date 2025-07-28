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

  return (
    <div
      onClick={() => router.push(`/product/${_id}`)}
      className="bg-white cursor-pointer transition-transform hover:scale-[1.015] duration-200 w-full max-w-full"
    >
      {/* Product Image */}
      <div className="w-full aspect-square overflow-hidden rounded-md bg-white">
        <img
          src={images?.[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Text Details */}
      <div className="pt-2 sm:pt-3 px-1 sm:px-2">
        <h3 className="text-sm sm:text-base md:text-lg text-black font-extralight mb-1 truncate leading-tight">
          {title}
        </h3>

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {originalPrice !== discountedPrice && (
            <span className="text-sm sm:text-base md:text-lg text-black font-light">
              ₹{discountedPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs sm:text-sm md:text-base text-gray-500 line-through font-extralight">
            ₹{originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;