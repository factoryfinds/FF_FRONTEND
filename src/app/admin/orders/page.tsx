"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getAdminOrders,
  getAdminOrderStatistics,
  updateOrderStatus,
  deleteAdminOrder,
  AdminOrdersFilter,
  OrderStatistics,
  Order,
  APIError,
} from "../../../../utlis/api";
import { toast } from "react-hot-toast";
import {
  Package,
  Filter,
  RefreshCcw,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  User,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";

// Updated status configurations to match backend
// const statusConfig = {
//   pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
//   confirmed: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
//   shipped: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
//   delivered: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
//   cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
//   returned: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Package },
// };

// Updated valid statuses to match backend
const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];

// Status color mapping function
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case 'shipped':
      return "bg-purple-50 text-purple-700 border-purple-200";
    case 'delivered':
      return "bg-green-50 text-green-700 border-green-200";
    case 'cancelled':
      return "bg-red-50 text-red-700 border-red-200";
    case 'returned':
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function AdminOrdersPage() {
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<AdminOrdersFilter>({
    page: 1,
    limit: 10,
  });

  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: "", trackingNumber: "" });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch orders
  const fetchOrders = useCallback(
    async (newFilters?: AdminOrdersFilter, isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const filterParams = newFilters || filters;
        const response = await getAdminOrders(filterParams);

        setOrders(response.orders);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error instanceof APIError ? error.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await getAdminOrderStatistics();
      setStatistics(response.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to fetch order statistics");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, []);

  // Handle pagination
  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchOrders(updatedFilters);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      await updateOrderStatus(
        selectedOrder._id,
        statusUpdate.status,
        statusUpdate.trackingNumber || undefined
      );

      toast.success("Order status updated successfully");
      setShowStatusModal(false);
      setStatusUpdate({ status: "", trackingNumber: "" });
      fetchOrders(filters, true);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error instanceof APIError ? error.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle delete
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteAdminOrder(orderId);
      toast.success("Order deleted successfully");
      fetchOrders(filters, true);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error instanceof APIError ? error.message : "Failed to delete order");
    }
  };

  // Statistics cards
  const StatisticsCards = () => {
    if (statsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!statistics) return null;

    const cards = [
      { title: "Total Orders", value: statistics.orders.total, icon: ShoppingBag, color: "text-blue-600", bgColor: "bg-blue-50", Subtitle: "Total number of orders" },
      { title: "Pending Orders", value: statistics.orders.pending, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50", Subtitle: "Total number of orders that are pending" },
      { title: "Total Revenue", value: `₹${statistics.revenue.total.toLocaleString()}`, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", Subtitle: "total revenue calculated after shipping product" },
      { title: "Recent Orders", value: statistics.orders.recentOrders, icon: Package, color: "text-purple-600", bgColor: "bg-purple-50", Subtitle: "recent orders within a week" },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {cards.map((card, index) => {
    const IconComponent = card.icon;
    return (
      <div 
        key={index} 
        className="group relative bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`
                p-3 rounded-lg transition-colors duration-200
                ${card.bgColor || 'bg-blue-100'} 
                group-hover:scale-110 group-hover:shadow-md
              `}>
                <IconComponent 
                  size={24} 
                  className={`${card.color || 'text-blue-600'} transition-transform duration-200`} 
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                  {card.title}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {card.value}
              </p>
              {card.Subtitle && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.Subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        
        
      </div>
    );
  })}
</div>
    );
  };

  // Enhanced Order Card Component (similar to user orders page)
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

        {/* Customer & Order Info */}
        <div className="px-6 py-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <User size={16} />
                Customer Details
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Name:</span> {order.shippingAddress?.fullName || "N/A"}</p>
                <p className="flex items-center gap-1">
                  <Phone size={12} />
                  {order.user?.phone || order.shippingAddress?.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <MapPin size={16} />
                Shipping Address
              </h4>
              <div className="text-sm text-gray-600">
                {order.shippingAddress ? (
                  <div className="space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}, {order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p>No address provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Items ({order.items.length})</h4>
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
                      {product.title || item.title || "Untitled Product"}
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard size={16} />
                <span>{order.paymentMethod || 'N/A'}</span>
              </div>
              <div className="text-sm text-gray-600">
                Payment: <span className="font-medium">{order.paymentStatus || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{order.totalAmount.toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => { 
                    setSelectedOrder(order); 
                    setShowOrderModal(true); 
                  }} 
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-300 transition-all"
                >
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => { 
                    setSelectedOrder(order); 
                    setStatusUpdate({ status: order.status, trackingNumber: "" }); 
                    setShowStatusModal(true); 
                  }} 
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg border border-gray-300 transition-all"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteOrder(order._id)} 
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-300 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track all customer orders</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <Filter size={16} /> Filters
              </button>
              <button 
                onClick={() => fetchOrders(filters, true)} 
                disabled={refreshing} 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} /> 
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatisticsCards />

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="font-medium text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * (filters.limit || 10) + 1}–{Math.min(currentPage * (filters.limit || 10), totalCount)} of {totalCount}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1} 
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-2 text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages} 
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Order #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <User size={16} />
                    Customer Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.shippingAddress?.fullName || "N/A"}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.user?.phone || selectedOrder.shippingAddress?.phone || "N/A"}</p>
                    <p><span className="font-medium">Payment:</span> {selectedOrder.paymentMethod || "N/A"}</p>
                    <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Shipping Address
                  </h3>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.pincode}, {selectedOrder.shippingAddress.country}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No address provided</p>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h3 className="font-medium mb-3">Order Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium">{selectedOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Items</p>
                    <p className="font-medium">{selectedOrder.items.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-medium">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center border border-gray-200 rounded-lg p-3">
                      <img 
                        src={item.productId?.images?.[0] || item.image || "/placeholder.png"} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100" 
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.productId?.title || item.title}</p>
                        <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">₹{item.priceAtPurchase} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Update Order Status</h2>
              <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={statusUpdate.status} 
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))} 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {validStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter tracking number" 
                  value={statusUpdate.trackingNumber} 
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, trackingNumber: e.target.value }))} 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button 
                onClick={() => setShowStatusModal(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate} 
                disabled={updatingStatus} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {updatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}