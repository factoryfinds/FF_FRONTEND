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

const EmptyState = () => (
    <div className="text-center py-12 px-4">
        <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trending products yet</h3>
            <p className="text-gray-600">Check back later for popular items!</p>
        </div>
    </div>
);

const TrendingBadge = ({ rank}: { rank: number; type: string }) => {
    const badgeColors = {
        1: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
        2: "bg-gradient-to-r from-gray-300 to-gray-500 text-white",
        3: "bg-gradient-to-r from-orange-400 to-orange-600 text-white",
        default: "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
    };

    const getBadgeColor = (rank: number) => {
        if (rank <= 3) return badgeColors[rank as keyof typeof badgeColors];
        return badgeColors.default;
    };

    const getTrendingIcon = () => {
        if (rank === 1) return "🏆";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return "🔥";
    };

    return (
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(rank)} z-10`}>
            <span className="mr-1">{getTrendingIcon()}</span>
            #{rank}
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            {/* Title Section */}
            <div className="text-center px-4 mt-12 mb-8">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <span className="text-2xl">🔥</span>
                    <p className="uppercase text-xs sm:text-xs tracking-wider font-light text-gray-500">
                        What&apos;s hot right now
                    </p>
                </div>
                <h2 className="text-3xl font-light mt-2">
                    Trending Products
                </h2>
                <p className="text-gray-600 mt-2 text-sm">
                    Discover the most popular items based on customer interactions
                </p>
            </div>

            {/* Filters Section */}
            <div className="flex justify-between items-center gap-4">
                {/* Left Side - Period Filter */}
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                    {/* Mobile - Icon only */}
                    <div className="flex items-center gap-2 md:hidden">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <select
                            value={filters.timeRange}
                            onChange={(e) => onFilterChange.timeRange(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
                        >
                            {TIME_RANGE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop - Full text */}
                    <div className="hidden md:flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Period:</label>
                        <select
                            value={filters.timeRange}
                            onChange={(e) => onFilterChange.timeRange(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
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
                <div className="flex items-center gap-4">
                    {/* Sort Filter */}
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                        {/* Mobile - Icon only */}
                        <div className="flex items-center gap-2 md:hidden">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                            </svg>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => onFilterChange.sortBy(e.target.value)}
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
                                onChange={(e) => onFilterChange.sortBy(e.target.value)}
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

                    {/* Product Count - Desktop only, shown when there's enough space */}
                    <span className="hidden lg:block text-xs text-gray-800 font-light whitespace-nowrap">
                        {filteredProductsCount} TRENDING PRODUCTS
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
    products: TrendingProduct[];
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

                {trendingProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <ProductsGrid products={trendingProducts} loading={false} />
                )}
            </div>
        </>

    );
}