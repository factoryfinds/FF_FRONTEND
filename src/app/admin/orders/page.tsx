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
} from "lucide-react";

// Status configurations
const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  shipped: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
  delivered: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

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

  // Handle filter changes
  // const handleFilterChange = (newFilters: Partial<AdminOrdersFilter>) => {
  //   const updatedFilters = { ...filters, ...newFilters, page: 1 };
  //   setFilters(updatedFilters);
  //   setCurrentPage(1);
  //   fetchOrders(updatedFilters);
  // };

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
      { title: "Total Orders", value: statistics.orders.total, icon: ShoppingBag, color: "text-blue-600", bgColor: "bg-blue-50" },
      { title: "Pending Orders", value: statistics.orders.pending, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50" },
      { title: "Total Revenue", value: `₹${statistics.revenue.total.toLocaleString()}`, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
      { title: "Recent Orders", value: statistics.orders.recentOrders, icon: Package, color: "text-purple-600", bgColor: "bg-purple-50" },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <IconComponent size={24} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Order row
  const OrderRow = ({ order }: { order: Order }) => {
    const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
    const StatusIcon = statusInfo?.icon || Package;

    return (
      <tr className="hover:bg-gray-50 border-b border-gray-200">
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">#{order.orderNumber}</div>
          <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{order.user?.name || "N/A"}</div>
          <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo?.color}`}>
            <StatusIcon size={12} className="mr-1" />
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="font-medium">₹{order.totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
        </td>
        <td className="px-6 py-4 flex gap-2">
          <button onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }} className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
            <Eye size={16} />
          </button>
          <button onClick={() => { setSelectedOrder(order); setStatusUpdate({ status: order.status, trackingNumber: "" }); setShowStatusModal(true); }} className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDeleteOrder(order._id)} className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 flex items-center gap-2 border rounded-lg text-sm">
            <Filter size={16} /> Filters
          </button>
          <button onClick={() => fetchOrders(filters, true)} disabled={refreshing} className="px-4 py-2 flex items-center gap-2 border rounded-lg text-sm">
            <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <StatisticsCards />

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="font-medium">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <OrderRow key={order._id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex items-center justify-between border-t">
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * (filters.limit || 10) + 1}–{Math.min(currentPage * (filters.limit || 10), totalCount)} of {totalCount}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded disabled:opacity-50">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded disabled:opacity-50">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Order #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowOrderModal(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Info</h3>
                  <p>Name: {selectedOrder.user?.name || "N/A"}</p>
                  <p>Email: {selectedOrder.user?.email || "N/A"}</p>
                  <p>Phone: {selectedOrder.user?.phone || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Info</h3>
                  <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Total: ₹{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium mb-2">Items</h3>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center border rounded p-3 mb-2">
                    <img src={item.productId?.images?.[0] || "/placeholder.png"} alt="" className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{item.productId?.title}</p>
                      <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p>₹{(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
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
              <h2 className="text-lg font-semibold">Update Status</h2>
              <button onClick={() => setShowStatusModal(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <select value={statusUpdate.status} onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))} className="w-full border p-2 rounded">
                {validStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Tracking number" value={statusUpdate.trackingNumber} onChange={(e) => setStatusUpdate((prev) => ({ ...prev, trackingNumber: e.target.value }))} className="w-full border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleStatusUpdate} disabled={updatingStatus} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                {updatingStatus ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
