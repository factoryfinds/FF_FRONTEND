"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { getAllProducts, Product } from "../../../../../utlis/api";
import ProductCard from "@/components/ProductCard";
import LoadingOverlay from "@/components/productLoadingOverlay";
import Head from 'next/head';

// Types
interface ErrorState {
  hasError: boolean;
  message: string;
}

interface FilterOptions {
  sortBy: "newest" | "price-low" | "price-high" | "name";
  gender: "all" | "men" | "women" | "unisex";
}

// Constants
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

const GENDER_OPTIONS = [
  { value: "all", label: "All Genders" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

const INITIAL_FILTERS: FilterOptions = {
  sortBy: "newest",
  gender: "all"
};

// Helper Functions
const normalizeCategory = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/s$/g, "");
};

// Components
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-300 animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200"></div>
      <div className="h-4 bg-gray-200 w-3/4"></div>
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 w-16"></div>
        <div className="h-4 bg-gray-200 w-20"></div>
      </div>
    </div>
  </div>
);

const ErrorFallback = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-16 px-8">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-6 border border-red-200">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-4">Something Went Wrong</h3>
      <p className="text-sm text-gray-600 font-light tracking-wide mb-8">{error}</p>
      <button
        onClick={onRetry}
        className="px-8 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState = ({ 
  categoryTitle, 
  onClearFilters, 
  onGoBack 
}: { 
  categoryTitle: string; 
  onClearFilters: () => void; 
  onGoBack: () => void; 
}) => (
  <div className="text-center py-16 px-8">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto mb-6 border border-gray-200">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-4">No Products Found</h3>
      <p className="text-sm text-gray-600 font-light tracking-wide mb-8">
        We couldn&apos;t find any {categoryTitle.toLowerCase()} matching your criteria.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onClearFilters}
          className="px-6 py-3 text-xs text-black underline hover:no-underline font-light uppercase tracking-[0.1em] transition-all duration-300"
        >
          Clear Filters
        </button>
        <button
          onClick={onGoBack}
          className="px-8 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
        >
          Browse All Categories
        </button>
      </div>
    </div>
  </div>
);

