"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllProducts, Product } from "../../../../utlis/api";
import ProductCard from "@/components/ProductCard";
import LoadingOverlay from "@/components/productLoadingOverlay";
import Head from 'next/head';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products - Factory Finds',
  description: 'Browse our complete collection of trendy clothes, apparel and fashion items at Factory Finds',
  alternates: {
    canonical: 'https://www.factoryfinds.store/product/allProducts',
  },
};

/* ---------------- Types ---------------- */
interface ErrorState {
  hasError: boolean;
  message?: string;
}

interface FilterOptions {
  category: string;
  priceRange: number[]; // [min, max]
  sortBy: string;
}

/* ---------------- Constants ---------------- */
const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "jackets", label: "Jackets" },
  { value: "tshirts", label: "T-Shirts" },
  { value: "shirts", label: "Shirts" },
  { value: "pants", label: "Pants" },
] as const;

const SORT_OPTIONS = [
  { value: "priceLowToHigh", label: "Price: Low to High" },
  { value: "priceHighToLow", label: "Price: High to Low" },
] as const;

const INITIAL_FILTERS: FilterOptions = {
  category: "all",
  priceRange: [0, 20000],
  sortBy: "priceLowToHigh",
};

const MAX_PRICE = 20000;

/* ---------------- Utility hooks ---------------- */
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ---------------- Presentational components (memoized) ---------------- */
const ProductCardSkeleton = React.memo(() => (
  <div className="bg-white animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="pt-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
  </div>
));
ProductCardSkeleton.displayName = "ProductCardSkeleton";

