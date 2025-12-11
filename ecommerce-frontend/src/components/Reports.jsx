import { useState } from "react";
import {
  getCustomerSummaries,
  getTopCustomers,
  getProductSalesStatus,
} from "../api";

function Reports({ onClose }) {
  const [activeTab, setActiveTab] = useState("summaries");
  const [summaries, setSummaries] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [salesStatus, setSalesStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [summariesRes, topRes, salesRes] = await Promise.all([
        getCustomerSummaries(),
        getTopCustomers(),
        getProductSalesStatus(),
      ]);
      setSummaries(summariesRes.data);
      setTopCustomers(topRes.data);
      setSalesStatus(salesRes.data);
      setLoaded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Analytics Dashboard
                </h2>
                <p className="text-white/80 text-sm">
                  Customer insights from 1M+ orders
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
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

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-6">
            <button
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "summaries"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("summaries")}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Customer Summaries</span>
              </span>
            </button>
            <button
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "top"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("top")}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span>Top 10 Customers</span>
              </span>
            </button>
            <button
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "sales"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("sales")}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Product Sales</span>
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!loaded ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Load Reports
              </h3>
              <p className="text-gray-500 mb-6">
                Click the button below to fetch customer analytics data
              </p>
              <button
                onClick={loadReports}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Loading Reports...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Load Reports</span>
                  </span>
                )}
              </button>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
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
                <span>{error}</span>
              </div>
            </div>
          ) : activeTab === "summaries" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-l-lg">
                      Customer ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Total Orders
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 rounded-r-lg">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summaries.map((s) => (
                    <tr
                      key={s.customerID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          #{s.customerID}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {s.customerName}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {s.totalOrders.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-green-600">
                          $
                          {s.totalSpent.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === "top" ? (
            <div className="space-y-4">
              {topCustomers.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      i === 0
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : i === 1
                        ? "bg-gradient-to-r from-gray-300 to-gray-400"
                        : i === 2
                        ? "bg-gradient-to-r from-orange-400 to-orange-600"
                        : "bg-gradient-to-r from-indigo-400 to-purple-500"
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Top Customer #{i + 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      $
                      {c.totalSpent.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-l-lg">
                      Product ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Product Name
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Current Stock
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 rounded-r-lg">
                      Total Units Sold
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesStatus.map((p) => (
                    <tr
                      key={p.productID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          #{p.productID}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {p.productName}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-semibold ${
                            p.currentStock < 100
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {p.currentStock.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-indigo-600">
                          {p.totalUnitsSold.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {loaded &&
                `Showing ${
                  activeTab === "summaries"
                    ? summaries.length
                    : activeTab === "top"
                    ? topCustomers.length
                    : salesStatus.length
                } records`}
            </p>
            {loaded && (
              <button
                onClick={loadReports}
                disabled={loading}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
