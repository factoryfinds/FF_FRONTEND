"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getAllProducts } from "../../../../utlis/api";
import ProductCard from "@/components/ProductCard";
import LoadingOverlay from "@/components/productLoadingOverlay";
import { Product } from '../../../../utlis/api';
import Head from 'next/head';

// Extended Product interface for trending data
interface TrendingProduct extends Product {
    clickCount?: number;
    cartAddCount?: number;
    trendingScore?: number;
}

// Types
interface ErrorState {
    hasError: boolean;
    message: string;
}

interface FilterOptions {
    sortBy: string;
    timeRange: string;
}

// Constants
const SORT_OPTIONS = [
    { value: "trendingScore", label: "Most Trending" },
    { value: "clickCount", label: "Most Viewed" },
    { value: "cartAddCount", label: "Most Added to Cart" },
    { value: "recent", label: "Recently Popular" },
];

const TIME_RANGE_OPTIONS = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
];

const INITIAL_FILTERS: FilterOptions = {
    sortBy: "trendingScore",
    timeRange: "week"
};

// Components
const ProductCardSkeleton = () => (
    <div className="bg-white animate-pulse">
        <div className="aspect-square bg-gray-200"></div>
        <div className="pt-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    </div>
);

const ErrorFallback = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
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
                Try Again
            </button>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
            <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            </div>
            <h3 className="text-xs font-black text-black mb-3 uppercase tracking-[0.15em]">No trending products yet</h3>
            <p className="text-xs text-gray-600 font-light tracking-wide">Check back later for popular items</p>
        </div>
    </div>
);

