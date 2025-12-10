import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth endpoints
export const login = (email) => api.post("/auth/login", { email });
export const register = (data) => api.post("/auth/register", data);

// Products endpoints
export const getProducts = () => api.get("/products");
export const getStockStatus = (productId) =>
  api.get(`/products/${productId}/stock-status`);
export const getProductSalesStatus = () => api.get("/products/sales-status");

// Orders endpoints
export const placeOrder = (customerId, productId, quantity) =>
  api.post("/orders", { customerId, productId, quantity });
export const getCustomerOrders = (customerId) =>
  api.get(`/orders/customer/${customerId}`);

// Reports endpoints
export const getCustomerSummaries = () =>
  api.get("/reports/customer-summaries");
export const getTopCustomers = () => api.get("/reports/top-customers");

// Settings endpoints
export const getMode = () => api.get("/settings/mode");
export const setMode = (useStoredProcedures) =>
  api.post("/settings/mode", { useStoredProcedures });

export default api;
