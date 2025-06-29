import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    getAllProducts: () => api.get('/products'),
    getProductsByCategory: (category) => api.get(`/products/by-category?category=${category}`),
    getProductById: (id) => api.get(`/products/${id}`),
    // ... thêm các hàm cho product khác nếu cần (POST, PUT, DELETE)
};

// Ví dụ về Auth API
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

export default api; 