const PageHeader = ({
  categoryTitle,
  productCount,
  filters,
  onFilterChange,
}: {
  categoryTitle: string;
  productCount: number;
  filters: FilterOptions;
  onFilterChange: {
    sortBy: (value: FilterOptions["sortBy"]) => void;
    gender: (value: FilterOptions["gender"]) => void;
  };
  onBack: () => void;
}) => (
  <div className="w-full px-8 lg:px-12 py-8">
    <div className="flex flex-col gap-8 border-b border-gray-200 pb-8">
      {/* Title Section */}
      <div className="text-center px-4 mt-8">
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
          Discover Premium Quality
        </p>
        <h1 className="text-sm sm:text-base font-black text-black uppercase tracking-[0.15em] mb-3">
          {categoryTitle}
        </h1>
        <p className="text-sm text-gray-600 font-light tracking-wide">
          Curated collection of premium {categoryTitle.toLowerCase()}
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex justify-between items-center gap-4">
        {/* Left Side - Gender Filter */}
        <div className="flex items-center gap-2 bg-white px-4 py-3 border border-gray-300 hover:border-black transition-colors">
          {/* Mobile - Icon only */}
          <div className="flex items-center gap-2 md:hidden">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange.gender(e.target.value as FilterOptions["gender"])}
              className="bg-transparent text-xs font-black uppercase tracking-wide text-gray-700 focus:outline-none appearance-none cursor-pointer"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop - Full text */}
          <div className="hidden md:flex items-center gap-2">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-gray-700">Gender:</label>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange.gender(e.target.value as FilterOptions["gender"])}
              className="bg-transparent text-xs font-light tracking-wide text-gray-700 focus:outline-none appearance-none cursor-pointer"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side - Sort Filter and Count */}
        <div className="flex items-center gap-4">
          {/* Sort Filter */}
          <div className="flex items-center gap-2 bg-white px-4 py-3 border border-gray-300 hover:border-black transition-colors">
            {/* Mobile - Icon only */}
            <div className="flex items-center gap-2 md:hidden">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange.sortBy(e.target.value as FilterOptions["sortBy"])}
                className="bg-transparent text-xs font-black uppercase tracking-wide text-gray-700 focus:outline-none appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop - Full text */}
            <div className="hidden md:flex items-center gap-2">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-gray-700">Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange.sortBy(e.target.value as FilterOptions["sortBy"])}
                className="bg-transparent text-xs font-light tracking-wide text-gray-700 focus:outline-none appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Count - Desktop only */}
          <span className="hidden lg:block text-xs text-gray-600 font-black uppercase tracking-[0.15em] whitespace-nowrap">
            {productCount} Products
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ProductsGrid = ({
  products,
  loading
}: {
  products: Product[];
  loading: boolean;
}) => (
  <div className="w-full px-8 lg:px-12 pb-12">
    {loading ? (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2 lg:gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2 sm:gap-y-6 sm:gap-x-2 lg:gap-y-10 lg:gap-x-2">
        {products.map((product) => (
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

// Custom Hooks
const useCategoryProducts = (allProducts: Product[], slug: string) => {
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);

  const normalizedSlug = useMemo(() => normalizeCategory(slug || ""), [slug]);

  const filteredProducts = useMemo(() => {
    if (!allProducts.length) return [];

    const filtered = allProducts.filter((product) => {
      const categoryMatch = normalizedSlug === "" || normalizeCategory(product.category) === normalizedSlug;
      const genderMatch = filters.gender === "all" || product.gender === filters.gender;
      const availabilityMatch = !product.isDeleted && product.inStock;

      return categoryMatch && genderMatch && availabilityMatch;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.discountedPrice - b.discountedPrice;
        case "price-high":
          return b.discountedPrice - a.discountedPrice;
        case "name":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [allProducts, normalizedSlug, filters]);

  const updateFilter = {
    sortBy: (sortBy: FilterOptions["sortBy"]) => setFilters(prev => ({ ...prev, sortBy })),
    gender: (gender: FilterOptions["gender"]) => setFilters(prev => ({ ...prev, gender })),
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  return { filters, filteredProducts, updateFilter, clearFilters };
};

// Main Component
const CategoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: "" });

  const categoryTitle = useMemo(() => {
    if (!slug) return "Category";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [slug]);

  const { filters, filteredProducts, updateFilter, clearFilters } = useCategoryProducts(allProducts, slug);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError({ hasError: false, message: "" });
      const products = await getAllProducts();
      console.log("Fetched products for category:", products);
      setAllProducts(products);
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

  const handleBack = () => {
    router.back();
  };

  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Render loading state
  if (loading) return <LoadingOverlay />;

  // Render error state
  if (error.hasError) {
    return <ErrorFallback error={error.message} onRetry={fetchProducts} />;
  }

  // Main render
  return (
    <>
      <Head>
        <meta
          name="description"
          content={`Shop premium ${categoryTitle.toLowerCase()} at Factory Finds — discover the latest styles, premium quality, and quick delivery across India.`}
        />
      </Head>
      <div className="bg-white min-h-screen w-full">
        <PageHeader
          categoryTitle={categoryTitle}
          productCount={filteredProducts.length}
          filters={filters}
          onFilterChange={{
            sortBy: updateFilter.sortBy,
            gender: updateFilter.gender,
          }}
          onBack={handleBack}
        />

        {filteredProducts.length === 0 ? (
          <EmptyState 
            categoryTitle={categoryTitle}
            onClearFilters={clearFilters}
            onGoBack={handleBack}
          />
        ) : (
          <ProductsGrid products={filteredProducts} loading={false} />
        )}
      </div>
    </>
  );
};

export default CategoryPage;