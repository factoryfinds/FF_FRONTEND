// components/CheckoutTray.tsx
"use client";

import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import CartDrawer from '@/components/CartDrawer';
import SharedCartComponent from '@/components/SharedCartComponent';

const CheckoutFloatingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 z-40"
        aria-label="Open cart"
      >
        <FiShoppingCart size={24} />
      </button>

      {/* Side Drawer */}
      <CartDrawer isOpen={open} onClose={() => setOpen(false)}>
        <SharedCartComponent isDrawer={true} onClose={() => setOpen(false)} />
      </CartDrawer>
    </>
  );
};

export default CheckoutFloatingButton;