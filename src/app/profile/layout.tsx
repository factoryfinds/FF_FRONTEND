"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { toast } from 'react-hot-toast';
const links = [
  { label: "Cart", path: "/profile/cart", icon: <ShoppingCart size={20} /> },
  { label: "Wishlist", path: "/profile/wishlist", icon: <Heart size={20} /> },
  { label: "My Orders", path: "/profile/orders", icon: <Package size={20} /> },
  { label: "Address", path: "/profile/address", icon: <MapPin size={20} /> },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
        try {
            // Optional: Call backend logout endpoint if you have one
            // await logout(); // This would be from your API utils

            // Clear all auth-related data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");


            // Show success message
            toast.success("Logged out successfully!");

            // Refresh page after a brief delay
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Logout error:', error);

            // Even if API call fails, still clear local data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");


            toast.error("Logout completed with errors");
            window.location.reload();
        }
    };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold">My Account</h2>
        {/* Close button for mobile */}
        <button
          onClick={closeMobileMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-4 flex-1">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-100 font-semibold text-black border-l-4 border-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  <span className={`${isActive ? "text-black" : "text-gray-500"}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm border-2 border-gray-300 text-gray-700 w-full px-4 py-3 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">My Account</h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-80 max-w-[85vw] 
          bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:w-72 xl:w-80
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col p-20">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white lg:bg-gray-50">
        <div className="h-full lg:p-6">
          <div className="bg-white lg:rounded-lg lg:shadow-sm h-full">
            <div className="p-4 sm:p-6 lg:p-8 h-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}