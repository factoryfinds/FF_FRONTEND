"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, SortAsc } from "lucide-react";
import { getAllProducts, Product } from "../../../../../utlis/api";
import ProductCard from "@/components/ProductCard";
import { toast } from "react-hot-toast";

// Reusable Filter Icon Button
const FilterButton: React.FC<{ onClick?: () => void; size?: number }> = ({ onClick, size = 16 }) => (
  <button
    onClick={onClick}
    className="bg-white shadow-sm px-3 py-2 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-all duration-200"
  >
    <svg
      className={`w-${size} h-${size} text-gray-700`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 10h12M10 16h4" />
    </svg>
  </button>
);

const normalizeCategory = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/s$/g, ""); // remove plural s at end
};

const CategoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest");
  const [selectedGender, setSelectedGender] = useState<"all" | "men" | "women" | "unisex">("all");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const normalizedSlug = useMemo(() => normalizeCategory(slug || ""), [slug]);

  const categoryTitle = useMemo(() => {
    if (!slug) return "Category";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [slug]);

  const openFilters = () => setIsFilterDrawerOpen(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products. Please try again.");
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!allProducts.length) {
      setFilteredProducts([]);
      return;
    }

    const filtered = allProducts.filter((product) => {
      const categoryMatch =
        normalizedSlug === "" || normalizeCategory(product.category) === normalizedSlug;
      const genderMatch = selectedGender === "all" || product.gender === selectedGender;
      const availabilityMatch = !product.isDeleted && product.inStock;

      return categoryMatch && genderMatch && availabilityMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
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

    setFilteredProducts(filtered);
  }, [allProducts, normalizedSlug, sortBy, selectedGender]);

  const handleBack = () => {
    router.back();
  };

  // Loading placeholder
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-semibold">{categoryTitle}</h1>
              <div className="w-16" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-sm mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-semibold">{categoryTitle}</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Results count */}
          <div className="text-sm text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center gap-3">
            {/* Mobile: only filter icon */}
            <div className="sm:hidden">
              <FilterButton onClick={openFilters} size={4} />
            </div>

            {/* Desktop / tablet */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Gender */}
              <div className="flex items-center gap-2">
                <FilterButton size={4} />
                <select
                  value={selectedGender}
                  onChange={(e) =>
                    setSelectedGender(e.target.value as "all" | "men" | "women" | "unisex")
                  }
                  className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 z-10 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Genders</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc size={16} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "price-low" | "price-high" | "name")
                  }
                  className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 z-50 flex">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-opacity-40"
                onClick={() => setIsFilterDrawerOpen(false)}
              />
              {/* Drawer panel */}
              <div className="relative ml-auto w-3/4 max-w-xs bg-white h-full shadow-lg p-4 flex flex-col">
                <button
                  className="self-end text-gray-500 m-4"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  Close
                </button>

                <h2 className="text-lg font-semibold mb-4">Filters</h2>

                {/* Gender filter */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1">Gender</label>
                  <select
                    value={selectedGender}
                    onChange={(e) =>
                      setSelectedGender(e.target.value as "all" | "men" | "women" | "unisex")
                    }
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="all">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                {/* Sort filter */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "newest" | "price-low" | "price-high" | "name")
                    }
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                <button
                  className="mt-auto px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FilterButton size={8} />
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">No Products Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any {categoryTitle.toLowerCase()} matching your criteria.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSortBy("newest");
                    setSelectedGender("all");
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded"
                >
                  Browse All Categories
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
