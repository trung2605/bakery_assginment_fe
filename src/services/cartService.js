import axios from 'axios';

const API_BASE_URL = 'https://bakery-assginment-be.onrender.com/api';

export const getCart = async (cartId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/carts/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy giỏ hàng.');
    }
};

export const addItemToCart = async (cartId, productId, quantity) => { // productId ở đây phải là string
    console.log("addItemToCart - Nhận được từ component:", { cartId, productId, quantity });

    try {
        const payload = {
            cartId: cartId,
            productId: productId.productId, // <--- ĐẢM BẢO RẰNG productId Ở ĐÂY LÀ MỘT CHUỖI ID
            quantity: quantity,
        };
        console.log("addItemToCart - Payload gửi đi:", payload); // Log để kiểm tra payload trước khi gửi

        console.log("addItemToCart - Payload chính xác gửi đi:", JSON.stringify(payload, null, 2)); 

        const response = await axios.post(`${API_BASE_URL}/carts/items`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true // Giữ lại nếu bạn cần gửi cookies/session
        });

        if (response.status === 200 || response.status === 201) { // Spring Boot thường trả về 200 OK hoặc 201 Created
            console.log("Sản phẩm đã được thêm vào giỏ hàng thành công:", response.data);
            return response.data; // Trả về dữ liệu giỏ hàng đã cập nhật
        } else {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', response.data);
            throw new Error(response.data.message || 'Không thể thêm sản phẩm vào giỏ hàng.');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Lỗi Axios khi thêm sản phẩm vào giỏ hàng:', error.response?.data || error.message);
            // Có thể throw lỗi cụ thể hơn nếu backend trả về cấu trúc lỗi chi tiết
            throw new Error(error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng. Lỗi từ server.');
        } else {
            console.error('Lỗi không xác định khi thêm sản phẩm vào giỏ hàng:', error);
            throw new Error('Đã xảy ra lỗi không mong muốn.');
        }
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
            const response = await axios.delete(`${API_BASE_URL}/${cartId}/items/${cartItemId}`);
            console.log("API response for removeCartItem:", response.data);
            return response.data; // Backend nên trả về DTO của giỏ hàng đã cập nhật
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng qua API:", error);
            // Ném lỗi để component gọi có thể bắt và xử lý
            throw new Error(error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng. Lỗi từ server.');
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