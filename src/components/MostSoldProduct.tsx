"use client";

import React, { useEffect, useState, useCallback, memo, useMemo, useTransition } from "react";
import { getAllProducts } from "../../utlis/api";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name?: string;
  title?: string;
  images?: string[];
  image?: string;
  originalPrice: number;
  discountedPrice: number;
}

// Skeleton loader component
const ProductSkeleton = memo(() => (
  <div className="bg-white animate-pulse">
    <div className="aspect-[4/5] bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
));

ProductSkeleton.displayName = "ProductSkeleton";

// Move sorting to Web Worker if available, otherwise use requestIdleCallback
const sortProductsAsync = (products: Product[]): Promise<Product[]> => {
  return new Promise((resolve) => {
    // Use requestIdleCallback for non-blocking sort
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => {
          const sorted = [...products].sort((a, b) => {
            const discountA = a.originalPrice - a.discountedPrice;
            const discountB = b.originalPrice - b.discountedPrice;
            return discountB - discountA;
          });
          resolve(sorted.slice(0, 8));
        },
        { timeout: 2000 }
      );
    } else {
      // Fallback: use setTimeout to defer work
      setTimeout(() => {
        const sorted = [...products].sort((a, b) => {
          const discountA = a.originalPrice - a.discountedPrice;
          const discountB = b.originalPrice - b.discountedPrice;
          return discountB - discountA;
        });
        resolve(sorted.slice(0, 8));
      }, 0);
    }
  });
};

const MostSoldProduct = memo(() => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch products with abort signal
        const allProducts = await getAllProducts();

        if (!isMounted) return;

        // Sort products asynchronously to avoid blocking main thread
        const sorted = await sortProductsAsync(allProducts);

        if (isMounted) {
          // Use startTransition to mark as low-priority update
          startTransition(() => {
            setPopularProducts(sorted);
            setIsLoading(false);
          });
        }
      } catch (err) {
        console.error("Failed to fetch popular products:", err);
        if (isMounted) {
          setError("Failed to load products");
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const handleProductClick = useCallback((productId: string) => {
    // Use startTransition for navigation to avoid blocking
    startTransition(() => {
      router.push(`/product/${productId}`);
    });
  }, [router]);

  // const handleViewAll = useCallback(() => {
  //   startTransition(() => {
  //     router.push('/product/allProducts');
  //   });
  // }, [router]);

  // Memoize the grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-0 max-w-7xl mx-auto">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 px-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white py-3 px-8 text-xs uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (popularProducts.length === 0) {
      return (
        <div className="text-center py-12 px-6">
          <p className="text-gray-500">No products available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 max-w-8xl mx-auto">
        {popularProducts.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            title={product.title}
            name={product.name}
            images={product.images}
            image={product.image}
            originalPrice={product.originalPrice}
            discountedPrice={product.discountedPrice}
            onProductClick={handleProductClick}
          />
        ))}
      </div>
    );
  }, [isLoading, error, popularProducts, handleProductClick]);

  return (
    <section className="bg-white py-20 sm:py-20">
      <div className="text-center mb-6 px-6">
        <div className="w-12 h-px bg-black mx-auto mb-6 opacity-40" />
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-3">
          The Essentials Collection
        </h2>
        <p className="text-xs tracking-[0.2em] uppercase text-gray-500">
          Curated for You
        </p>
      </div>

      {productGrid}

      {/* {!isLoading && !error && popularProducts.length > 0 && (
        <div className="text-center mt-16">
          <button
            onClick={handleViewAll}
            disabled={isPending}
            className="bg-black text-white py-4 px-10 text-xs uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Loading..." : "View All Products"}
          </button>
        </div>
      )} */}
    </section>
  );
});

MostSoldProduct.displayName = "MostSoldProduct";

export default MostSoldProduct;