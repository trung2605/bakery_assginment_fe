// src/services/productService.js

import axios from 'axios';

// Định nghĩa Base URL cho API Product của bạn
// Đảm bảo rằng URL này khớp với base URL của backend Spring Boot của bạn
// Ví dụ: nếu backend chạy trên localhost:8080 và ProductController có @RequestMapping("/api/products")
const API_BASE_URL = 'http://localhost:8080/api/products';

// Tạo một instance Axios để dễ dàng quản lý các request và headers chung
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Nếu bạn đã tích hợp JWT, bạn sẽ thêm Authorization header ở đây
        // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    },
});

const productService = {
    /**
     * Lấy tất cả sản phẩm từ API.
     * Tương ứng với GET /api/products
     * @returns {Promise<Array>} Danh sách các sản phẩm.
     */
    getAllProducts: async () => {
        try {
            const response = await api.get('/'); // '/' tương ứng với /api/products
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy tất cả sản phẩm:", error);
            throw error; // Ném lỗi để component gọi có thể xử lý
        }
    },

    /**
     * Lấy sản phẩm theo ID.
     * Tương ứng với GET /api/products/{productId}
     * @param {string} productId ID của sản phẩm cần lấy.
     * @returns {Promise<Object>} Đối tượng sản phẩm.
     */
    getProductById: async (productId) => {
        try {
            const response = await api.get(`/${productId}`); // Ví dụ: /api/products/PROD0001
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy sản phẩm với ID ${productId}:`, error);
            throw error;
        }
    },

    /**
     * Lấy danh sách sản phẩm theo Category.
     * Tương ứng với GET /api/products/by-category?category={categoryName}
     * @param {string} category Tên danh mục sản phẩm.
     * @returns {Promise<Array>} Danh sách các sản phẩm thuộc danh mục.
     */
    getProductsByCategory: async (category) => {
        try {
            // Sử dụng params để Axios tự động mã hóa URL (ví dụ: 'Bánh Ngọt' -> 'B%C3%A1nh%20Ng%E1%BB%8Dt')
            const response = await api.get('/by-category', {
                params: { category: category }
            });

            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy sản phẩm theo danh mục ${category}:`, error);
            throw error;
        }

    },

    // Bạn có thể thêm các phương thức khác ở đây nếu cần (POST, PUT, DELETE)
    // Ví dụ:
    createProduct: async (productData) => {
        try {
            const response = await api.post('/', productData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            throw error;
        }
    },

    updateProduct: async (productId, productData) => {
        try {
            const response = await api.put(`/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật sản phẩm ID ${productId}:`, error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            const response = await api.delete(`/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa sản phẩm ID ${productId}:`, error);
            throw error;
        }
    }
};

export default productService;