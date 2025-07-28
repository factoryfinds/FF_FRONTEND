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
            className="w-full max-w-[400px] sm:w-[350px] md:w-[380px] lg:w-[400px] bg-white cursor-pointer transition-transform hover:scale-[1.015] duration-200 mx-auto"
        >
            {/* Product Image */}
            <div className="w-full h-[250px] sm:h-[280px] md:h-[300px] overflow-hidden rounded-md bg-white">
                <img
                    src={images?.[0]}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Text Details */}
            <div className="pt-3 px-1">
                <h3 className="text-[16px] sm:text-[17px] md:text-[18px] text-black font-extralight mb-1 truncate">
                    {title}
                </h3>

                <div className="items-center gap-2">
                    {originalPrice !== discountedPrice && (
                        <main className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-500 line-through font-extralight" >
                            ₹{originalPrice.toLocaleString()}
                        </main>

                    )}
                    <span className="text-[18px] sm:text-[19px] md:text-[20px] text-black font-Light">
                        ₹{discountedPrice.toLocaleString()}
                    </span>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;