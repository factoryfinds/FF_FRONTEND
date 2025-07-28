"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getAllProducts } from "../../../../utlis/api";
import ProductCard from "@/components/ProductCard";
import LoadingOverlay from "@/components/LoadingOverlay";

// TypeScript interfaces
interface Product {
  _id: string;
  title: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  category: string;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-12 px-4">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: "" });
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("priceLowToHigh");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Debounced price range update for better performance
  const debouncedPriceUpdate = useCallback(
    (value: number) => {
      const timeoutId = setTimeout(() => {
        setPriceRange([0, value]);
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    []
  );

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError({ hasError: false, message: "" });
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError({
        hasError: true,
        message: "Failed to load products. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.discountedPrice >= priceRange[0] &&
        product.discountedPrice <= priceRange[1]
    );

    // Sort products
    if (sortBy === "priceLowToHigh") {
      result.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === "priceHighToLow") {
      result.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }

    return result;
  }, [categoryFilter, priceRange, sortBy, products]);

  // Clear filters function
  const clearFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, 10000]);
    setSortBy("priceLowToHigh");
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFilterDrawerOpen) {
        setIsFilterDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFilterDrawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterDrawerOpen]);

  if (loading) return <LoadingOverlay />;

  if (error.hasError) {
    return <ErrorFallback error={error.message} onRetry={fetchProducts} />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-16 bg-white relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl ml-2 md:ml-20 font-semibold text-black tracking-wide">
          All Products
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="px-4 sm:px-6 md:px-8 py-2 mr-2 md:mr-20 border-2 rounded-3xl text-center font-semibold text-black cursor-pointer hover:bg-gray-100 transition duration-200 flex items-center gap-2 text-sm sm:text-base"
            aria-label="Open filters"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Filter Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="filter-title"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 id="filter-title" className="text-lg sm:text-xl font-semibold text-black">Filters</h2>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto h-full pb-32">
          {/* Sort By Section */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-black mb-3 sm:mb-4">Sort By</h3>
            <div className="space-y-2 sm:space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="priceLowToHigh"
                  checked={sortBy === "priceLowToHigh"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mr-3 accent-black"
                />
                <span className="text-gray-700 text-sm sm:text-base">Price: Low to High</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="priceHighToLow"
                  checked={sortBy === "priceHighToLow"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mr-3 accent-black"
                />
                <span className="text-gray-700 text-sm sm:text-base">Price: High to Low</span>
              </label>
            </div>
          </div>

          {/* Category Filter Section */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-black mb-3 sm:mb-4">Category</h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { value: "all", label: "All Categories" },
                { value: "tshirts", label: "T-Shirts" },
                { value: "shirts", label: "Shirts" },
                { value: "pants", label: "Pants" },
              ].map((category) => (
                <label key={category.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={categoryFilter === category.value}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="mr-3 accent-black"
                  />
                  <span className="text-gray-700 text-sm sm:text-base">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-black mb-3 sm:mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">₹0</span>
                <span className="font-medium text-black">₹{priceRange[1].toLocaleString()}</span>
                <span className="text-gray-600">₹20,000</span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => debouncedPriceUpdate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                aria-label={`Price range up to ${priceRange[1].toLocaleString()} rupees`}
              />
              <div className="text-center text-sm sm:text-base font-medium text-black">
                Up to ₹{priceRange[1].toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
            >
              Show Results ({filteredProducts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more products.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 md:px-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              title={product.title}
              images={product.images}
              originalPrice={product.originalPrice}
              discountedPrice={product.discountedPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
}