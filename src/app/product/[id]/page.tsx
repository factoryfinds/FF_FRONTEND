"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "../../../components/RelatedProductsCard";
import { addProductToCart, getAllProducts, Product } from '../../../../utlis/api';
import LoadingOverlay from "@/components/LoadingOverlay";
import { useSwipeable } from "react-swipeable";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from 'next/image';
import LoginDrawer from "@/components/LoginDrawer";

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
// helper - paste above your JSX or in a utils file
// helper - parse only the 3 required sections
function parseProductDescription(text: string | undefined) {
  if (!text) return [];

  const LABELS = ["DESCRIPTION", "MATERIAL", "CARE", "DETAILS", "SHIPPING", "NOTE", "SIZE", "FEATURE", "SPECIFICATION"];

  const pattern = new RegExp(`(^|\\n)(${LABELS.join("|")})\\s*:?`, "ig");

  const matches: { label: string; index: number; matchLen: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    matches.push({
      label: m[2].toUpperCase(),
      index: m.index,
      matchLen: m[0].length,
    });
  }

  const sections: { label: string; value: string }[] = [];
  if (matches.length) {
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i].matchLen;
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const value = text.slice(start, end).trim();
      sections.push({ label: matches[i].label, value });
    }
    return sections;
  }

  return [{ label: "DESCRIPTION", value: text }];
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
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false); // for login drawer

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

  // Luxury size guide data with refined styling
  const sizeGuideData = {
    men: [
      { size: 'S', chest: '41.5', shoulder: '18', length: '25' },
      { size: 'M', chest: '44', shoulder: '20', length: '26' },
      { size: 'L', chest: '46.5', shoulder: '22', length: '27' },
      { size: 'XL', chest: '49', shoulder: '24', length: '28' },
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
        setPopupMessage({ type: 'error', message: 'FAILED TO LOAD PRODUCT DETAILS' });
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
        setPopupMessage({ type: 'error', message: 'FAILED TO LOAD RELATED PRODUCTS' });
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
      return setPopupMessage({ type: 'error', message: "PLEASE SELECT A SIZE BEFORE ADDING TO CART" });
    }
    try {
      setAddingToCart(true);
      await addProductToCart({ productId: product._id, quantity, size: selectedSize });

      // Fire Facebook Pixel AddToCart event
      if ((window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          content_ids: [product._id],
          content_type: 'product',
          value: product.discountedPrice,
          currency: 'INR',
        });
      }



      setPopupMessage({ type: 'success', message: "ADDED TO CART" });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      localStorage.setItem('cart-updated', Date.now().toString());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message.toUpperCase() : 'FAILED TO ADD ITEM TO CART';
      if (errorMessage === 'AUTHENTICATION REQUIRED') {
        setIsLoginDrawerOpen(true);
        return; // Don't show the error popup, just open login drawer
      }
      setPopupMessage({ type: 'error', message: errorMessage });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      return setPopupMessage({ type: 'error', message: "PLEASE SELECT A SIZE BEFORE PROCEEDING TO CHECKOUT" });
    }
    try {
      setBuyingNow(true);
      await addProductToCart({ productId: product._id, quantity, size: selectedSize });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      localStorage.setItem('cart-updated', Date.now().toString());
      router.push('/checkout');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message.toUpperCase() : 'FAILED TO PROCEED TO CHECKOUT';
      if (errorMessage === 'AUTHENTICATION REQUIRED') {
        setIsLoginDrawerOpen(true);
        return; // Don't show the error popup, just open login drawer
      }
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
      {/* Custom Popup - Luxury styling */}
      {popupMessage && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 text-white transition-all duration-500 font-light tracking-widest text-xs uppercase
          ${popupMessage.type === 'success' ? 'bg-black' : 'bg-red-600'}
          ${popupMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          {popupMessage.message}
        </div>
      )}

      {/* MOBILE FULL SCREEN VIEWER */}
      {isMobileFullScreen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <button
            className="absolute top-8 right-8 text-black hover:text-gray-600 transition-colors z-50"
            onClick={() => setIsMobileFullScreen(false)}
          >
            <FiX size={20} />
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
                <div className="relative w-screen h-screen flex items-center justify-center">
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    priority
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: "contain",
                      transformOrigin: `${isZoomed.x}% ${isZoomed.y}%`
                    }}
                    className={`${isZoomed.active && !isMobile ? "scale-200 transition-transform duration-300" : "scale-100 transition-transform duration-300"}`}
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>

            <button
              className="absolute left-8 text-black hover:text-gray-600 transition-colors"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : product.images.length - 1
                )
              }
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              className="absolute right-8 text-black hover:text-gray-600 transition-colors"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < product.images.length - 1 ? prev + 1 : 0
                )
              }
            >
              <FiChevronRight size={24} />
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
              className="w-full aspect-square mb-4 overflow-hidden cursor-crosshair relative transition-all duration-300 "
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
              <div className="aspect-square overflow-hidden cursor-pointer">
                <div className="relative w-full h-full">
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={`${product.title} ${currentImageIndex}`}
                    fill
                    sizes="2048px"
                    style={{
                      objectFit: 'cover',
                      transformOrigin: `${isZoomed.x}% ${isZoomed.y}%`,
                      transform: isZoomed.active && !isMobile ? 'scale(1.5)' : 'scale(1)'
                    }}
                    className="transition-transform duration-300 ease-out"
                  />
                </div>
              </div>

              {isMobile && product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-black" : "bg-gray-400"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails - Luxury styling */}
            <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:mt-4">
              {product.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square overflow-hidden cursor-pointer transition-all duration-300  ${index === currentImageIndex
                    ? "border-black opacity-100"
                    : "border-gray-200 hover:border-gray-400 opacity-100 hover:opacity-100"
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Mobile thumbnails */}
            <div className="flex sm:hidden gap-2 mt-4 overflow-x-auto scrollbar-hide">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-300 border ${index === currentImageIndex
                    ? "border-black opacity-100"
                    : "border-gray-200 opacity-80"
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

          {/* Right Side: Product Details - Luxury typography */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-16 px-4 lg:pl-24 lg:pr-16">
            {/* Brand Name - Refined */}
            <div className="flex items-center mb-3">
              <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
              <svg
                className="w-4 h-4 text-gray-400 ml-auto cursor-pointer hover:text-red-500 transition-colors duration-300"
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

            {/* Product Title - More refined */}
            <h1 className="text-md sm:text-md font-semibold text-black mb-6 leading-tight tracking-tighter">
              {product.title}
            </h1>

            {/* Price - Luxury styling */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-1">
                <span className="text-base sm:text-lg font-medium text-gray-800 tracking-wide">
                  ₹{product.discountedPrice.toLocaleString()}
                </span>
                <span className="text-sm font-light text-gray-400 line-through tracking-wide">
                  {product.originalPrice !== product.discountedPrice ? `₹${product.originalPrice.toLocaleString()}` : ''}
                </span>
              </div>
              <p className="text-xs font-light text-gray-700 uppercase tracking-widest">incl. all taxes</p>
            </div>

            {/* Select Your Size - Refined */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div
                  onClick={() => setShowSizes(!showSizes)}
                  className="cursor-pointer flex items-center justify-between flex-1"
                >
                  <p className="text-xs font-medium text-black uppercase tracking-[0.15em]">Select Size</p>
                  <svg
                    className={`w-3 h-3 ml-2 transform transition-transform duration-300 ${showSizes ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <hr className="mb-6 border-black border-t-[1px]" />

              {showSizes && (
                <div className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out mb-4">
                  {product.sizes.map((sizeItem, index) => {
                    const sizeValue = getSizeValue(sizeItem);
                    const sizeStock = getSizeStock(sizeItem, product.inventory);

                    return (
                      <button
                        key={`${sizeValue}-${index}`}
                        onClick={() => setSelectedSize(sizeValue)}
                        className={`px-4 py-2 border text-xs font-light uppercase tracking-wider transition-all duration-300 ${selectedSize === sizeValue
                          ? "border-black bg-black text-white"
                          : "border-gray-400 text-black hover:border-black hover:bg-gray-100"
                          } ${sizeStock === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
                        disabled={addingToCart || buyingNow || sizeStock === 0}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity Selector - Refined */}
            <div className="mb-6">
              <p className="text-xs font-medium text-black uppercase tracking-[0.15em] mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors duration-300 disabled:opacity-30"
                  disabled={quantity <= 1 || addingToCart || buyingNow}
                >
                  <span className="text-xs font-light">−</span>
                </button>
                <span className="text-sm font-light tracking-wide min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors duration-300 disabled:opacity-30"
                  disabled={quantity >= availableStock || addingToCart || buyingNow}
                >
                  <span className="text-xs font-light">+</span>
                </button>
              </div>
            </div>

            {/* Size Guide Button - Luxury styling */}
            <button
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-xs text-black underline hover:no-underline mb-6 font-light uppercase tracking-[0.1em] transition-all duration-300"
            >
              Size Guide
            </button>

            {/* Size Guide Table - Refined */}
            {showSizeGuide && (
              <div className="mb-8 p-6 border border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-black uppercase mb-6 tracking-[0.15em]">Size Guide</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-3 font-medium uppercase tracking-wider">Size</th>
                        <th className="text-left py-3 font-medium uppercase tracking-wider">Chest</th>
                        <th className="text-left py-3 font-medium uppercase tracking-wider">Shoulder</th>
                        <th className="text-left py-3 font-medium uppercase tracking-wider">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData.men.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 font-medium">{item.size}</td>
                          <td className="py-3 font-light">{item.chest}&quot;</td>
                          <td className="py-3 font-light">{item.shoulder}&quot;</td>
                          <td className="py-3 font-light">{item.length}&quot;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 text-xs text-gray-600 font-light space-y-1 uppercase tracking-wide">
                  <p>• Measurements in inches</p>
                  <p>• Compare with similar garment</p>
                  <p>• Contact for sizing assistance</p>
                </div>
              </div>
            )}

            {/* Inventory display - Refined */}
            <div className="text-xs text-gray-500 mb-8 font-light uppercase tracking-wide">
              {!selectedSize ? (
                <span>Please select size</span>
              ) : isSelectedSizeAvailable ? (
                <span>{availableStock} available in size {selectedSize}</span>
              ) : (
                <span className="text-red-500">Size {selectedSize} unavailable</span>
              )}
            </div>

            {/* Action Section - Luxury buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <button
                className="flex-1 bg-black text-white py-4 px-8 text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-30 flex items-center justify-center"
                disabled={buyingNow || !selectedSize || !isSelectedSizeAvailable}
                onClick={handleBuyNow}
              >
                {buyingNow ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Buy Now"
                )}
              </button>
              <button
                className="flex-1 border border-black text-black py-4 px-8 text-xs font-light uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !isSelectedSizeAvailable}
              >
                {addingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding</span>
                  </div>
                ) : (
                  "Add To Cart"
                )}
              </button>
            </div>

            {/* Questions Section - Refined */}
            {/* Location indicator - Refined */}
            <div className="mt-8">
              <p className="text-xs uppercase font-black text-black mb-5 tracking-[0.15em]">made  in India | made for Indians</p>
            </div>

            <div className="mb-8">
              <p className="text-xs uppercase text-black font-light tracking-[0.1em] leading-relaxed">
                Questions? Our team is available to assist with your selection.
              </p>
            </div>

            {/* Product Description - Luxury typography */}
            {/* Replace description rendering with this */}
            <div className="text-sm text-gray-900 font-light leading-relaxed tracking-wide">
              {product.description && (() => {
                const sections = parseProductDescription(product.description);

                return (
                  <div className="space-y-8">
                    {sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start"
                      >
                        {/* Label column */}
                        {sec.label && (
                          <div className="sm:col-span-3 font-bold text-black uppercase tracking-wide text-[13px] pt-1">
                            {sec.label}
                          </div>
                        )}

                        {/* Value column */}
                        <div className="sm:col-span-9 text-gray-900 font-normal text-[13px] leading-relaxed">
                          {sec.value.split(/\n+/).map((line, i) => (
                            <p key={i} className="mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>



          </div>
        </div>

        {/* Related Products Section - Refined */}
        <div className="mt-16 mb-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-black text-black mb-8 uppercase tracking-[0.15em]">Related Products</h2>

          <div className="min-h-[360px]">
            {loadingRelated ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-4 h-4 border border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 text-xs uppercase tracking-wide">Loading</span>
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="relative">
                <div
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
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
                    <div key={relatedProduct._id} className="flex-shrink-0 w-[240px] sm:w-[280px]">
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
      {/* Add this LoginDrawer component in your JSX */}
      <LoginDrawer
        isOpen={isLoginDrawerOpen}
        onClose={() => setIsLoginDrawerOpen(false)}
      />
    </div>
  );
}