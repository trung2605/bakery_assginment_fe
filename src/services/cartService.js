import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getCart = async (cartId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/carts/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy giỏ hàng.');
    }
};

export const addItemToCart = async (cartId, productId, quantity) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/carts/items  `, {
            cartId,
            productId,
            quantity
        });
        return response;
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
};

export const updateItemQuantity = async (cartId, cartItemId, quantity) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/carts/items`, {
            cartId,
            cartItemId,
            quantity
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sản phẩm:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể cập nhật số lượng sản phẩm.');
    }
};

export const removeCartItem = async (cartId, cartItemId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/carts/remove-item/${cartId}/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng.');
    }
};

export const clearCart = async (cartId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/carts/clear-cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi làm trống giỏ hàng:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể làm trống giỏ hàng.');
    }
};

// Đã loại bỏ: export const createGuestCart = async () => {...};
// Backend của bạn cũng sẽ không cần endpoint này nữa.