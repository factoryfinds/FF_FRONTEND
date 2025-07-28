// components/SharedCartComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getProductsFromUserCart, APIError } from '../../utlis/api';
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRouter } from "next/navigation";

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
}

export default function SharedCartComponent({ isDrawer = false, onClose }: SharedCartComponentProps) {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProductInCart = async () => {
      try {
        setLoadingProducts(true);
        setAuthError(false);
        const data = await getProductsFromUserCart();
        console.log("Cart Data:", data);
        setCart(data?.items ?? []);
      } catch (err) {
        console.error("failed to load products", err);
        // ✅ Properly handle different error types
        if (err instanceof APIError && err.code === "UNAUTHORIZED") {
          setAuthError(true);
        } else if (err instanceof Error && err.message === "UNAUTHORIZED") {
          setAuthError(true);
        } else {
          // Handle other types of errors
          console.error("Unexpected error:", err);
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductInCart();
  }, []);

  // ✅ Dynamic price calculation instead of hard-coded 1250
  const subTotal = cart.reduce((sum, item) => {
    const price = item.product?.discountedPrice || item.product?.originalPrice || 1250;
    return sum + (price * item.quantity);
  }, 0);
  
  const shippingCost = 150;
  const discount = 250;
  const total = subTotal + shippingCost - discount;

  // Helper function to get item price
  const getItemPrice = (item: CartItem): number => {
    return item.product?.discountedPrice || item.product?.originalPrice || 1250;
  };

  if (loadingProducts) {
    if (isDrawer) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-8 h-8 border-2 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
            </div>
            <p className="text-black text-sm font-extralight">Loading cart...</p>
          </div>
        </div>
      );
    }
    return <LoadingOverlay />;
  }

  // Auth error state - User not logged in
  if (authError) {
    return (
      <div className={`${isDrawer ? 'flex flex-col items-center justify-center h-full text-center px-4' : 'min-h-screen bg-white text-black flex items-center justify-center'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Please Login</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-sm">
            You need to be logged in to view your cart items
          </p>
          <div className={`${isDrawer ? 'space-y-2' : 'space-x-4'} ${isDrawer ? 'flex flex-col' : 'flex justify-center'}`}>
            {isDrawer && (
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            )}
            {!isDrawer && (
              <button
                onClick={() => router.push('/')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state for drawer
  if (isDrawer && cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-sm mb-4">Add some items to get started</p>
        <button
          onClick={onClose}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Empty cart state for full page
  if (!isDrawer && cart.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven&rsquo;t added any items to your cart yet</p>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDrawer ? 'flex flex-col h-full' : 'min-h-screen bg-white text-black p-4 sm:p-6'}`}>
      {!isDrawer && (
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Shopping Cart</h2>
      )}

      <div className={`${isDrawer ? 'flex flex-col h-full' : 'flex flex-col xl:flex-row gap-6 lg:gap-10'}`}>
        {/* 🛒 Cart Items List */}
        <div className={`${isDrawer ? 'flex-1 p-4 overflow-y-auto' : 'flex-1'}`}>
          {/* Desktop Header - Hidden on mobile and in drawer */}
          {!isDrawer && (
            <div className="hidden lg:grid grid-cols-3 font-semibold mb-4 px-2 sm:px-4">
              <p className="text-sm font-light">Item</p>
              <p className="text-sm font-light text-center">Quantity</p>
              <p className="text-sm font-light text-right">Sub-Total</p>
            </div>
          )}

          {/* Cart Items */}
          <div className={`${isDrawer ? 'space-y-3' : 'space-y-4 lg:space-y-0'}`}>
            {cart.map((item, index) => (
              <div key={item._id || index} className={`
                ${isDrawer
                  ? 'border border-gray-200 rounded-lg p-3'
                  : 'border border-gray-200 lg:border-t lg:border-x-0 lg:border-b-0 rounded-lg lg:rounded-none p-4 lg:px-2 lg:py-6'
                }
              `}>
                {/* Mobile/Drawer Layout */}
                <div className={`${isDrawer ? 'block' : 'block lg:hidden'}`}>
                  <div className="flex gap-3 mb-3">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.title}
                      className={`${isDrawer ? 'w-16 h-16' : 'w-20 h-20 sm:w-24 sm:h-24'} object-cover rounded-md flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'} font-semibold truncate`}>
                        {item.product?.title}
                      </h3>
                      <p className={`${isDrawer ? 'text-xs' : 'text-xs sm:text-sm'} text-gray-500`}>
                        Size: {item.size}
                      </p>
                      <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'} font-semibold mt-2`}>
                        ₹{getItemPrice(item) * item.quantity}.00
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button className={`${isDrawer ? 'w-6 h-6' : 'w-8 h-8'} border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-sm`}>
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                      <button className={`${isDrawer ? 'w-6 h-6' : 'w-8 h-8'} border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-sm`}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Only for full page */}
                {!isDrawer && (
                  <div className="hidden lg:grid grid-cols-3 gap-4 items-center">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.title}
                        className="w-24 h-24 xl:w-30 xl:h-30 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold truncate">{item.product?.title}</h3>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-center items-center gap-2">
                      <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                        −
                      </button>
                      <span className="min-w-[2rem] text-center">{item.quantity}</span>
                      <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right font-semibold">₹{getItemPrice(item) * item.quantity}.00</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Summary Panel */}
        <div className={`
          ${isDrawer
            ? 'border-t border-gray-200 p-4 bg-white'
            : 'w-full xl:w-1/3 xl:max-w-sm border border-gray-300 rounded-lg shadow-sm'
          }
        `}>
          <div className={`${isDrawer ? '' : 'p-6 sm:p-8 lg:p-12'}`}>
            {!isDrawer && (
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">Summary</h3>
            )}

            <div className={`${isDrawer ? 'space-y-2 mb-4' : 'space-y-3'}`}>
              <div className="flex justify-between py-1">
                <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'}`}>Sub-total:</p>
                <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'}`}>₹{subTotal}.00</p>
              </div>
              <div className="flex justify-between py-1">
                <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'}`}>Shipping cost:</p>
                <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'}`}>₹{shippingCost}.00</p>
              </div>
              <div className="flex justify-between py-1">
                <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'}`}>Discount:</p>
                <p className={`${isDrawer ? 'text-sm' : 'text-sm sm:text-base'}`}>-₹{discount}.00</p>
              </div>
              <div className={`flex justify-between font-bold py-3 border-t border-gray-200 ${isDrawer ? 'text-base' : 'text-base sm:text-lg'}`}>
                <p>Total:</p>
                <p>₹{total}.00</p>
              </div>
            </div>

            <div className={`${isDrawer ? 'space-y-2' : ''}`}>
              <button className={`w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors ${isDrawer ? 'text-sm' : 'text-sm sm:text-base mt-4 sm:mt-6'}`}>
                Check-Out
              </button>
              {isDrawer && (
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded hover:bg-gray-50 transition-colors text-sm"
                >
                  Continue Shopping
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}