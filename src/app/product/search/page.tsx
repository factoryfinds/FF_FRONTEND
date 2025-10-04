"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiFilter, FiGrid, FiList, FiX} from 'react-icons/fi';
import { getAllProducts } from '../../../../utlis/api';
import ProductCard from '@/components/ProductCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Product } from '../../../../utlis/api';

// Types
interface ErrorState {
  hasError: boolean;
  message: string;
}

interface FilterOptions {
  category: string;
  priceRange: number[];
  sortBy: string;
  inStockOnly: boolean;
}

// Constants
const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "jackets", label: "Jackets" },
  { value: "tshirts", label: "T-Shirts" },
  { value: "shirts", label: "Shirts" },
  { value: "pants", label: "Pants" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "priceLowToHigh", label: "Price: Low to High" },
  { value: "priceHighToLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const INITIAL_FILTERS: FilterOptions = {
  category: "all",
  priceRange: [0, 20000],
  sortBy: "relevance",
  inStockOnly: false
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
  query, 
  onClearFilters, 
  hasActiveFilters 
}: { 
  query: string;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) => (
  <div className="text-center py-16 px-8">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto mb-6 border border-gray-200">
        <FiSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-4">No Products Found</h3>
      <p className="text-sm text-gray-600 font-light tracking-wide mb-8">
        {query 
          ? `We couldn't find any products matching "${query}"`
          : hasActiveFilters 
            ? 'No products match your selected filters'
            : 'No products available'
        }
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-8 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
        >
          Clear Filters
        </button>
      )}
    </div>
  </div>
);

