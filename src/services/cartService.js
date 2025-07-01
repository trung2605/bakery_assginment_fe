// src/services/cartService.js
import axios from 'axios';

const CART_API_BASE_URL = 'http://localhost:8080/api/carts';

const cartService = {
    /**
     * Lấy giỏ hàng theo cartId. Nếu cartId không tồn tại trên backend, backend sẽ tạo mới.
     * @param {string} cartId - ID giỏ hàng (có thể là null hoặc rỗng cho giỏ hàng mới)
     * @returns {Promise<Object>} CartDto
     */
    getCart: async (cartId) => {
        try {
            // Nếu có cartId, gọi API để lấy giỏ hàng hiện có
            if (cartId) {
                const response = await axios.get(`${CART_API_BASE_URL}/${cartId}`);
                return response.data;
            } else {
                // Nếu không có cartId, backend sẽ tạo giỏ hàng mới khi thêm item
                // hoặc bạn có thể có một endpoint riêng để tạo giỏ hàng trống nếu cần
                // Hiện tại, chúng ta sẽ dựa vào logic addItemToCart để tạo giỏ hàng nếu chưa có.
                return null;
            }
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
            // Nếu lỗi 404 (Không tìm thấy giỏ hàng), có thể coi là giỏ hàng mới
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng nếu sản phẩm đã tồn tại.
     * @param {string} productId - ID của sản phẩm
     * @param {number} quantity - Số lượng cần thêm
     * @param {string} [cartId=null] - ID giỏ hàng hiện tại (nếu có)
     * @returns {Promise<Object>} CartDto đã cập nhật
     */
    addItemToCart: async (productId, quantity, cartId = null) => {
        try {
            const response = await axios.post(`${CART_API_BASE_URL}/add`, {
                productId,
                quantity,
                cartId // Backend sẽ sử dụng hoặc tạo mới nếu null/empty
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            throw error;
        }
    },

    /**
     * Cập nhật số lượng của một mục trong giỏ hàng.
     * @param {string} cartId - ID của giỏ hàng
     * @param {string} cartItemId - ID của mục trong giỏ hàng
     * @param {number} quantity - Số lượng mới
     * @returns {Promise<Object>} CartDto đã cập nhật
     */
    updateCartItemQuantity: async (cartId, cartItemId, quantity) => {
        try {
            const response = await axios.put(`${CART_API_BASE_URL}/update-item`, {
                cartId,
                cartItemId,
                quantity
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng:', error);
            throw error;
        }
    },

    /**
     * Xóa một mục khỏi giỏ hàng.
     * @param {string} cartId - ID của giỏ hàng
     * @param {string} cartItemId - ID của mục trong giỏ hàng cần xóa
     * @returns {Promise<Object>} CartDto đã cập nhật
     */
    removeCartItem: async (cartId, cartItemId) => {
        try {
            const response = await axios.delete(`${CART_API_BASE_URL}/${cartId}/item/${cartItemId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            throw error;
        }
    },

    /**
     * Xóa toàn bộ giỏ hàng.
     * @param {string} cartId - ID của giỏ hàng
     * @returns {Promise<void>}
     */
    clearCart: async (cartId) => {
        try {
            await axios.delete(`${CART_API_BASE_URL}/${cartId}/clear`);
        } catch (error) {
            console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
            throw error;
        }
    },
};

export default cartService;