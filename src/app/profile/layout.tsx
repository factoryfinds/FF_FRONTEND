"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Heart, Package, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    label: "Cart",
    path: "/profile/cart",
    icon: ShoppingCart,
    description: "View and manage your shopping\nand Review the items in your bag",
  },
  {
    label: "Wishlist",
    path: "/profile/wishlist",
    icon: Heart,
    description: "Keep track of products you love\nand shop them anytime.",
  },
  {
    label: "My Orders",
    path: "/profile/orders",
    icon: Package,
    description: "Check your order history\nand monitor delivery status.",
  },
  {
    label: "Address",
    path: "/profile/address",
    icon: MapPin,
    description: "Save and edit shipping details\nto speed up checkout.",
  },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(() => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  const NavBox = ({
    href,
    label,
    icon: Icon,
    description,
    active,
  }: {
    href: string;
    label: string;
    icon: any;
    description: string;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 ease-in-out text-center
        ${active
          ? "bg-white border-black shadow-sm"
          : "bg-white border-gray-300 hover:border-black hover:shadow-md"}`}
    >
      <Icon
        size={28}
        className={`${active ? "text-black" : "text-gray-600"} mb-2`}
      />
      <span
        className={`text-sm font-medium ${
          active ? "text-black" : "text-gray-700"
        }`}
      >
        {label}
      </span>
      <p className="text-xs text-gray-800 font-extralight mt-1 line-clamp-2">
        {description}
      </p>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Menu Boxes */}
      <section className="p-8 lg:px-15">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <NavBox
              key={item.path}
              href={item.path}
              label={item.label}
              icon={item.icon}
              description={item.description}
              active={pathname === item.path}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-white border-t border-gray-300 px-2 lg:px-25">
        {children}
      </main>
    </div>
  );
}
