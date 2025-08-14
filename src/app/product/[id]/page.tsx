"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/RelatedProductsCard";
import { addProductToCart, getAllProducts, Product } from '../../../../utlis/api';
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from 'react-hot-toast';

// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState({ x: 50, y: 50, active: false });
  const [showSizes, setShowSizes] = useState(false);

  // Use ref to track if click has been tracked to prevent duplicates
  const clickTrackedRef = useRef(false);

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoadingProducts(true);
        clickTrackedRef.current = false; // Reset click tracking flag

        const res = await fetch(`http://192.168.29.110:5000/api/products/${id}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        if (!data) {
          throw new Error('Product not found');
        }

        setProduct(data);

        // Set default size if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Failed to load product details');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Separate effect for click tracking - runs only once per product load
  useEffect(() => {
    const trackProductClick = async (productId: string): Promise<void> => {
      // Prevent duplicate tracking
      if (clickTrackedRef.current) return;

      try {
        clickTrackedRef.current = true; // Mark as tracked immediately

        const response = await fetch(`http://192.168.29.110:5000/api/products/${productId}/track-click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Click tracked! Total clicks: ${data.clickCount}`);
        }
      } catch (error) {
        console.error('Click tracking failed:', error);
        clickTrackedRef.current = false; // Reset on error to allow retry
      }
    };

    // Only track click when we have both id and product loaded
    if (id && product && !clickTrackedRef.current) {
      trackProductClick(id as string);
    }
  }, [id, product]); // Dependencies: id and product

  // Fetch related products based on category and gender
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        setLoadingRelated(true);

        // Get all products from API
        const allProducts = await getAllProducts();

        // Filter products by same category and gender, exclude current product
        const filtered = allProducts
          .filter(p =>
            p._id !== product._id && // Exclude current product
            p.category === product.category && // Same category
            p.gender === product.gender && // Same gender
            p.inStock && // Only in-stock products
            !p.isDeleted // Only non-deleted products
          )
          .slice(0, 6); // Limit to 6 related products

        setRelatedProducts(filtered);

      } catch (error) {
        console.error('Error fetching related products:', error);
        toast.error('Failed to load related products');
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Show loading overlay when fetching product data OR adding to cart
  if (loadingProducts || addingToCart) return <LoadingOverlay />
  if (!product) return <LoadingOverlay />;

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, product.inventory)));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      return toast.error("Please select both size and color before adding to cart.");
    }

    try {
      setAddingToCart(true);

      const response = await addProductToCart({
        productId: product._id,
        quantity: quantity,
        size: selectedSize
      });

      console.log("Cart updated:", response.cart);
      toast.success("Added to cart!");

      // Trigger cart update event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Also set a localStorage flag for cross-tab updates
      localStorage.setItem('cart-updated', Date.now().toString());

    }

    catch (error: unknown) {
      console.error('Add to cart error:', error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add item to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Product Images */}
          <div className="w-full lg:w-6/10">
            {/* Main Image */}
            <div
              className="w-full aspect-square bg-gray-100 mb-3 overflow-hidden rounded-xl cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setIsZoomed({ x, y, active: true });
              }}
              onMouseEnter={() => setIsZoomed({ x: 50, y: 50, active: true })}
              onMouseLeave={() => setIsZoomed({ x: 50, y: 50, active: false })}
            >
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed.active && window.innerWidth >= 1024 ? "scale-200" : "scale-100"
                  }`}
                style={{ transformOrigin: `${isZoomed.x}% ${isZoomed.y}%` }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              {product.images.slice(0, 4).map((img: string, index: number) => (
                <div
                  key={index}
                  className={`aspect-square overflow-hidden rounded-lg border-2 cursor-pointer ${index === currentImageIndex
                    ? "border-white"
                    : "border-transparent hover:border-gray-400"
                    }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-15 px-4 lg:pl-25 lg:me-20">
            {/* Brand Name */}
            <div className="flex items-center mb-2">
              <p className="text-lg font-extralight text-gray-600">FactoryFinds</p>
              <svg
                className="w-6 h-6 text-gray-600 ml-auto cursor-pointer hover:text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-normal text-black mb-5 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-0">
                <span className="text-lg sm:text-xl font-light text-black">
                  ₹{product.discountedPrice.toLocaleString()}.00
                </span>
                {product.originalPrice !== product.discountedPrice && (
                  <span className="text-base sm:text-lg font-extralight text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}.00
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-800">(M.R.P. incl of all taxes)</p>
            </div>

            {/* Select Your Size */}
            <div className="mb-6">
              <div
                onClick={() => setShowSizes(!showSizes)}
                className="cursor-pointer flex items-center justify-between"
              >
                <p className="text-base sm:text-lg font-bold text-black mt-4 sm:mt-8">Select Your Size</p>
                <svg
                  className={`w-5 h-5 mt-6 sm:mt-10 ml-2 transform transition-transform duration-300 ${showSizes ? "rotate-180" : "rotate-0"
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <hr className="mt-2 border-black mb-4 border-t-[3px]" />

              {showSizes && (
                <div className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm ${selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-black hover:border-black"
                        }`}
                      disabled={addingToCart}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <p className="text-base font-medium text-black mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-black disabled:opacity-50"
                  disabled={quantity <= 1 || addingToCart}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-black disabled:opacity-50"
                  disabled={quantity >= product.inventory || addingToCart}
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-8 sm:mt-15">
              {product.inventory > 0 ? (
                <span>{product.inventory} items available</span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </div>

            {/* Action Section */}
            {product.inventory > 0 ? (
              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-2 mb-12 sm:mb-18">
                <button
                  className="flex-1 bg-black text-white py-3 px-6 text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                  disabled={addingToCart}
                >
                  Buy Now
                </button>
                <button
                  className="flex-1 border border-black text-black py-3 px-6 text-sm font-medium rounded-xl cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !selectedSize}
                >
                  {addingToCart ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </div>
                  ) : (
                    "Add To Cart"
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-4 mb-10 text-red-600 text-sm font-medium">
                This product is currently out of stock.
              </div>
            )}

            {/* Questions Section */}
            <div className="mb-6">
              <p className="text-sm text-black mb-2">
                <strong>Questions?</strong> Our team is available to help you make the right choice.
              </p>
            </div>

            {/* Product Description */}
            <div className="text-sm text-gray-700 space-y-3">
              {product.description && (
                <div className="mt-6 text-sm text-gray-700 leading-relaxed">
                  {product.description.split(/(?=[A-Z][a-z]+:)/g).map((line, index) => {
                    const [label, ...rest] = line.split(':');
                    const value = rest.join(':').trim();

                    return (
                      <p key={index} className="mb-1">
                        <span className="font-medium text-black">{label.trim()}:</span> {value}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Now in India */}
            <div className="mt-6">
              <p className="text-sm font-medium text-black">Right Now in India</p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 mb-12 px-4 sm:px-6 lg:px-30">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Related Products</h2>

          {loadingRelated ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading related products...</span>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="relative">
              {/* Horizontal Scrollable Container */}
              <div
                className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct._id} className="flex-shrink-0 w-[280px] sm:w-[320px]">
                    <ProductCard
                      _id={relatedProduct._id}
                      title={relatedProduct.title}
                      images={relatedProduct.images}
                      originalPrice={relatedProduct.originalPrice}
                      discountedPrice={relatedProduct.discountedPrice}
                    />
                  </div>
                ))}
              </div>

              {/* Scroll indicators (optional) */}
              <div className="flex justify-center mt-4 gap-2">
                {relatedProducts.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <p>No related products found in the same category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}