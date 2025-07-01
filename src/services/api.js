// src/services/productService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productService = {
  getAllProducts: () => api.get("/products").then((res) => res.data),
  getProductsByCategory: (category) =>
    api
      .get(`/products/by-category?category=${category}`)
      .then((res) => res.data),
  getProductById: (id) => api.get(`/products/${id}`).then((res) => res.data),

  // ... thêm các hàm cho product khác nếu cần (POST, PUT, DELETE)
};

export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

export default api;
