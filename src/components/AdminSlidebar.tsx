"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  List,
  LayoutGrid,
  CreditCard,
  Megaphone,
  BarChart2,
  Users,
  Settings,
} from "lucide-react";

const sections = [
  {
    title: "",
    items: [
      { name: "Dashboard", route: "/admin", icon: <Home size={18} /> },
    ],
  },
  {
    title: "Products",
    items: [
      { name: "Orders", route: "/admin/orders", icon: <Package size={18} /> },
      { name: "Product List", route: "/admin/add-products", icon: <List size={18} /> },
      { name: "Category List", route: "/admin/categories", icon: <LayoutGrid size={18} /> },
    ],
  },
  {
    title: "Sales",
    items: [
      { name: "Payments", route: "/admin/payments", icon: <CreditCard size={18} /> },
      { name: "Campaigns", route: "/admin/campaigns", icon: <Megaphone size={18} /> },
      { name: "Analytics", route: "/admin/analytics", icon: <BarChart2 size={18} /> },
      { name: "Customers", route: "/admin/users", icon: <Users size={18} /> },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "General", route: "/admin/settings", icon: <Settings size={18} /> },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#F9FAFB] p-6 border-r text-sm text-gray-800">
      <h2 className="text-xl font-extrabold mb-8">Admin Panel</h2>
      <nav className="space-y-6">
        {sections.map((section, index) => (
          <div key={index}>
            {section.title && (
              <div className="text-xs font-semibold uppercase text-gray-500 mb-2 px-1">
                {section.title}
              </div>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.route;
                return (
                  <li key={item.route}>
                    <Link
                      href={item.route}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition ${
                        isActive
                          ? "bg-white font-semibold shadow text-black"
                          : "text-gray-700"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
