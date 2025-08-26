"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../utlis/api";
import ProductCard from "@/components/ProductCard";
import LoadingOverlay from "@/components/LoadingOverlay"; // Adjust path as needed

export default function PopularProductsSection() {
  const [popularProducts, setPopularProducts] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isNavigating, setIsNavigating] = useState(false);

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
      <section className="px-4 md:px-20 py-16 bg-white text-black">
        <div className="text-center mb-10">
          <p className="uppercase text-xs tracking-widest font-light text-gray-500">Editor's Picks</p>
          <h2 className="text-3xl font-light mt-2">Most Popular Products</h2>
        </div>

        {/* ✅ Grid layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {popularProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              {...product} 
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isNavigating} />
    </>
  );
}