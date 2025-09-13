"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { getProductsFromUserCart, removeFromCart, APIError } from "../../utlis/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { RefreshCcw } from "lucide-react";

// Types
type CartItem = {
  _id: string;
  quantity: number;
  size: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    originalPrice?: number;
    discountedPrice?: number;
  };
};

interface SharedCartComponentProps {
  isDrawer?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
}

// Utility: Loading Spinner - Updated to match luxury theme
const LoadingSpinner = memo(function LoadingSpinnerComponent({ size = "w-4 h-4" }: { size?: string }) {
  return (
    <div className={`${size} border border-black border-t-transparent rounded-full animate-spin`} />
  );
});

export default function SharedCartComponent({
  isDrawer = false,
  onClose,
  isOpen,
}: SharedCartComponentProps) {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authError, setAuthError] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const prevIsOpenRef = useRef(false);

  const getItemPrice = useCallback(
    (item: CartItem): number =>
      item.product?.discountedPrice || item.product?.originalPrice || 799,
    []
  );

  const fetchProductInCart = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoadingProducts(true);
      setAuthError(false);
      const data = await getProductsFromUserCart();
      setCart(data?.items ?? []);
    } catch (err) {
      if (err instanceof APIError && err.code === "UNAUTHORIZED") {
        setAuthError(true);
      }
    } finally {
      if (showLoading) setLoadingProducts(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProductInCart();
  }, [fetchProductInCart]);

  // Refresh when drawer opens
  useEffect(() => {
    if (isDrawer && isOpen && !prevIsOpenRef.current) {
      fetchProductInCart(false);
    }
    prevIsOpenRef.current = !!isOpen;
  }, [isOpen, isDrawer, fetchProductInCart]);

  // Auto-refresh every 30s in drawer
  useEffect(() => {
    if (!isDrawer || !isOpen) return;
    const intervalId = setInterval(() => fetchProductInCart(false), 30000);
    return () => clearInterval(intervalId);
  }, [isDrawer, isOpen, fetchProductInCart]);

  // Listen for cart update events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart-updated") {
        fetchProductInCart(false);
        localStorage.removeItem("cart-updated");
      }
    };
    const handleCartUpdate = () => fetchProductInCart(false);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [fetchProductInCart]);

  const handleRemoveItem = useCallback(async (productId: string, size: string) => {
    const itemKey = `${productId}-${size}`;
    try {
      setRemovingItems((prev) => new Set([...prev, itemKey]));
      const response = await removeFromCart(productId);
      if (response.cart) {
        setCart(response.cart);
      } else {
        setCart((prev) => prev.filter((item) => item.product._id !== productId));
      }
      toast.success("Item removed from cart");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch {
      toast.error("Failed to remove item from cart");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  }, []);

  const handleQuantityChange = useCallback((productId: string, size: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId && item.size === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  }, []);

  const handleCheckout = useCallback(() => {
    if (isDrawer && onClose) onClose();
    router.push("/checkout");
  }, [isDrawer, onClose, router]);

  // Price totals
  const bagTotal = cart.reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity || 1),
    0
  );
  const couponDiscount = 0;
  const grandTotal = bagTotal - couponDiscount;

  // Loading state
  if (loadingProducts) return <LoadingOverlay isVisible={loadingProducts} />;

  // Auth error
  if (authError)
    return (
      <EmptyState
        message="Please login to view your cart"
        actionLabel="Login"
        action={() => router.push("/login")}
        isDrawer={isDrawer}
      />
    );

  // Empty cart
  if (cart.length === 0)
    return (
      <EmptyState
        message="Your cart is empty"
        actionLabel="Continue Shopping"
        action={() => router.push("/product/allProducts")}
        isDrawer={isDrawer}
      />
    );

  return (
    <div className={isDrawer ? "h-full bg-white flex flex-col" : "min-h-screen bg-white"}>
      {/* Header - Responsive for both drawer and full screen */}
      <header className={`flex items-center justify-between border-b border-black ${
        isDrawer 
          ? "hidden px-4 py-4" 
          : "px-4 sm:px-6 lg:px-8 py-6"
      }`}>
        <div className="flex items-center">
          <p className={`text-xs font-light uppercase text-gray-800 tracking-[0.2em] ${
            isDrawer ? "hidden sm:block mr-2" : "mr-4"
          }`}>
            FactoryFinds
          </p>
          <h2 className={`font-semibold text-black tracking-tighter ${
            isDrawer ? "hidden text-sm" : "text-md"
          }`}>
            Your Cart
          </h2>
        </div>
        
        {!isDrawer && (
          <button
            onClick={() => fetchProductInCart(false)}
            className="text-xs text-gray-600 hover:text-black transition-colors duration-300 p-2 hover:bg-gray-100 uppercase tracking-[0.1em]"
            aria-label="Refresh Cart"
          >
            <RefreshCcw size={16} />
          </button>
        )}
      </header>

      {/* Cart Items - Responsive layout */}
      <div className={`flex-1 overflow-y-auto divide-y divide-gray-100 ${
        isDrawer 
          ? "max-h-[calc(100vh-200px)] px-3" 
          : "max-h-[calc(100vh-250px)] px-4 sm:px-6 lg:px-8"
      }`}>
        {cart.map((item) => {
          if (!item?.product || !item.product._id) {
            console.warn("Cart item missing product data:", item);
            return null;
          }

          const itemKey = `${item.product._id}-${item.size}`;
          const isRemoving = removingItems.has(itemKey);

          return (
            <div key={itemKey} className={`flex gap-4 items-start ${
              isDrawer ? "py-4" : "py-6 sm:py-8 sm:gap-6"
            }`}>
              {/* Product Image - Responsive sizing */}
              <div className={`bg-gray-100 overflow-hidden flex-shrink-0 ${
                isDrawer 
                  ? "w-20 h-26" 
                  : "w-20 h-24 sm:w-24 sm:h-32"
              }`}>
                <img
                  src={item.product.images?.[0] || "/placeholder.png"}
                  alt={item.product.title || "Product"}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Product Info - Responsive typography */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-black tracking-tight leading-tight ${
                  isDrawer ? "text-xs mb-1" : "text-sm mb-2"
                }`}>
                  {item.product.title}
                </h3>
                
                <div className={`flex items-center gap-2 text-gray-600 uppercase tracking-[0.1em] ${
                  isDrawer ? "text-[10px] mb-2" : "text-xs mb-3 sm:mb-4 gap-3"
                }`}>
                  <span>Size: {item.size}</span>
                  <span className="text-gray-300">|</span>
                  <span>Color: Black</span>
                </div>

                {/* Price - Responsive */}
                <div className={isDrawer ? "mb-2" : "mb-3 sm:mb-4"}>
                  <span className={`font-medium text-gray-800 tracking-wide ${
                    isDrawer ? "text-xs" : "text-sm"
                  }`}>
                    ₹{(getItemPrice(item) * item.quantity).toLocaleString()}
                  </span>
                  
                </div>

                {/* Bottom row - Responsive layout */}
                <div className={`flex items-center ${
                  isDrawer 
                    ? "flex-col gap-2 items-start" 
                    : "justify-between sm:flex-row flex-col gap-3 sm:gap-6"
                }`}>
                  {/* Quantity and Actions */}
                  <div className={`flex items-center gap-3 ${
                    isDrawer ? "w-full justify-between" : "sm:gap-6"
                  }`}>
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <label className={`font-medium text-black uppercase tracking-[0.15em] ${
                        isDrawer ? "text-[10px]" : "text-xs"
                      }`}>
                        Qty:
                      </label>
                      <div className="relative">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.product._id, item.size, +e.target.value)
                          }
                          className={`bg-transparent border border-gray-300 px-2 py-1 pr-6 font-light hover:border-black transition-colors duration-300 appearance-none cursor-pointer ${
                            isDrawer ? "text-[10px]" : "text-xs"
                          }`}
                        >
                          {[...Array(10).keys()].map((n) => (
                            <option key={n + 1} value={n + 1}>{n + 1}</option>
                          ))}
                        </select>
                        <ChevronDown 
                          size={isDrawer ? 12 : 14} 
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      
                      
                      <button
                        onClick={() => handleRemoveItem(item.product._id, item.size)}
                        disabled={isRemoving}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-300 p-1 hover:bg-red-50 rounded"
                      >
                        {isRemoving ? (
                          <LoadingSpinner size="w-3 h-3" />
                        ) : (
                          <Trash2 size={isDrawer ? 14 : 16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary - Responsive layout */}
      <div className={`border-t border-black bg-white sticky bottom-0 ${
        isDrawer 
          ? "px-4 py-4" 
          : "px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      }`}>
        <div className={isDrawer ? "w-full" : "max-w-md ml-auto"}>
          <h3 className={`font-medium text-black uppercase tracking-[0.15em] text-center ${
            isDrawer ? "text-[11px] mb-4" : "text-xs mb-6"
          }`}>
            Price Details
          </h3>
          
          <div className={`space-y-3 ${isDrawer ? "text-xs" : "text-sm space-y-4"}`}>
            <div className="flex justify-between items-center">
              <span className="font-light text-gray-800 tracking-wide">Bag Total</span>
              <span className="font-medium text-gray-800 tracking-wide">
                ₹{bagTotal.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-light text-gray-800 tracking-wide">Coupon Discount</span>
              <span className="font-medium text-green-600 tracking-wide">
                - ₹{couponDiscount.toLocaleString()}
              </span>
            </div>
            
            <hr className="border-black border-t-[1px] my-3" />
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-black tracking-wide">Grand Total</span>
              <span className="font-semibold text-black tracking-wide">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
          
          <button
            className={`w-full bg-black text-white font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 ${
              isDrawer 
                ? "py-3 mt-4 text-[11px]" 
                : "py-4 mt-6 text-xs"
            }`}
            onClick={handleCheckout}
          >
            Pay ₹{grandTotal.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

// Empty state - Responsive design
const EmptyState = ({ 
  message, 
  actionLabel, 
  action,
  isDrawer = false
}: { 
  message: string; 
  actionLabel: string; 
  action: () => void;
  isDrawer?: boolean;
}) => (
  <div className={`flex items-center justify-center bg-white ${
    isDrawer ? "h-full" : "min-h-[60vh]"
  }`}>
    <div className={`text-center ${isDrawer ? "px-4" : "px-6"}`}>
      <p className={`font-light text-gray-600 uppercase tracking-[0.1em] leading-relaxed ${
        isDrawer ? "text-xs mb-6" : "text-sm mb-8"
      }`}>
        {message}
      </p>
      <button 
        onClick={action} 
        className={`bg-black text-white font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 ${
          isDrawer 
            ? "px-6 py-3 text-[11px]" 
            : "px-8 py-4 text-xs"
        }`}
      >
        {actionLabel}
      </button>
    </div>
  </div>
);