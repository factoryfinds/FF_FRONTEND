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

// Utility: Loading Spinner
const LoadingSpinner = memo(function LoadingSpinnerComponent({ size = "w-4 h-4" }: { size?: string }) {
  return (
    <div className={`${size} border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin`} />
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
  if (loadingProducts) return <LoadingOverlay />;

  // Auth error
  if (authError)
    return (
      <EmptyState
        message="Please login to view your cart"
        actionLabel="Login"
        action={() => router.push("/login")}
      />
    );

  // Empty cart
  if (cart.length === 0)
    return (
      <EmptyState
        message="Your cart is empty"
        actionLabel="Continue Shopping"
        action={() => router.push("/product/allProducts")}
      />
    );

  return (
    <div className={isDrawer ? "h-full bg-white flex flex-col" : "min-h-screen bg-white"}>
      {!isDrawer && (
        <header className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={() => fetchProductInCart(false)}
            className="text-sm text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Refresh Cart"
          >
            <RefreshCcw size={16} />
          </button>
        </header>
      )}

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-[calc(100vh-250px)]">

        {cart.map((item) => {
          if (!item?.product || !item.product._id) {
            console.warn("Cart item missing product data:", item);
            return null;
          }

          const itemKey = `${item.product._id}-${item.size}`;
          const isRemoving = removingItems.has(itemKey);

          return (
            <div key={itemKey} className="flex gap-4 p-4 items-start">
              {/* Product Image */}
              <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images?.[0] || "/placeholder.png"}
                  alt={item.product.title || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.product.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{item.size}</span> | <span>Black</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-xs">Qty:</label>
                  <div className="relative">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.product._id, item.size, +e.target.value)
                      }
                      className="bg-transparent pr-5 text-sm"
                    >
                      {[...Array(10).keys()].map((n) => (
                        <option key={n + 1}>{n + 1}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveItem(item.product._id, item.size)}
                    disabled={isRemoving}
                    className="ml-auto hover:bg-red-50 p-1 rounded"
                  >
                    {isRemoving ? <LoadingSpinner /> : <Trash2 size={16} className="text-gray-400 hover:text-red-500" />}
                  </button>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center mt-3">
                  <button className="text-xs text-gray-500 border-b border-gray-300 hover:text-gray-800">
                    Move to Wishlist
                  </button>
                  <span className="font-semibold text-sm">
                    ₹{(getItemPrice(item) * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary */}
      <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0">
        <h3 className="text-sm font-semibold mb-4 text-center">Price Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Bag Total</span>
            <span>₹{bagTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Coupon Discount</span>
            <span className="text-green-600">- ₹{couponDiscount}</span>
          </div>
          <div className="flex justify-between font-semibold border-t-3 pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
        <button
          className="w-full bg-black text-white py-4 mt-4  rounded hover:bg-gray-800"
          onClick={handleCheckout}
        >
          Pay ₹{grandTotal.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

// Empty state reusable component
const EmptyState = ({ message, actionLabel, action }: { message: string; actionLabel: string; action: () => void }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <p className="text-gray-600 mb-4">{message}</p>
      <button onClick={action} className="bg-black text-white px-6 py-2 rounded">
        {actionLabel}
      </button>
    </div>
  </div>
);
