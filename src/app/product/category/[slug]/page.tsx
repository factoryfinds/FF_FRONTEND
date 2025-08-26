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

const EmptyState = ({ 
  categoryTitle, 
  onClearFilters, 
  onGoBack 
}: { 
  categoryTitle: string; 
  onClearFilters: () => void; 
  onGoBack: () => void; 
}) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
      <p className="text-gray-600 mb-6">
        We couldn&apos;t find any {categoryTitle.toLowerCase()} matching your criteria.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClearFilters}
          className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg font-medium"
        >
          Clear Filters
        </button>
        <button
          onClick={onGoBack}
          className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-lg font-medium"
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
  // onBack
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
  <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
    {/* Navigation Header */}
    {/* <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>
      
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-semibold text-gray-900">{categoryTitle}</h1>
      </div>
      
      <div className="w-16" />
    </div> */}

    <div className="flex flex-col gap-6 border-b border-gray-200 pb-6">
      {/* Title Section */}
      <div className="text-center px-4">
        <div className="flex justify-center items-center gap-2 mb-2">
          <p className="uppercase text-xs sm:text-xs tracking-wider font-light text-gray-500">
            Discover Premium Quality
          </p>
        </div>
        <h2 className="text-3xl font-light mt-2">
          {categoryTitle}
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Curated collection of premium {categoryTitle.toLowerCase()}
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex justify-between items-center gap-4">
        {/* Left Side - Gender Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
          {/* Mobile - Icon only */}
          <div className="flex items-center gap-2 md:hidden">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange.gender(e.target.value as FilterOptions["gender"])}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
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
            <label className="text-sm font-medium text-gray-700">Gender:</label>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange.gender(e.target.value as FilterOptions["gender"])}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
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
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            {/* Mobile - Icon only */}
            <div className="flex items-center gap-2 md:hidden">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange.sortBy(e.target.value as FilterOptions["sortBy"])}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
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
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange.sortBy(e.target.value as FilterOptions["sortBy"])}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
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
          <span className="hidden lg:block text-xs text-gray-800 font-light whitespace-nowrap">
            {productCount} PRODUCTS
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
  <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
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