const ErrorFallback = React.memo(({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xs font-black text-black mb-3 uppercase tracking-[0.15em]">Something went wrong</h3>
      <p className="text-xs text-gray-600 font-light mb-8 tracking-wide">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
));
ErrorFallback.displayName = "ErrorFallback";

const EmptyState = React.memo(({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
        </svg>
      </div>
      <h3 className="text-xs font-black text-black mb-3 uppercase tracking-[0.15em]">No products found</h3>
      <p className="text-xs text-gray-600 font-light mb-8 tracking-wide">Try adjusting your filters to see more products.</p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
      >
        Clear filters
      </button>
    </div>
  </div>
));
EmptyState.displayName = "EmptyState";

/* ---------------- Filter Drawer component (luxury styled) ---------------- */
const FilterDrawer = React.memo(({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  filteredCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: {
    category: (v: string) => void;
    sortBy: (v: string) => void;
    priceRange: (v: number) => void;
  };
  onClearFilters: () => void;
  filteredCount: number;
}) => {
  return (
    <div>
      <Head>
        <title>All Products</title>
        <meta
          name="description"
          content="Discover trending premium clothing at Factory Finds — luxury-inspired styles, unbeatable prices, and fast delivery across India."
        />
      </Head>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
          aria-hidden
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-8 lg:px-12 py-4 lg:py-9 border-b border-gray-200">
          <h2 id="filter-title" className="text-xs sm:text-sm font-black text-black uppercase tracking-[0.15em]">Filters</h2>
          <button onClick={onClose} aria-label="Close filters" className="p-2 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 lg:px-12 py-8 space-y-8 overflow-y-auto h-full pb-32">
          {/* Sort */}
          <div>
            <h3 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">Sort By</h3>
            <div className="space-y-4">
              {SORT_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center uppercase cursor-pointer group">
                  <input
                    type="radio"
                    name="sortBy"
                    value={opt.value}
                    checked={filters.sortBy === opt.value}
                    onChange={(e) => onFilterChange.sortBy(e.target.value)}
                    className="mr-4 accent-black"
                  />
                  <span className="text-gray-700 text-xs font-light tracking-wide group-hover:text-black transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">Category</h3>
            <div className="space-y-4">
              {CATEGORIES.map((c) => (
                <label key={c.value} className="flex items-center uppercase cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={filters.category === c.value}
                    onChange={(e) => onFilterChange.category(e.target.value)}
                    className="mr-4 accent-black"
                  />
                  <span className="text-gray-700 text-xs font-light tracking-wide group-hover:text-black transition-colors">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">Price Range</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-light tracking-wide">
                <span className="text-gray-600">₹0</span>
                <span className="font-medium text-black">₹{filters.priceRange[1].toLocaleString()}</span>
                <span className="text-gray-600">₹{MAX_PRICE.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={500}
                value={filters.priceRange[1]}
                onChange={(e) => onFilterChange.priceRange(Number(e.target.value))}
                className="w-full h-1 accent-black bg-gray-200"
                aria-label={`Price range up to ${filters.priceRange[1].toLocaleString()} rupees`}
              />
              <div className="text-center text-xs font-medium text-black tracking-wide">Up to ₹{filters.priceRange[1].toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-8 lg:px-12 py-6 border-t bg-white">
          <div className="flex gap-4">
            <button
              onClick={onClearFilters}
              className="flex-1 px-6 py-4 border border-black text-black text-xs font-light uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
            >
              View {filteredCount} Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
FilterDrawer.displayName = "FilterDrawer";

/* ---------------- Products grid component ---------------- */
const ProductsGrid = React.memo(({ products, loading }: { products: Product[]; loading: boolean }) => (
  <div className="w-full px-0 sm:px-0 lg:px-0 pb-12">
    {loading ? (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2">
        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2 sm:gap-2">
        {products.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    )}
  </div>
));
ProductsGrid.displayName = "ProductsGrid";

/* ---------------- Filtering hook ---------------- */
const useProductFilters = (initialProducts: Product[]) => {
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (filters.category !== "all") {
      result = result.filter((p) => String(p.category ?? "").toLowerCase() === String(filters.category).toLowerCase());
    }

    result = result.filter((p) => {
      const price = Number(p.discountedPrice ?? p.originalPrice ?? 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.sortBy === "priceLowToHigh") {
      result.sort((a, b) => (a.discountedPrice ?? a.originalPrice ?? 0) - (b.discountedPrice ?? b.originalPrice ?? 0));
    } else if (filters.sortBy === "priceHighToLow") {
      result.sort((a, b) => (b.discountedPrice ?? b.originalPrice ?? 0) - (a.discountedPrice ?? a.originalPrice ?? 0));
    }

    return result;
  }, [initialProducts, filters]);

  const updateFilter = {
    category: useCallback((category: string) => setFilters((prev) => ({ ...prev, category })), []),
    sortBy: useCallback((sortBy: string) => setFilters((prev) => ({ ...prev, sortBy })), []),
    priceRange: useCallback((maxPrice: number) => setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice] })), []),
  };

  const clearFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  return { filters, filteredProducts, updateFilter, clearFilters };
};

/* ---------------- Main page component ---------------- */
export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorState>({ hasError: false });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // local slider state with debounce so slider feels snappy but filter isn't spammed
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(INITIAL_FILTERS.priceRange[1]);
  const debouncedMaxPrice = useDebounced<number>(localMaxPrice, 250);

  const { filters, filteredProducts, updateFilter, clearFilters } = useProductFilters(products);

  // push debounced price updates into filter hook
  useEffect(() => {
    if (filters.priceRange[1] !== debouncedMaxPrice) {
      updateFilter.priceRange(debouncedMaxPrice);
    }
  }, [debouncedMaxPrice, filters.priceRange, updateFilter]);

  // Fetch with AbortController
  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError({ hasError: false });
    try {
      const data = await getAllProducts();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data from products API");
      }
      if (!signal?.aborted) setProducts(data);
    } catch (err) {
      setError({ hasError: true, message: (err as Error)?.message ?? "Failed to load products." });
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  // keyboard: close drawer on Escape and prevent body scroll when drawer open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFilterDrawerOpen) setIsFilterDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFilterDrawerOpen]);

  useEffect(() => {
    if (isFilterDrawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => { document.body.style.overflow = "unset"; };
  }, [isFilterDrawerOpen]);

  // keep slider local state in sync with filters when filters reset externally
  useEffect(() => {
    setLocalMaxPrice(filters.priceRange[1]);
  }, [filters.priceRange[1]]);

  /* ---------- UI Handlers ---------- */
  const openFilters = useCallback(() => setIsFilterDrawerOpen(true), []);
  const closeFilters = useCallback(() => setIsFilterDrawerOpen(false), []);
  const onClearFilters = useCallback(() => {
    clearFilters();
    setLocalMaxPrice(INITIAL_FILTERS.priceRange[1]);
  }, [clearFilters]);

  // update functions forwarded to drawer
  const onCategoryChange = useCallback((v: string) => updateFilter.category(v), [updateFilter]);
  const onSortChange = useCallback((v: string) => updateFilter.sortBy(v), [updateFilter]);
  const onPriceRangeChange = useCallback((v: number) => {
    // update local slider immediately for snappy UI; debounced effect updates filter
    setLocalMaxPrice(v);
  }, []);

  // Loading / Error UI
  if (isLoading) return <LoadingOverlay/>;

  if (error.hasError) {
    return <ErrorFallback error={error.message ?? "Failed to load products."} onRetry={() => fetchProducts()} />;
  }

  /* ---------------- Render ---------------- */
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Urgency ribbon - luxury styled */}
      <div className="w-full bg-black">
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 text-center"
          role="status"
          aria-live="polite"
        >
          <span className="text-[10px] sm:text-xs font-light text-white uppercase tracking-[0.15em]">
            Limited time: Extra 10% OFF on select styles — Auto Applied at checkout
          </span>
        </div>
      </div>

      {/* Page Header - luxury styled */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-8 py-16">
          <div className="flex flex-row flex-wrap items-center justify-between gap-6">

            {/* Left: Page Title & Subtitle */}
            <div>
              {/* Brand indicator */}
              <div className="mb-4">
                <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
              </div>

              {/* Main heading */}
              <h1 className="text-md sm:text-md font-semibold text-black mb-2 tracking-tighter">
                All Products
              </h1>

              {/* Product count */}
              <p className="text-xs font-light text-gray-700 uppercase tracking-[0.1em]">
                {filteredProducts.length} items handpicked just for you
              </p>
            </div>

            {/* Right: Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={openFilters}
                className="border border-gray-300 px-6 py-3 text-xs font-light uppercase tracking-[0.15em] text-black hover:border-black hover:bg-gray-50 transition-all duration-300 flex items-center gap-3"
                aria-expanded={isFilterDrawerOpen}
                aria-controls="filter-drawer"
              >
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 4h18M6 10h12M10 16h4"
                  />
                </svg>
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={closeFilters}
        filters={{ ...filters, priceRange: [0, localMaxPrice] }}
        onFilterChange={{
          category: onCategoryChange,
          sortBy: onSortChange,
          priceRange: (v: number) => onPriceRangeChange(v),
        }}
        onClearFilters={onClearFilters}
        filteredCount={filteredProducts.length}
      />

      {/* Main content */}
      <main className="max-w-8xl mx-auto px-2 sm:px-0 lg:px-2 py-8">
        {filteredProducts.length === 0 ? (
          <EmptyState onClearFilters={onClearFilters} />
        ) : (
          <ProductsGrid products={filteredProducts} loading={false} />
        )}
      </main>
    </div>
  );
}