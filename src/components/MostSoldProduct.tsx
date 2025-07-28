"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../utlis/api"; // Adjust path if needed
import ProductCard from "@/components/ProductCard"; // Capitalized import

export default function PopularProductsSection() {
  const [popularProducts, setPopularProducts] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();

        // Sort by discount amount (original - discounted)
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

  return (
    <section className="px-4 md:px-20 py-16 bg-white text-black">
      <div className="text-center mb-10">
        <p className="uppercase text-xs tracking-widest font-light text-gray-500">Editor’s Picks</p>
        <h2 className="text-3xl font-light mt-2">Most Popular Products</h2>
      </div>

      <div className="flex overflow-x-auto gap-6 px-4 snap-x snap-mandatory scroll-smooth">
        {popularProducts.map((product) => (
          <div key={product._id} className="w-[280px] flex-shrink-0 snap-center">
            <ProductCard {...product} />
          </div>
        ))}
      </div>

    </section>
  );
}
