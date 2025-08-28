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
  X,
  BoxIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const menuItems = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'View key metrics and overview\nof your business performance'
  },
  { 
    href: '/admin/add-products', 
    label: 'Add Products', 
    icon: Package,
    description: 'Create and manage your product\ncatalog with ease'
  },
  { 
    href: '/admin/analytics', 
    label: 'Analytics', 
    icon: BarChart3,
    description: 'Track sales data and customer\nbehavior insights'
  },
  { 
    href: '/admin/coupons', 
    label: 'Coupons', 
    icon: Ticket,
    description: 'Create discount codes and\nmanage promotional offers'
  },
  { 
    href: '/admin/users', 
    label: 'Users', 
    icon: Users,
    description: 'Manage customer accounts\nand user permissions'
  },
  { 
    href: '/admin/orders', 
    label: 'Orders', 
    icon: BoxIcon,
    description: 'Process and track customer\norders and fulfillment'
  },
];

interface AdminSidebarProps {
  children?: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavBox = ({
    href,
    label,
    icon: Icon,
    description,
    active,
  }: {
    href: string;
    label: string;
    icon: LucideIcon;
    description: string;
    active: boolean;
  }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`
        group relative block p-6 bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg
        ${active 
          ? 'border-blue-500 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          p-3 rounded-lg transition-colors duration-200
          ${active 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
          }
        `}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            text-lg font-semibold mb-2 transition-colors duration-200
            ${active ? 'text-blue-600' : 'text-gray-900 group-hover:text-gray-700'}
          `}>
            {label}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your business</p>
          </div>

          {/* Navigation Cards */}
          <div className="p-6 space-y-4">
            {menuItems.map((item) => (
              <NavBox
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                description={item.description}
                active={pathname === item.href}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {children}
        </div>
      </div>
    </div>
  );
}
