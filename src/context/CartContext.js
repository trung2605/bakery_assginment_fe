import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addItemToCart, updateItemQuantity, removeCartItem as serviceRemoveCartItem, clearCart } from '../services/cartService'; // Đổi tên removeCartItem từ service để tránh nhầm lẫn

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// 1. Định nghĩa initialState cho reducer
const initialState = {
    cart: null,
    loadingCart: true,
    cartError: null,
    // wishlistItems sẽ được quản lý bằng useState riêng nếu không có backend cho nó
};

// 2. Định nghĩa reducer function
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'CART_OPERATION_START':
            return { ...state, loadingCart: true, cartError: null };

        case 'FETCH_CART_SUCCESS':
        case 'CART_OPERATION_SUCCESS':
            return { ...state, loadingCart: false, cart: action.payload, cartError: null };

        case 'FETCH_CART_FAILURE':
        case 'CART_OPERATION_FAILURE':
            return { ...state, loadingCart: false, cart: null, cartError: action.payload };

        case 'SET_CART_ERROR': // Dùng cho các lỗi validation/logic frontend trước khi gọi API
            return { ...state, cartError: action.payload, loadingCart: false };

        case 'RESET_CART': // Khi logout hoặc giỏ hàng không hợp lệ
            return { ...state, cart: null, loadingCart: false, cartError: null };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated, userCartId } = useAuth();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { cart, loadingCart, cartError } = state;

    // Wishlist vẫn dùng useState riêng vì nó không liên quan trực tiếp đến các thao tác giỏ hàng
    // và có thể được quản lý độc lập nếu không có backend cho wishlist.
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlistItems');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    // useEffect để lưu wishlist vào localStorage
    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);


    // Hàm để lấy giỏ hàng chỉ khi người dùng đã đăng nhập và có userCartId
    const fetchCart = useCallback(async () => {
        dispatch({ type: 'CART_OPERATION_START' }); // Bắt đầu thao tác giỏ hàng

        if (!isAuthenticated || !userCartId) {
            console.log("Người dùng chưa đăng nhập hoặc không có cartId, không tải giỏ hàng.");
            dispatch({ type: 'RESET_CART' }); // Reset giỏ hàng về null
            dispatch({ type: 'SET_CART_ERROR', payload: 'Bạn cần đăng nhập để xem giỏ hàng.' });
            return;
        }

        try {
            console.log("Tải giỏ hàng với userCartId:", userCartId);
            const fetchedCart = await getCart(userCartId);
            if (fetchedCart && fetchedCart.cartId) {
                dispatch({ type: 'FETCH_CART_SUCCESS', payload: fetchedCart });
            } else {
                dispatch({ type: 'FETCH_CART_FAILURE', payload: 'Giỏ hàng không hợp lệ. Vui lòng kiểm tra lại hoặc đăng nhập lại.' });
            }
        } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
            dispatch({ type: 'FETCH_CART_FAILURE', payload: err.message || 'Không thể tải giỏ hàng. Vui lòng thử lại.' });
        }
    }, [isAuthenticated, userCartId]);

    // Effect để tải giỏ hàng khi người dùng đăng nhập/đăng xuất hoặc userCartId thay đổi
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = useCallback(async (productId, quantity = 1) => {
        dispatch({ type: 'CART_OPERATION_START' });

        if (!userCartId) {
            dispatch({ type: 'SET_CART_ERROR', payload: 'Không tìm thấy ID giỏ hàng. Vui lòng đăng nhập lại.' });
            return false;
        }

        try {
            const updatedCart = await addItemToCart(userCartId, productId, quantity);
            dispatch({ type: 'CART_OPERATION_SUCCESS', payload: updatedCart });
            console.log('Sản phẩm đã được thêm vào giỏ:', updatedCart);
            return true;
        } catch (err) {
            console.error('Lỗi khi thêm vào giỏ hàng:', err);
            dispatch({ type: 'CART_OPERATION_FAILURE', payload: err.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng.' });
            return false;
        }
    }, [userCartId]);

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateCartItemQuantity = useCallback(async (cartItemId, newQuantity) => {
        dispatch({ type: 'CART_OPERATION_START' });

        if (!isAuthenticated || !userCartId) {
            dispatch({ type: 'SET_CART_ERROR', payload: 'Bạn cần đăng nhập để cập nhật giỏ hàng.' });
            return false;
        }
        if (newQuantity < 1) {
            dispatch({ type: 'SET_CART_ERROR', payload: 'Số lượng phải lớn hơn 0.' });
            return false;
        }

        try {
            const updatedCart = await updateItemQuantity(userCartId, cartItemId, newQuantity);
            dispatch({ type: 'CART_OPERATION_SUCCESS', payload: updatedCart });
            console.log('Số lượng đã được cập nhật:', updatedCart);
            return true;
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng:', err);
            dispatch({ type: 'CART_OPERATION_FAILURE', payload: err.message || 'Lỗi khi cập nhật số lượng sản phẩm.' });
            return false;
        }
    }, [isAuthenticated, userCartId]);

    // Hàm xóa một mặt hàng khỏi giỏ hàng
    const removeCartItem = useCallback(async (cartItemId) => {
        dispatch({ type: 'CART_OPERATION_START' });

        if (!isAuthenticated || !userCartId) {
            dispatch({ type: 'SET_CART_ERROR', payload: 'Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.' });
            return false;
        }

        try {
            // SỬA LỖI ĐỆ QUY: Gọi hàm từ services/cartService.js (đã đổi tên import)
            const updatedCart = await serviceRemoveCartItem(userCartId, cartItemId);
            dispatch({ type: 'CART_OPERATION_SUCCESS', payload: updatedCart });
            console.log('Sản phẩm đã được xóa khỏi giỏ:', updatedCart);
            return true;
        } catch (err) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ:', err);
            dispatch({ type: 'CART_OPERATION_FAILURE', payload: err.message || 'Lỗi khi xóa sản phẩm khỏi giỏ.' });
            return false;
        }
    }, [isAuthenticated, userCartId]);

    // Hàm xóa toàn bộ giỏ hàng
    const clearCartFunc = useCallback(async () => {
        dispatch({ type: 'CART_OPERATION_START' });

        if (!isAuthenticated || !userCartId) {
            dispatch({ type: 'SET_CART_ERROR', payload: 'Bạn cần đăng nhập để làm trống giỏ hàng.' });
            return false;
        }

        try {
            const emptiedCart = await clearCart(userCartId);
            dispatch({ type: 'CART_OPERATION_SUCCESS', payload: emptiedCart });
            console.log('Giỏ hàng đã được làm trống.');
            return true;
        } catch (err) {
            console.error('Lỗi khi làm trống giỏ hàng:', err);
            dispatch({ type: 'CART_OPERATION_FAILURE', payload: err.message || 'Lỗi khi làm trống giỏ hàng.' });
            return false;
        }
    }, [isAuthenticated, userCartId]);

    // Các hàm xử lý wishlist (giữ nguyên)
    const addToWishlist = useCallback((product) => {
        setWishlistItems((prevItems) => {
            if (prevItems.some((item) => item.productId === product.productId)) {
                alert('Sản phẩm đã có trong danh sách yêu thích!');
                return prevItems;
            }
            const newItem = {
                productId: product.productId,
                name: product.name,
                imageUrl: product.imageUrl || (product.images && product.images[0]),
                price: product.price,
            };
            return [...prevItems, newItem];
        });
    }, []);

    const removeProductFromWishlist = useCallback((productId) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    }, []);

    const contextValue = {
        cart,
        loadingCart,
        cartError,
        wishlistItems,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart: clearCartFunc,
        addToWishlist,
        removeProductFromWishlist,
        cartTotalItems: cart ? cart.cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0,
        cartTotalAmount: cart ? cart.totalAmount : 0,
    };

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};