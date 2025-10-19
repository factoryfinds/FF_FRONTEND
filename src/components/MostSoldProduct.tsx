"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../utlis/api";
import ProductCard from "@/components/ProductCard";
import LoadingOverlay from "@/components/LoadingOverlay"; // Adjust path as needed
import { useRouter } from "next/navigation";

export default function PopularProductsSection() {
  const [popularProducts, setPopularProducts] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();

        const sortedByPopularity = [...allProducts].sort(
          (a, b) =>
            (b.originalPrice - b.discountedPrice) -
            (a.originalPrice - a.discountedPrice)
        );

        setPopularProducts(sortedByPopularity.slice(0, 20));
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle product click navigation
  const handleProductClick = (productId: string) => {
    setIsNavigating(true);

    // Navigate to product page
    // This will depend on your routing solution (Next.js router, etc.)
    // Example with Next.js:
    // router.push(`/products/${productId}`);

    // For demonstration, you can replace this with your actual navigation logic
    window.location.href = `/products/${productId}`;
  };

  // Optional: Handle browser navigation events to hide loading
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsNavigating(false);
    };

    const handlePopState = () => {
      setIsNavigating(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  return (
    <>
      <section className=" bg-white text-black">
        
        <div className="relative  z-10 max-w-4xl mx-auto px-8 text-center w-full">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-800 mb-3 sm:mb-4 tracking-wide">
            The Essentials Collection
          </h2>
          <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 max-w-md mx-auto mb-8 sm:mb-12 leading-loose">
            Curated for You
          </p>
        </div>

        {/* Updated grid layout with wider gaps and a cleaner look */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 md:gap-0">
          {popularProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              {...product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>

        {/* You may want to add a "View All" button */}
        <div className="text-center mt-12 mb-12">
          <button
            onClick={() => router.push('/product/allProducts')}
            className="border border-gray-700 py-3 px-8 text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors duration-300">
            View Products
          </button>
        </div>
      </section>

      <LoadingOverlay isVisible={isNavigating} />
    </>
  );
}