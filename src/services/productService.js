// src/services/productService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

const productService = {
    // ... (Giữ nguyên các hàm đã có: getProductById, createProduct, updateProduct, updateProductStock, deleteProduct, getLatestProducts) ...

    /**
     * Lấy tất cả sản phẩm có phân trang và sắp xếp.
     * GET /api/products?page={page}&size={size}&sortBy={sortBy}&sortDirection={sortDirection}
     * @param {number} page Số trang (bắt đầu từ 0).
     * @param {number} size Kích thước trang.
     * @param {string} sortBy Thuộc tính để sắp xếp.
     * @param {string} sortDirection Hướng sắp xếp ('asc'/'desc').
     * @returns {Promise<Object>} Đối tượng Page chứa content (danh sách sản phẩm), totalPages, totalElements.
     */
    getPaginatedProducts: async (page = 0, size = 10, sortBy = 'productId', sortDirection = 'asc') => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { page, size, sortBy, sortDirection }
            });
            return response.data; // Trả về đối tượng Page
        } catch (error) {
            console.error('Lỗi khi lấy tất cả sản phẩm có phân trang:', error);
            throw error;
        }
    },

    /**
     * Lấy sản phẩm theo category có phân trang và sắp xếp.
     * GET /api/products/by-category?category={category}&page={page}&size={size}&sortBy={sortBy}&sortDirection={sortDirection}
     */
    getPaginatedProductsByCategory: async (category, page = 0, size = 10, sortBy = 'productId', sortDirection = 'asc') => {
        try {
            const response = await axios.get(`${API_BASE_URL}/by-category`, {
                params: { category, page, size, sortBy, sortDirection }
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy sản phẩm theo danh mục "${category}" có phân trang:`, error);
            throw error;
        }
    },

    /**
     * Lấy sản phẩm theo khoảng giá có phân trang và sắp xếp.
     * GET /api/products/by-price-range?minPrice={minPrice}&maxPrice={maxPrice}&page={page}&size={size}&sortBy={sortBy}&sortDirection={sortDirection}
     */
    getPaginatedProductsByPriceRange: async (minPrice, maxPrice = null, page = 0, size = 10, sortBy = 'productId', sortDirection = 'asc') => {
        try {
            const params = { minPrice, page, size, sortBy, sortDirection };
            if (maxPrice !== null) {
                params.maxPrice = maxPrice;
            }
            const response = await axios.get(`${API_BASE_URL}/by-price-range`, { params });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy sản phẩm theo khoảng giá ${minPrice}-${maxPrice} có phân trang:`, error);
            throw error;
        }
    },

};

export default productService;