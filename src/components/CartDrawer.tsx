"use client";
import { FiX } from "react-icons/fi";
import { ReactNode } from "react"; // 👈 for children type

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // 👈 allow child content
}

const CartDrawer = ({ isOpen, onClose, children }: CartDrawerProps) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white z-50 shadow-lg transition-transform duration-400 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        w-full md:w-1/2`}
    >
      {/* Header */}
      <div className="flex justify-between items-center py-10 px-5 text-black border-b">
        <h2 className="text-lg font-semibold">CART</h2>
        <button onClick={onClose}>
          <FiX size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto h-[calc(100%-60px)] p-1 mb-10 pb-10">
        {children}
      </div>
    </div>
  );
};

export default CartDrawer;