const TrendingBadge = ({ rank}: { rank: number; type: string }) => {
    const getBadgeStyle = (rank: number) => {
        if (rank === 1) return "bg-black text-white";
        if (rank === 2) return "bg-gray-800 text-white";
        if (rank === 3) return "bg-gray-600 text-white";
        return "bg-gray-400 text-white";
    };

    const getTrendingSymbol = (rank: number) => {
        if (rank <= 3) return "#" + rank;
        return "#" + rank;
    };

    return (
        <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-black uppercase tracking-wide ${getBadgeStyle(rank)} z-10`}>
            {getTrendingSymbol(rank)}
        </div>
    );
};

const TrendingProductCard = ({
    product,
    rank
}: {
    product: TrendingProduct;
    rank: number;
}) => (
    <div className="relative">
        <TrendingBadge rank={rank} type="trending" />
        <ProductCard
            _id={product._id}
            title={product.title}
            images={product.images}
            originalPrice={product.originalPrice}
            discountedPrice={product.discountedPrice}
        />
    </div>
);

const PageHeader = ({
    filteredProductsCount,
    filters,
    onFilterChange
}: {
    filteredProductsCount: number;
    filters: FilterOptions;
    onFilterChange: {
        sortBy: (value: string) => void;
        timeRange: (value: string) => void;
    };
}) => (
    <div className="w-full border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-8 py-16">
            <div className="flex flex-col gap-8">
                
                {/* Brand and Title Section */}
                <div className="text-center">
                    {/* Brand indicator */}
                    <div className="mb-6">
                        <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-md sm:text-md font-semibold text-black mb-2 tracking-tighter">
                        Trending Products
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs font-light text-gray-700 uppercase tracking-[0.1em]">
                        Discover the most popular items based on customer interactions
                    </p>
                </div>

                {/* Filters Section */}
                <div className="flex justify-between items-center gap-6">
                    {/* Left Side - Time Range Filter */}
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-black text-black uppercase hidden sm:block tracking-[0.15em]">Period</label>
                        <div className="border border-gray-300 focus-within:border-black transition-colors">
                            <select
                                value={filters.timeRange}
                                onChange={(e) => onFilterChange.timeRange(e.target.value)}
                                className="px-4 py-2 bg-white text-xs font-light tracking-wide text-black focus:outline-none appearance-none cursor-pointer pr-8"
                            >
                                {TIME_RANGE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right Side - Sort Filter and Count */}
                    <div className="flex items-center gap-6">
                        {/* Sort Filter */}
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-black text-black uppercase tracking-[0.15em] hidden sm:block">Sort</label>
                            <div className="border border-gray-300 focus-within:border-black transition-colors">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => onFilterChange.sortBy(e.target.value)}
                                    className="px-4 py-2 bg-white text-xs font-light tracking-wide text-black focus:outline-none appearance-none cursor-pointer"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Product Count */}
                        <span className="text-xs font-light text-gray-700 uppercase tracking-[0.1em] hidden lg:block">
                            {filteredProductsCount} trending products
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ProductsGrid = ({
    products,
    loading
}: {
    products: TrendingProduct[];
    loading: boolean;
}) => (
    <div className="w-full px-2 sm:px-0 lg:px-2 pb-12">
        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2 sm:gap-2">
                {products.map((product, index) => (
                    <TrendingProductCard
                        key={product._id}
                        product={product}
                        rank={index + 1}
                    />
                ))}
            </div>
        )}
    </div>
);

// Custom Hooks
const useTrendingProducts = (products: Product[]) => {
    const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);

    const trendingProducts = useMemo(() => {
        // Convert products to trending products with mock data
        // In a real app, this data would come from your analytics/tracking system
        const productsWithTrending: TrendingProduct[] = products.map((product) => {
            // Mock trending data - replace with real data from your analytics
            const clickCount = Math.floor(Math.random() * 1000) + 50;
            const cartAddCount = Math.floor(Math.random() * 200) + 10;

            // Calculate trending score (weighted combination of clicks and cart additions)
            const trendingScore = (clickCount * 0.6) + (cartAddCount * 0.4);

            return {
                ...product,
                clickCount,
                cartAddCount,
                trendingScore,
            };
        });

        let result = [...productsWithTrending];

        // Filter by time range (mock implementation)
        // In a real app, you'd filter based on actual timestamp data
        if (filters.timeRange === 'week') {
            // Show only products with higher recent activity
            result = result.filter(product => (product.trendingScore || 0) > 100);
        } else if (filters.timeRange === 'month') {
            result = result.filter(product => (product.trendingScore || 0) > 50);
        }

        // Sort products based on selected criteria
        switch (filters.sortBy) {
            case 'clickCount':
                result.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
                break;
            case 'cartAddCount':
                result.sort((a, b) => (b.cartAddCount || 0) - (a.cartAddCount || 0));
                break;
            case 'recent':
                // Mock recent popularity - in real app, sort by recent timestamp
                result.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
                break;
            default: // trendingScore
                result.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
                break;
        }

        // Return top trending products (limit to reasonable number)
        return result.slice(0, 24);
    }, [filters, products]);

    const updateFilter = {
        sortBy: (sortBy: string) => setFilters(prev => ({ ...prev, sortBy })),
        timeRange: (timeRange: string) => setFilters(prev => ({ ...prev, timeRange })),
    };

    return { filters, trendingProducts, updateFilter };
};

// Main Component
export default function TrendingProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorState>({ hasError: false, message: "" });

    const { filters, trendingProducts, updateFilter } = useTrendingProducts(products);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError({ hasError: false, message: "" });
            const data = await getAllProducts();
            console.log("Fetched products for trending:", data);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setError({
                hasError: true,
                message: "Failed to load trending products. Please check your connection and try again.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

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
                    content="Shop trending premium fashion at Factory Finds — discover the latest styles, premium quality, and quick delivery across India."
                />
            </Head>
            <div className="bg-white min-h-screen w-full">
                <PageHeader
                    filteredProductsCount={trendingProducts.length}
                    filters={filters}
                    onFilterChange={{
                        sortBy: updateFilter.sortBy,
                        timeRange: updateFilter.timeRange,
                    }}
                />

                <main className="max-w-8xl mx-auto py-8">
                    {trendingProducts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <ProductsGrid products={trendingProducts} loading={false} />
                    )}
                </main>
            </div>
        </>
    );
}