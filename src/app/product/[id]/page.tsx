"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/RelatedProductsCard"; // Import your ProductCard component
import { addProductToCart } from '../../../../utlis/api';
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<{
    _id: string;
    title: string;
    description: string;
    category: string;
    gender: string;
    originalPrice: number;
    discountedPrice: number;
    images: string[];
    sizes: string[];
    colors: { name: string; hex: string; _id: string }[];
    inventory: number;
    inStock: boolean;
    clickCount: number;
    addedToCartCount: number;
    purchaseCount: number;
    lastPurchasedAt: string | null;
    createdBy: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false); // New loading state for add to cart
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState({ x: 50, y: 50, active: false });
  const [showSizes, setShowSizes] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoadingProducts(true);

        const res = await fetch(`https://ff-backend-00ri.onrender.com/api/products/${id}`);

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
  
  // Show loading overlay when fetching product data OR adding to cart
  if(loadingProducts || addingToCart) return <LoadingOverlay/>
  if (!product) return <LoadingOverlay />;

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, product.inventory)));
  };

  // const handleNextImage = () => {
  //   setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  // };

  // const handlePrevImage = () => {
  //   setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  // };

  const handleAddToCart = async () => {
    // Validation check
    if (!selectedSize) {
      return toast.error("Please select both size and color before adding to cart.");
    }

    try {
      setAddingToCart(true); // Start loading

      const response = await addProductToCart({
        productId: product._id,
        quantity: quantity, // Use the actual quantity state
        size: selectedSize
      });

      console.log("Cart updated:", response.cart);
      toast.success("Added to cart!");
      
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false); // Stop loading
    }
  };

  // Mock related products data (replace with actual API call) -> logic will be to filter the products with same category and gender
  const relatedProducts = [
    {
      _id: "1",
      title: "Title-Category (Example: t shirt, t-shirt, jacket)",
      originalPrice: 109000,
      discountedPrice: 89000,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]
    },
    {
      _id: "2",
      title: "Title-Category (Example: t shirt, t-shirt, jacket)",
      originalPrice: 109000,
      discountedPrice: 89000,
      images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]
    },
    {
      _id: "3",
      title: "Title-Category (Example: t shirt, t-shirt, jacket)",
      originalPrice: 109000,
      discountedPrice: 89000,
      images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]
    },
  ];

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
                      disabled={addingToCart} // Disable during loading
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
              // ✅ Show buttons only if product is in stock
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
              // ❌ Show out-of-stock notice if product.inventory === 0
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                _id={relatedProduct._id}
                title={relatedProduct.title}
                images={relatedProduct.images}
                originalPrice={relatedProduct.originalPrice}
                discountedPrice={relatedProduct.discountedPrice}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}