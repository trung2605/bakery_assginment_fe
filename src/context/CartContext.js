// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService'; // Import cartService

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null); // Giỏ hàng sẽ được lưu trữ ở đây
    const [wishlistItems, setWishlistItems] = useState(() => {
        // Lấy danh sách yêu thích từ localStorage khi khởi tạo
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);

    // Sử dụng localStorage để lưu cartId
    const getStoredCartId = () => localStorage.getItem('cartId');
    const setStoredCartId = (id) => localStorage.setItem('cartId', id);
    const removeStoredCartId = () => localStorage.removeItem('cartId');

    // Hàm để fetch giỏ hàng từ backend
    const fetchCart = useCallback(async () => {
        setLoadingCart(true);
        setCartError(null);
        const storedCartId = getStoredCartId();

        try {
            const fetchedCart = await cartService.getCart(storedCartId);
            if (fetchedCart) {
                setCart(fetchedCart);
                setStoredCartId(fetchedCart.cartId); // Cập nhật cartId nếu backend tạo mới
            } else {
                setCart(null); // Không có giỏ hàng, đặt về null
                removeStoredCartId(); // Xóa cartId cũ nếu không hợp lệ
            }
        } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
            setCartError('Không thể tải giỏ hàng. Vui lòng thử lại.');
            setCart(null); // Đặt giỏ hàng về null khi có lỗi
            removeStoredCartId(); // Xóa cartId nếu có lỗi khi fetch
        } finally {
            setLoadingCart(false);
        }
    }, []);

    // Tải giỏ hàng khi ứng dụng khởi tạo
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Đồng bộ wishlistItems với localStorage mỗi khi nó thay đổi
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);


    // --- HÀM XỬ LÝ GIỎ HÀNG ---
    const addToCart = async (product, quantity) => {
        setLoadingCart(true);
        setCartError(null);
        const currentCartId = getStoredCartId();

        try {
            const updatedCart = await cartService.addItemToCart(product.productId, quantity, currentCartId);
            setCart(updatedCart);
            setStoredCartId(updatedCart.cartId); // Luôn lưu cartId mới/cũ
            console.log("Giỏ hàng đã cập nhật:", updatedCart);
            return true;
        } catch (err) {
            console.error('Lỗi khi thêm vào giỏ hàng:', err.response ? err.response.data : err.message);
            setCartError(err.response ? err.response.data.message : 'Lỗi khi thêm sản phẩm vào giỏ hàng.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    };

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        setLoadingCart(true);
        setCartError(null);
        const currentCartId = getStoredCartId();
        if (!currentCartId) {
            setCartError("Không có ID giỏ hàng để cập nhật.");
            setLoadingCart(false);
            return false;
        }

        try {
            const updatedCart = await cartService.updateCartItemQuantity(currentCartId, cartItemId, newQuantity);
            setCart(updatedCart);
            console.log("Số lượng sản phẩm trong giỏ đã cập nhật:", updatedCart);
            return true;
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng:', err.response ? err.response.data : err.message);
            setCartError(err.response ? err.response.data.message : 'Lỗi khi cập nhật số lượng sản phẩm.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    };

    const removeCartItem = async (cartItemId) => {
        setLoadingCart(true);
        setCartError(null);
        const currentCartId = getStoredCartId();
        if (!currentCartId) {
            setCartError("Không có ID giỏ hàng để xóa.");
            setLoadingCart(false);
            return false;
        }

        try {
            const updatedCart = await cartService.removeCartItem(currentCartId, cartItemId);
            setCart(updatedCart);
            console.log("Sản phẩm đã xóa khỏi giỏ:", updatedCart);
            // Nếu giỏ hàng trống, xóa cartId khỏi localStorage
            if (updatedCart.cartItems.length === 0) {
                removeStoredCartId();
            }
            return true;
        } catch (err) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ:', err.response ? err.response.data : err.message);
            setCartError(err.response ? err.response.data.message : 'Lỗi khi xóa sản phẩm khỏi giỏ.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    };

    const clearCart = async () => {
        setLoadingCart(true);
        setCartError(null);
        const currentCartId = getStoredCartId();
        if (!currentCartId) {
            setCartError("Không có giỏ hàng để xóa.");
            setLoadingCart(false);
            return false;
        }

        try {
            await cartService.clearCart(currentCartId);
            setCart({ cartId: currentCartId, cartItems: [], totalAmount: 0, totalItems: 0 }); // Reset giỏ hàng trong state
            // Không xóa cartId khỏi localStorage vì giỏ hàng vẫn tồn tại trên server, chỉ là rỗng
            console.log("Giỏ hàng đã được làm trống.");
            return true;
        } catch (err) {
            console.error('Lỗi khi làm trống giỏ hàng:', err.response ? err.response.data : err.message);
            setCartError(err.response ? err.response.data.message : 'Lỗi khi làm trống giỏ hàng.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    };

    // --- HÀM XỬ LÝ YÊU THÍCH ---
    const addToWishlist = (product) => {
        setWishlistItems(prevItems => {
            if (prevItems.some(item => item.productId === product.productId)) {
                alert('Sản phẩm đã có trong danh sách yêu thích!');
                return prevItems;
            }
            const newItem = {
                productId: product.productId,
                name: product.name,
                imageUrl: product.imageUrl || (product.images && product.images[0]),
                price: product.price
            };
            return [...prevItems, newItem];
        });
    };

    const removeProductFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
    };


    const contextValue = {
        cart,
        loadingCart,
        cartError,
        wishlistItems,
        fetchCart, // Có thể dùng để tải lại giỏ hàng thủ công
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        addToWishlist,
        removeProductFromWishlist,
        cartTotalItems: cart ? cart.totalItems : 0, // Tổng số lượng mặt hàng để hiển thị trên icon giỏ hàng
        cartTotalAmount: cart ? cart.totalAmount : 0, // Tổng tiền để hiển thị
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};