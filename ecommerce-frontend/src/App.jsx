import { useState, useEffect } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";
import Reports from "./components/Reports";
import MyOrders from "./components/MyOrders";
import { getMode, setMode, getPotentialDiscount } from "./api";

function App() {
  const [customer, setCustomer] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [useStoredProcedures, setUseStoredProcedures] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount] = useState(0);
  const [refreshProducts, setRefreshProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState(null);

  const handleOrderComplete = () => {
    setRefreshProducts((prev) => prev + 1);
    if (customer) {
      loadDiscount(customer.customerID);
    }
  };

  useEffect(() => {
    loadMode();
  }, []);

  useEffect(() => {
    if (customer) {
      loadDiscount(customer.customerID);
    } else {
      setDiscount(null);
    }
  }, [customer]);

  const loadDiscount = async (customerId) => {
    try {
      const response = await getPotentialDiscount(customerId);
      setDiscount(response.data);
    } catch (err) {
      console.error("Failed to load discount", err);
    }
  };

  const loadMode = async () => {
    try {
      const response = await getMode();
      setUseStoredProcedures(response.data.mode === "StoredProcedure");
    } catch (err) {
      console.error("Failed to load mode", err);
    }
  };

  const handleModeChange = async () => {
    const useSP = !useStoredProcedures;
    try {
      await setMode(useSP);
      setUseStoredProcedures(useSP);
    } catch (err) {
      console.error("Failed to change mode", err);
    }
  };

  const handleLogin = (customerData) => {
    setCustomer(customerData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCustomer(null);
  };

  const handlePlaceOrder = (product = null) => {
    if (!customer) {
      setShowLogin(true);
      return;
    }
    setSelectedProduct(product);
    setShowOrder(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white text-center py-2 text-sm">
        <span>
          🎉 Welcome to ECommerce Store - Powered by 1 Million+ Records Database
        </span>
      </div>

      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ECommerce
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab("home")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "home"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "products"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setShowReports(true)}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Reports
              </button>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Mode Toggle */}
              <div className="hidden lg:flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <span
                  className={`text-xs font-medium ${
                    !useStoredProcedures ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  LINQ
                </span>
                <button
                  onClick={handleModeChange}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    useStoredProcedures ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      useStoredProcedures ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-medium ${
                    useStoredProcedures ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  SP
                </span>
              </div>

              {/* Cart */}
              <button
                onClick={handlePlaceOrder}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Section */}
              {customer ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <div className="relative group">
                    <button className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.firstName?.charAt(0)}
                      {customer.lastName?.charAt(0)}
                    </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {discount && (
                        <div
                          className={`px-4 py-2 border-b border-gray-100 ${
                            discount.isEligible ? "bg-green-50" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-xs text-gray-500">
                            Loyalty Discount
                          </p>
                          {discount.isEligible ? (
                            <p className="text-sm font-semibold text-green-600">
                              🎉 ${discount.potentialDiscount.toFixed(2)}{" "}
                              earned!
                            </p>
                          ) : (
                            <p className="text-xs text-gray-600">
                              Spend $5,000+ to unlock 10% off
                            </p>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => setShowMyOrders(true)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && (
          <>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl overflow-hidden mb-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative px-8 py-16 md:py-24 md:px-16">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Shop the Future
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
                  Discover amazing products from our catalog of 50+ items.
                  Experience seamless shopping powered by advanced database
                  technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab("products")}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Browse Products
                  </button>
                  <button
                    onClick={() => setShowReports(true)}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1,000</p>
                    <p className="text-sm text-gray-500">Customers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1M+</p>
                    <p className="text-sm text-gray-500">Orders</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
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
                    <p className="text-2xl font-bold text-gray-900">50</p>
                    <p className="text-sm text-gray-500">Products</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {useStoredProcedures ? "SP" : "LINQ"}
                    </p>
                    <p className="text-sm text-gray-500">Mode</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Partitioned Tables
                </h3>
                <p className="text-gray-600 text-sm">
                  Orders split by year for optimal query performance on 1M+
                  records.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Stored Procedures
                </h3>
                <p className="text-gray-600 text-sm">
                  Toggle between LINQ queries and optimized stored procedures.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Database Triggers
                </h3>
                <p className="text-gray-600 text-sm">
                  Automatic stock updates and order validation via triggers.
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === "products" && (
          <ProductList
            onOrder={handlePlaceOrder}
            refreshKey={refreshProducts}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <span className="text-lg font-bold">ECommerce</span>
              </div>
              <p className="text-gray-400 text-sm">
                Phase 3 Database Project showcasing advanced SQL Server features
                with React frontend.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Database Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Partitioning</li>
                <li>• Views & Functions</li>
                <li>• Stored Procedures</li>
                <li>• Triggers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tables</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Customers</li>
                <li>• Products</li>
                <li>• Orders</li>
                <li>• Payments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tech Stack</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• .NET 9 Web API</li>
                <li>• Entity Framework Core</li>
                <li>• React + Vite</li>
                <li>• SQL Server</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              © 2025 ECommerce Database Project. Built for educational purposes.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
      {showOrder && customer && (
        <OrderForm
          customer={customer}
          onClose={() => {
            setShowOrder(false);
            setSelectedProduct(null);
          }}
          onOrderComplete={handleOrderComplete}
          selectedProduct={selectedProduct}
        />
      )}
      {showReports && <Reports onClose={() => setShowReports(false)} />}
      {showMyOrders && customer && (
        <MyOrders customer={customer} onClose={() => setShowMyOrders(false)} />
      )}
    </div>
  );
}

export default App;
