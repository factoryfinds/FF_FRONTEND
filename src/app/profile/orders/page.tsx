"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getUserOrders, APIError } from "../../../../utlis/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { RefreshCcw, Package, Calendar, CreditCard, ShoppingBag, ArrowRight } from "lucide-react";

type OrderItem = {
  productId: {
    _id: string;
    title: string;
    images: string[];
  };
  size: string;
  quantity: number;
  priceAtPurchase: number;
  image?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

// Status color mapping
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case 'processing':
      return "bg-blue-50 text-blue-700 border-blue-200";
    case 'shipped':
      return "bg-purple-50 text-purple-700 border-purple-200";
    case 'delivered':
      return "bg-green-50 text-green-700 border-green-200";
    case 'cancelled':
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setAuthError(false);
      const data = await getUserOrders();
      setOrders(data.orders || []);
    } catch (err) {
      if (err instanceof APIError && err.code === "UNAUTHORIZED") {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Loading state
  if (loading) return <LoadingOverlay isVisible={loading} />;

  // Auth error
  if (authError)
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Login Required"
        message="Please login to view your order history and track your purchases."
        actionLabel="Login"
        action={() => router.push("/login")}
      />
    );

  // No orders
  if (orders.length === 0)
    return (
      <EmptyState
        icon={Package}
        title="No Orders Yet"
        message="Start exploring our collection and place your first order to see it here."
        actionLabel="Start Shopping"
        action={() => router.push("/product/allProducts")}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage your order history
              </p>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw 
                size={16} 
                className={`${refreshing ? 'animate-spin' : ''}`} 
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Order Card Component
const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Order Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <Package size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar size={14} />
                <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const product = item.productId || {};
            const price = item.priceAtPurchase || 0;

            return (
              <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-20 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <img
                    src={
                      product.images?.[0] ||
                      item.image ||
                      "/placeholder.png"
                    }
                    alt={product.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.title || "Untitled Product"}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span className="bg-white px-2 py-1 rounded border border-gray-200">
                      Size: {item.size}
                    </span>
                    <span className="bg-white px-2 py-1 rounded border border-gray-200">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    ₹{(price * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard size={16} />
            <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>
            
            <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
              View Details
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Empty State Component
const EmptyState = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  action,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  message: string;
  actionLabel: string;
  action: () => void;
}) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md mx-auto">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon size={32} className="text-gray-400" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        {message}
      </p>
      
      <button
        onClick={action}
        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
      >
        {actionLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
);