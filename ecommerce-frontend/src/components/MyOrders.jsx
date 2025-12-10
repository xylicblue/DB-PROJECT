import { useState, useEffect } from "react";
import { getCustomerOrders } from "../api";

export default function MyOrders({ customer, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [customer]);

  const loadOrders = async () => {
    if (!customer) return;
    setLoading(true);
    try {
      const response = await getCustomerOrders(customer.customerID);
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">My Orders</h2>
                <p className="text-indigo-100 text-sm">
                  View your order history
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No orders yet
              </h3>
              <p className="text-gray-500">
                Start shopping to see your orders here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={`${order.orderID}-${order.orderDate}`}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div
                    className="bg-gray-50 px-4 py-3 cursor-pointer"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.orderID ? null : order.orderID
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-semibold text-gray-900">
                            #{order.orderID}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-bold text-indigo-600">
                            ${order.totalAmount?.toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedOrder === order.orderID ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Order Items (Expandable) */}
                  {expandedOrder === order.orderID && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-indigo-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.productName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × $
                                  {item.unitPrice?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
