import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy tất cả sản phẩm:", error);
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm với ID ${productId}:`, error);
      throw error;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await api.get("/products/by-category", {
        params: { category },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm theo danh mục ${category}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật sản phẩm ID ${productId}:`, error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa sản phẩm ID ${productId}:`, error);
      throw error;
    }
  },
};

export default productService;
