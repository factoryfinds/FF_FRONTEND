// components/AdminSlidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Ticket, 
  Users, 
  Menu, 
  X 
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/add-products', label: 'Add Products', icon: Package },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200"
      >
        {isOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-black">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-black hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}