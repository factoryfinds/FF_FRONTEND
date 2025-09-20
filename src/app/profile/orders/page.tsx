"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getUserOrders, APIError } from "../../../../utlis/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { 
  RefreshCcw, Package, Calendar, CreditCard, ShoppingBag, ArrowRight, MapPin, Phone, User, Truck, CheckCircle, Clock, AlertCircle,
  ArrowLeft, Copy, Check
} from "lucide-react";

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
  title: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shippingCharges: number;
  discountAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  isDelivered: boolean;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
};

// Status color mapping
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return "bg-gray-100 text-gray-800 border-gray-300";
    case 'processing':
      return "bg-gray-200 text-gray-900 border-gray-400";
    case 'shipped':
      return "bg-gray-300 text-black border-gray-500";
    case 'delivered':
      return "bg-black text-white border-black";
    case 'cancelled':
      return "bg-gray-100 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return Clock;
    case 'processing':
      return Package;
    case 'shipped':
      return Truck;
    case 'delivered':
      return CheckCircle;
    case 'cancelled':
      return AlertCircle;
    default:
      return Package;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
        action={() => router.push("/")}
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

  // Show order details modal
  if (selectedOrder) {
    return (
      <OrderDetailView 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              {/* Brand indicator */}
              <div className="mb-4">
                <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
              </div>
              
              <h1 className="text-md sm:text-md font-semibold text-black mb-2 tracking-tighter">My Orders</h1>
              <p className="text-xs font-light text-gray-700 uppercase tracking-[0.1em]">
                Track and manage your order history
              </p>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-3 px-6 py-3 text-xs font-light uppercase tracking-[0.15em] text-black border border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RefreshCcw 
                size={16} 
                className={`${refreshing ? 'animate-spin' : ''}`} 
              />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
        <div className="space-y-8">
          {orders.map((order) => (
            <OrderCard 
              key={order._id} 
              order={order} 
              onViewDetails={() => setSelectedOrder(order)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Order Card Component
const OrderCard = ({ order, onViewDetails }: { order: Order; onViewDetails: () => void }) => {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow duration-300">
      {/* Order Header */}
      <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-gray-200">
              <Package size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-black uppercase tracking-[0.15em]">
                Order #{order.orderNumber}
              </h3>
              <div className="flex items-center gap-2 text-xs font-light text-gray-600 mt-2 tracking-wide">
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
            <span className={`inline-flex items-center px-4 py-2 text-xs font-light uppercase tracking-[0.1em] border ${getStatusStyle(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-8 py-6">
        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const product = item.productId || {};
            const price = item.priceAtPurchase || 0;

            return (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50">
                <div className="w-16 h-20 bg-white overflow-hidden border border-gray-200">
                  <img
                    src={
                      product.images?.[0] ||
                      item.image ||
                      "/placeholder.png"
                    }
                    alt={product.title || item.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-black mb-2 tracking-wide truncate">
                    {product.title || item.title || "Untitled Product"}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 font-light tracking-wide">
                    <span className="bg-white px-3 py-1 border border-gray-200">
                      Size: {item.size}
                    </span>
                    <span className="bg-white px-3 py-1 border border-gray-200">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-black tracking-wide">
                    ₹{(price * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Footer */}
      <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-light tracking-wide">
            <CreditCard size={16} />
            <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-600 font-light uppercase tracking-[0.1em]">Order Total</p>
              <p className="text-sm font-medium text-black tracking-wide">
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>
            
            <button 
              onClick={onViewDetails}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-light uppercase tracking-[0.15em] text-black border border-gray-300 hover:border-black hover:bg-white transition-all duration-300"
            >
              View Details
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Detail View Component
const OrderDetailView = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  const [copiedPaymentId, setCopiedPaymentId] = useState(false);
  const StatusIcon = getStatusIcon(order.status);

  const copyPaymentId = async () => {
    if (order.razorpayPaymentId) {
      await navigator.clipboard.writeText(order.razorpayPaymentId);
      setCopiedPaymentId(true);
      setTimeout(() => setCopiedPaymentId(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-50 transition-colors duration-300 border border-gray-300"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                {/* Brand indicator */}
                <div className="mb-2">
                  <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
                </div>
                <h1 className="text-md font-semibold text-black tracking-tighter">Order Details</h1>
                <p className="text-xs font-light text-gray-700 uppercase tracking-[0.1em] mt-1">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <StatusIcon size={20} className="text-gray-400" />
              <span className={`inline-flex items-center px-4 py-2 text-xs font-light uppercase tracking-[0.1em] border ${getStatusStyle(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item, idx) => {
                  const product = item.productId || {};
                  const price = item.priceAtPurchase || 0;

                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50">
                      <div className="w-20 h-24 bg-white overflow-hidden border border-gray-200">
                        <img
                          src={
                            product.images?.[0] ||
                            item.image ||
                            "/placeholder.png"
                          }
                          alt={product.title || item.title || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-black mb-3 tracking-wide">
                          {product.title || item.title || "Untitled Product"}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 font-light tracking-wide">
                          <span className="bg-white px-3 py-2 border border-gray-200">
                            Size: {item.size}
                          </span>
                          <span className="bg-white px-3 py-2 border border-gray-200">
                            Quantity: {item.quantity}
                          </span>
                          <span className="bg-white px-3 py-2 border border-gray-200">
                            ₹{price.toLocaleString()} each
                          </span>
                        </div>
                        <p className="text-sm font-medium text-black tracking-wide">
                          ₹{(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={20} className="text-gray-600" />
                <h2 className="text-xs font-black text-black uppercase tracking-[0.15em]">Shipping Address</h2>
              </div>
              <div className="bg-gray-50 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="font-medium text-black tracking-wide">{order.shippingAddress.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-700 font-light tracking-wide">{order.shippingAddress.phone}</span>
                </div>
                <p className="text-gray-700 font-light tracking-wide ml-6">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700 font-light tracking-wide">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-light tracking-wide">
                  <span>Shipping</span>
                  <span>{order.shippingCharges > 0 ? `₹${order.shippingCharges.toLocaleString()}` : 'Free'}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-gray-600 font-light tracking-wide">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4 flex justify-between font-medium text-black tracking-wide">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">Order Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-[0.1em]">Order Date</label>
                  <p className="text-black mt-2 font-light tracking-wide">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-[0.1em]">Payment Method</label>
                  <p className="text-black mt-2 font-light tracking-wide capitalize">{order.paymentMethod}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-[0.1em]">Payment Status</label>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-light uppercase tracking-[0.1em] mt-2 border ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>

                {order.razorpayPaymentId && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-[0.1em]">Payment ID</label>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-gray-100 px-3 py-2 flex-1 truncate font-light tracking-wide">
                        {order.razorpayPaymentId}
                      </code>
                      <button
                        onClick={copyPaymentId}
                        className="p-2 hover:bg-gray-100 transition-colors duration-300"
                      >
                        {copiedPaymentId ? (
                          <Check size={14} className="text-black" />
                        ) : (
                          <Copy size={14} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-[0.1em]">Last Updated</label>
                  <p className="text-black mt-2 font-light tracking-wide">
                    {new Date(order.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
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
  <div className="min-h-screen bg-white flex items-center justify-center px-4">
    <div className="text-center max-w-md mx-auto">
      {/* Brand indicator */}
      <div className="mb-6">
        <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
      </div>
      
      <div className="mx-auto w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mb-6">
        <Icon size={32} className="text-gray-400" />
      </div>
      
      <h2 className="text-xs font-black text-black mb-3 uppercase tracking-[0.15em]">
        {title}
      </h2>
      
      <p className="text-xs text-gray-600 font-light mb-8 tracking-wide leading-relaxed">
        {message}
      </p>
      
      <button
        onClick={action}
        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors duration-300"
      >
        {actionLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
);