const PageHeader = ({ 
  query,
  filteredProductsCount, 
  onOpenFilters,
  viewMode,
  onViewModeChange
}: { 
  query: string;
  filteredProductsCount: number;
  onOpenFilters: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}) => (
  <div className="w-full px-8 lg:px-12 py-8">
    <div className="flex flex-col gap-8 border-b border-gray-200 pb-8">
      {/* Title Section */}
      <div className="text-center px-4 mt-8">
        <h1 className="text-sm sm:text-base font-black text-black uppercase tracking-[0.15em] mb-3">
          {query ? `Search Results for "${query}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-600 font-light tracking-wide">
          {filteredProductsCount} products found
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex justify-between items-center">
        {/* Filter Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:border-black transition-colors duration-300"
        >
          <FiFilter size={18} />
          <span className="hidden md:inline text-xs font-black uppercase tracking-[0.15em]">Filters</span>
        </button>

        {/* View Mode Toggle */}
        <div className="flex border border-gray-300 overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-3 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
          >
            <FiGrid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-3 border-l border-gray-300 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
          >
            <FiList size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const FilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  filteredProductsCount
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: {
    category: (value: string) => void;
    sortBy: (value: string) => void;
    priceRange: (value: number) => void;
    inStockOnly: (value: boolean) => void;
  };
  onClearFilters: () => void;
  filteredProductsCount: number;
}) => (
  <>
    {/* Overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
    )}

    {/* Drawer */}
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-labelledby="filter-title"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 lg:px-12 py-8 lg:py-16 border-b border-gray-200">
        <h2 id="filter-title" className="text-xs sm:text-sm font-black text-black uppercase tracking-[0.15em]">Filters</h2>
        <button
          onClick={onClose}
          className="text-black cursor-pointer p-2 hover:bg-gray-50 transition-colors"
          aria-label="Close filters"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-8 lg:px-12 py-8 space-y-8 overflow-y-auto h-full pb-32">
        {/* Sort Section */}
        <div>
          <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-4">Sort By</h3>
          <div className="space-y-3">
            {SORT_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => onFilterChange.sortBy(e.target.value)}
                  className="mr-3 w-4 h-4 border-2 border-gray-300 appearance-none checked:bg-black checked:border-black cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-light tracking-wide group-hover:text-black transition-colors">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Section */}
        <div>
          <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-4">Category</h3>
          <div className="space-y-3">
            {CATEGORIES.map((category) => (
              <label key={category.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) => onFilterChange.category(e.target.value)}
                  className="mr-3 w-4 h-4 border-2 border-gray-300 appearance-none checked:bg-black checked:border-black cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-light tracking-wide group-hover:text-black transition-colors">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-light">₹0</span>
              <span className="font-black text-black uppercase tracking-wider">₹{filters.priceRange[1].toLocaleString()}</span>
              <span className="text-gray-600 font-light">₹20,000</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={filters.priceRange[1]}
              onChange={(e) => onFilterChange.priceRange(parseInt(e.target.value))}
              className="w-full h-0.5 bg-gray-300 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
              aria-label={`Price range up to ${filters.priceRange[1].toLocaleString()} rupees`}
            />
            <div className="text-center text-sm font-light text-gray-600 tracking-wide">
              Up to ₹{filters.priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange.inStockOnly(e.target.checked)}
              className="mr-3 w-4 h-4 border-2 border-gray-300 appearance-none checked:bg-black checked:border-black cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-light tracking-wide group-hover:text-black transition-colors">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-8 lg:px-12 py-8 border-t border-gray-200 bg-white">
        <div className="flex gap-4">
          <button
            onClick={onClearFilters}
            className="flex-1 px-6 py-4 text-xs text-black underline hover:no-underline font-light uppercase tracking-[0.1em] transition-all duration-300"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
          >
            Show Results ({filteredProductsCount})
          </button>
        </div>
      </div>
    </div>
  </>
);

const ProductsGrid = ({ 
  products, 
  loading,
  viewMode
}: { 
  products: Product[];
  loading: boolean;
  viewMode: 'grid' | 'list';
}) => {
  if (loading) {
    return (
      <div className="w-full px-8 lg:px-12 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2 lg:gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid' 
    ? "grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2 sm:gap-y-6 sm:gap-x-2 lg:gap-y-10 lg:gap-x-2"
    : "grid grid-cols-1 gap-4";

  return (
    <div className="w-full px-8 lg:px-12 pb-12">
      <div className={gridClasses}>
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
    </div>
  );
};

// Custom Hooks
const useProductSearch = (products: Product[], query: string) => {
  return useMemo(() => {
    if (!query.trim()) return products;

    const searchTerm = query.toLowerCase();
    return products.filter(product => {
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    });
  }, [products, query]);
};

const useProductFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category);
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.discountedPrice >= filters.priceRange[0] &&
        product.discountedPrice <= filters.priceRange[1]
    );

    // Stock filter (assuming all products are in stock since API doesn't provide this info)
    // You can modify this based on your API response structure
    if (filters.inStockOnly) {
      // result = result.filter(product => product.inStock);
      // For now, we'll assume all products are in stock
    }

    // Sort products
    switch (filters.sortBy) {
      case "priceLowToHigh":
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "priceHighToLow":
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "newest":
        // Assuming newer products have later creation dates
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        // relevance - keep search order
        break;
    }

    return result;
  }, [filters, products]);

  const updateFilter = {
    category: (category: string) => setFilters(prev => ({ ...prev, category })),
    sortBy: (sortBy: string) => setFilters(prev => ({ ...prev, sortBy })),
    priceRange: (maxPrice: number) => setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] })),
    inStockOnly: (inStockOnly: boolean) => setFilters(prev => ({ ...prev, inStockOnly })),
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const hasActiveFilters = filters.category !== "all" || 
                          filters.priceRange[1] !== 20000 || 
                          filters.sortBy !== "relevance" || 
                          filters.inStockOnly;

  return { filters, filteredProducts, updateFilter, clearFilters, hasActiveFilters };
};

// Search Results Component
const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: "" });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search products based on query
  const searchResults = useProductSearch(products, query);
  
  // Apply filters to search results
  const { filters, filteredProducts, updateFilter, clearFilters, hasActiveFilters } = useProductFilters(searchResults);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError({ hasError: false, message: "" });
      const data = await getAllProducts();
      console.log("Fetched products:", data);
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

  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Keyboard event handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFilterDrawerOpen) {
        setIsFilterDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFilterDrawerOpen]);

  // Body scroll prevention
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

  // Debounced price range update
  const debouncedPriceUpdate = useCallback(
    (value: number) => {
      const timeoutId = setTimeout(() => {
        updateFilter.priceRange(value);
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [updateFilter.priceRange]
  );

  // Render loading state
  if (loading) return <LoadingOverlay isVisible={loading} />;

  // Render error state
  if (error.hasError) {
    return <ErrorFallback error={error.message} onRetry={fetchProducts} />;
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <PageHeader
        query={query}
        filteredProductsCount={filteredProducts.length}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={{
          category: updateFilter.category,
          sortBy: updateFilter.sortBy,
          priceRange: debouncedPriceUpdate,
          inStockOnly: updateFilter.inStockOnly,
        }}
        onClearFilters={clearFilters}
        filteredProductsCount={filteredProducts.length}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState 
          query={query}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <ProductsGrid 
          products={filteredProducts} 
          loading={false}
          viewMode={viewMode}
        />
      )}
    </div>
  );
};

// Main Search Page Component with Suspense
const SearchPage = () => {
  return (
    <Suspense fallback={<LoadingOverlay isVisible={false} />}>
      <SearchResultsContent />
    </Suspense>
  );
};

export default SearchPage;