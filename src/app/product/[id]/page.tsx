"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "../../../components/RelatedProductsCard";
import { addProductToCart, getAllProducts, Product } from '../../../../utlis/api';
import LoadingOverlay from "@/components/LoadingOverlay";
import { useSwipeable } from "react-swipeable";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Define size types to fix TypeScript errors
interface SizeObject {
  size: string;
  stock: number;
}

type SizeItem = string | SizeObject;

// Extend the Product type to include proper size typing
interface ProductWithSizes extends Omit<Product, 'sizes'> {
  sizes: SizeItem[];
}

// Define the custom popup message interface
interface PopupMessage {
  type: 'success' | 'error';
  message: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithSizes | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState({ x: 50, y: 50, active: false });
  const [showSizes, setShowSizes] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isMobileFullScreen, setIsMobileFullScreen] = useState(false);
  const [popupMessage, setPopupMessage] = useState<PopupMessage | null>(null);

  const clickTrackedRef = useRef(false);

  // Helper function to get size value from size item
  const getSizeValue = (sizeItem: SizeItem): string => {
    return typeof sizeItem === 'string' ? sizeItem : sizeItem.size;
  };

  // Helper function to get stock for a size item
  const getSizeStock = (sizeItem: SizeItem, fallbackInventory: number): number => {
    return typeof sizeItem === 'string' ? fallbackInventory : sizeItem.stock;
  };

  // Helper function to find size object
  const findSizeObject = (sizes: SizeItem[], targetSize: string): SizeItem | undefined => {
    return sizes.find(s => getSizeValue(s) === targetSize);
  };

  // Dummy size guide data
  const sizeGuideData = {
    men: [
      { size: 'XS', chest: '36', waist: '30', length: '26' },
      { size: 'S', chest: '38', waist: '32', length: '27' },
      { size: 'M', chest: '40', waist: '34', length: '28' },
      { size: 'L', chest: '42', waist: '36', length: '29' },
      { size: 'XL', chest: '44', waist: '38', length: '30' },
      { size: 'XXL', chest: '46', waist: '40', length: '31' },
    ],
  };

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle custom popup visibility
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoadingProducts(true);
        clickTrackedRef.current = false;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ff-backend-00ri.onrender.com';
        const res = await fetch(`${apiUrl}/api/products/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product`);
        const data = await res.json();
        if (!data) throw new Error('Product not found');
        setProduct(data as ProductWithSizes);

        // Set default size
        if (data.sizes?.length > 0) {
          const firstSize = getSizeValue(data.sizes[0]);
          setSelectedSize(firstSize);
        }
      } catch (err) {
        setPopupMessage({ type: 'error', message: 'Failed to load product details.' });
        console.log(err);

      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Track click
  useEffect(() => {
    const trackProductClick = async (productId: string) => {
      if (clickTrackedRef.current) return;
      try {
        clickTrackedRef.current = true;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ff-backend-00ri.onrender.com';
        await fetch(`${apiUrl}/api/products/${productId}/track-click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch {
        clickTrackedRef.current = false;
      }
    };
    if (id && product && !clickTrackedRef.current) {
      trackProductClick(id as string);
    }
  }, [id, product]);

  // Related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      try {
        setLoadingRelated(true);
        const allProducts = await getAllProducts();
        const filtered = allProducts
          .filter(p => p._id !== product._id && p.category === product.category && p.gender === product.gender && p.inStock && !p.isDeleted)
          .slice(0, 6);
        setRelatedProducts(filtered);
      } catch {
        setPopupMessage({ type: 'error', message: 'Failed to load related products.' });
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelatedProducts();
  }, [product]);

  // Fixed swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (product?.images) {
        setCurrentImageIndex((prev) =>
          prev < product.images.length - 1 ? prev + 1 : 0
        );
      }
    },
    onSwipedRight: () => {
      if (product?.images) {
        setCurrentImageIndex((prev) =>
          prev > 0 ? prev - 1 : product.images.length - 1
        );
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (loadingProducts || addingToCart || buyingNow) return <LoadingOverlay isVisible={loadingProducts || addingToCart || buyingNow} />;
  if (!product) return <LoadingOverlay isVisible={loadingProducts} />;

  const handleQuantityChange = (change: number) => {
    if (!selectedSize) return;

    const selectedSizeObj = findSizeObject(product.sizes, selectedSize);

    const maxQuantity = selectedSizeObj
      ? getSizeStock(selectedSizeObj, product.inventory)
      : product.inventory;

    setQuantity(prev => Math.max(1, Math.min(prev + change, maxQuantity)));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      return setPopupMessage({ type: 'error', message: "Please select a size before adding to cart." });
    }
    try {
      setAddingToCart(true);
      await addProductToCart({ productId: product._id, quantity, size: selectedSize });
      setPopupMessage({ type: 'success', message: "Added to cart!" });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      localStorage.setItem('cart-updated', Date.now().toString());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      setPopupMessage({ type: 'error', message: errorMessage });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      return setPopupMessage({ type: 'error', message: "Please select a size before proceeding to checkout." });
    }
    try {
      setBuyingNow(true);
      await addProductToCart({ productId: product._id, quantity, size: selectedSize });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      localStorage.setItem('cart-updated', Date.now().toString());
      router.push('/checkout');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to proceed to checkout';
      setPopupMessage({ type: 'error', message: errorMessage });
    } finally {
      setBuyingNow(false);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const selectedSizeObj = findSizeObject(product.sizes, selectedSize || "");
  const availableStock = selectedSizeObj ? getSizeStock(selectedSizeObj, product.inventory) : product.inventory;
  const isSelectedSizeAvailable = availableStock > 0;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Custom Popup */}
      {popupMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-white transition-opacity duration-300
          ${popupMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          ${popupMessage ? 'opacity-100' : 'opacity-0'}`}
        >
          {popupMessage.message}
        </div>
      )}

      {/* MOBILE FULL SCREEN VIEWER */}
      {isMobileFullScreen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <button
            className="absolute top-6 right-6 text-black text-4xl z-50"
            onClick={() => setIsMobileFullScreen(false)}
          >
            <FiX size={18} className="text-black" />
          </button>

          <div
            {...swipeHandlers}
            className="relative flex items-center justify-center w-full h-full"
          >
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
              pinch={{ step: 5 }}
              doubleClick={{ disabled: false }}
              limitToBounds={false}
              centerZoomedOut={true}
              panning={{ disabled: false }}
            >
              <TransformComponent
                wrapperClass="w-full h-full"
                contentClass="w-full h-full flex items-center justify-center"
                wrapperStyle={{
                  width: "100vw",
                  height: "100vh",
                  overflow: "visible"
                }}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="max-w-[100vw] max-h-[100vh] object-contain"
                  style={{
                    width: "auto",
                    height: "auto"
                  }}
                />
              </TransformComponent>
            </TransformWrapper>

            <button
              className="absolute left-6 text-white text-5xl "
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : product.images.length - 1
                )
              }
            >
              <FiChevronLeft size={24} className="text-black" />
            </button>

            <button
              className="absolute right-6  text-white text-5xl"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < product.images.length - 1 ? prev + 1 : 0
                )
              }
            >
              <FiChevronRight size={24} className="text-black" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-6/10">
            <div
              {...swipeHandlers}
              className="w-full aspect-square bg-gray-100 mb-3 overflow-hidden rounded-xl cursor-crosshair relative"
              onMouseMove={(e) => {
                if (!isMobile) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setIsZoomed({ x, y, active: true });
                }
              }}
              onMouseEnter={() => !isMobile && setIsZoomed({ x: 50, y: 50, active: true })}
              onMouseLeave={() => !isMobile && setIsZoomed({ x: 50, y: 50, active: false })}
              onClick={() => {
                if (isMobile) setIsMobileFullScreen(true);
              }}
            >
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed.active && !isMobile ? "scale-200" : "scale-100"}`}
                style={{ transformOrigin: `${isZoomed.x}% ${isZoomed.y}%` }}
              />

              {isMobile && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-gray-400"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div
              className="
                hidden sm:grid sm:grid-cols-4 lg:grid-cols-2 gap-3 
                sm:mt-3
            "
            >
              {product.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square overflow-hidden rounded-lg border-2 cursor-pointer ${index === currentImageIndex
                      ? "border-black"
                      : "border-transparent hover:border-gray-400"
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Mobile thumbnails - horizontal scroll */}
            <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border-2 cursor-pointer ${index === currentImageIndex
                      ? "border-black"
                      : "border-transparent hover:border-gray-400"
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index}`}
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
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-5 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-0">
                <span className="text-lg sm:text-xl font-normal text-black">
                  ₹ {product.discountedPrice.toLocaleString()}.00
                </span>
                {product.originalPrice !== product.discountedPrice && (
                  <span className="text-base sm:text-lg font-light text-gray-500 line-through">
                    ₹ {product.originalPrice.toLocaleString()}.00
                  </span>
                )}
              </div>
              <p className="text-xs font-normal text-gray-800">(M.R.P. incl of all taxes)</p>
            </div>

            {/* Select Your Size with Size Guide */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => setShowSizes(!showSizes)}
                  className="cursor-pointer flex items-center justify-between flex-1"
                >
                  <p className="text-base sm:text-lg font-bold text-black mt-4 sm:mt-8">Select Your Size</p>
                  <svg
                    className={`w-5 h-5 mt-6 sm:mt-10 ml-2 transform transition-transform duration-300 ${showSizes ? "rotate-180" : "rotate-0"}`}
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
              </div>

              <hr className="mt-2 border-black mb-4 border-t-[3px]" />

              {showSizes && (
                <div className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out">
                  {product.sizes.map((sizeItem, index) => {
                    const sizeValue = getSizeValue(sizeItem);
                    const sizeStock = getSizeStock(sizeItem, product.inventory);

                    return (
                      <button
                        key={`${sizeValue}-${index}`}
                        onClick={() => setSelectedSize(sizeValue)}
                        className={`px-4 py-2 border text-sm ${selectedSize === sizeValue
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-black hover:border-black"
                          } ${sizeStock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={addingToCart || buyingNow || sizeStock === 0}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
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
                  disabled={quantity <= 1 || addingToCart || buyingNow}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-black disabled:opacity-50"
                  disabled={quantity >= availableStock || addingToCart || buyingNow}
                >
                  +
                </button>
              </div>

            </div>
            {/* Size Guide Button */}
            <button
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-sm text-black underline hover:no-underline mt-4 mb-4 sm:mt-8"
            >
              Size Guide
            </button>
            {/* Size Guide Table */}
            {showSizeGuide && (
              <div className="mb-6 p-4 border border-gray-100 rounded-lg bg-white z-40 shadow-lg">
                <h3 className="text-lg font-medium text-black mb-4">Size Guide (in inches)</h3>

                {/* Size Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-3 font-medium">Size</th>
                        <th className="text-left py-2 px-3 font-medium">Chest</th>
                        <th className="text-left py-2 px-3 font-medium">Waist</th>
                        <th className="text-left py-2 px-3 font-medium">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData.men.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-white">
                          <td className="py-2 px-3 font-medium">{item.size}</td>
                          <td className="py-2 px-3">{item.chest}&quot;</td>
                          <td className="py-2 px-3">{item.waist}&quot;</td>
                          <td className="py-2 px-3">{item.length}&quot;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-600">
                  <p className="mb-1">• Measurements are in inches</p>
                  <p className="mb-1">• For best fit, compare with a similar garment you own</p>
                  <p>• Contact us if you need help choosing the right size</p>
                </div>
              </div>
            )}

            {/* Inventory display */}
            <div className="text-sm text-gray-600 mt-8 sm:mt-15">
              {!selectedSize ? (
                <span>Please select a size</span>
              ) : isSelectedSizeAvailable ? (
                <span>{availableStock} items available in size {selectedSize}</span>
              ) : (
                <span className="text-red-500">Size {selectedSize} is out of stock</span>
              )}
            </div>

            {/* Action Section */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-2 mb-12 sm:mb-18">
              <button
                className="flex-1 bg-black text-white py-3 px-6 text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={buyingNow || !selectedSize || !isSelectedSizeAvailable}
                onClick={handleBuyNow}
              >
                {buyingNow ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Buy Now"
                )}
              </button>
              <button
                className="flex-1 border border-black text-black py-3 px-6 text-sm font-medium rounded-xl cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !isSelectedSizeAvailable}
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