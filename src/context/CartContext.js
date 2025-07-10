import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Lấy user, isAuthenticated, và userCartId từ AuthContext
import { getCart, addItemToCart, updateItemQuantity, removeCartItem, clearCart } from '../services/cartService'; // Loại bỏ createGuestCart

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    // Lấy thông tin xác thực từ AuthContext
    const { isAuthenticated, userCartId } = useAuth(); // Chỉ cần isAuthenticated và userCartId

    const [cart, setCart] = useState(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);

    // State cho wishlist, giữ nguyên logic cũ của bạn
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
        setLoadingCart(true);
        setCartError(null);

        // Giỏ hàng chỉ tồn tại nếu người dùng đã đăng nhập và có userCartId
        if (!isAuthenticated || !userCartId) {
            console.log("Người dùng chưa đăng nhập hoặc không có cartId, không tải giỏ hàng.");
            setCart(null); // Đảm bảo giỏ hàng là null
            setCartError('Bạn cần đăng nhập để xem giỏ hàng.');
            setLoadingCart(false);
            return;
        }

        try {
            console.log("Tải giỏ hàng với userCartId:", userCartId);
            const fetchedCart = await getCart(userCartId); // Chỉ dùng userCartId
            if (fetchedCart && fetchedCart.cartId) {
                setCart(fetchedCart);
            } else {
                setCart(null);
                setCartError('Giỏ hàng không hợp lệ. Vui lòng kiểm tra lại hoặc đăng nhập lại.');
            }
        } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
            setCartError(err.message || 'Không thể tải giỏ hàng. Vui lòng thử lại.');
            setCart(null);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, userCartId]); // Dependencies: isAuthenticated và userCartId


    // Effect để tải giỏ hàng khi người dùng đăng nhập/đăng xuất hoặc userCartId thay đổi
    useEffect(() => {
        fetchCart();
    }, [fetchCart]); // Chỉ cần fetchCart làm dependency vì nó đã bao gồm isAuthenticated và userCartId


    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = useCallback(async (productId, quantity = 1) => {
        setLoadingCart(true);
        setCartError(null);

        if (!isAuthenticated || !userCartId) {
            setCartError('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
            setLoadingCart(false);
            return false;
        }

        console.log("Kiểm tra số lượng:", quantity);
        console.log("Kiểm tra userCartId:", userCartId);

        try {
            console.log("Thêm sản phẩm vào giỏ:", userCartId, productId, quantity);
            const updatedCart = await addItemToCart(userCartId, productId, quantity);
            setCart(updatedCart);
            console.log('Sản phẩm đã được thêm vào giỏ:', updatedCart);
            return true;
        } catch (err) {
            console.error('Lỗi khi thêm vào giỏ hàng:', err);
            setCartError(err.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, userCartId]); // Dependencies


    // Các hàm update, remove, clear tương tự, chỉ cần đảm bảo dùng userCartId
    const updateCartItemQuantity = useCallback(async (cartItemId, newQuantity) => {
        setLoadingCart(true);
        setCartError(null);

        if (!isAuthenticated || !userCartId) {
            setCartError('Bạn cần đăng nhập để cập nhật giỏ hàng.');
            setLoadingCart(false);
            return false;
        }
        if (newQuantity <= 0) {
            setCartError('Số lượng phải lớn hơn 0.');
            setLoadingCart(false);
            return false;
        }

        try {
            const updatedCart = await updateItemQuantity(userCartId, cartItemId, newQuantity);
            if (updatedCart) {
                setCart(updatedCart);
                console.log('Số lượng đã được cập nhật:', updatedCart);
                return true;
            } else {
                setCartError('Mục giỏ hàng không tồn tại hoặc đã bị xóa.');
                return false;
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng:', err);
            setCartError(err.message || 'Lỗi khi cập nhật số lượng sản phẩm.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, userCartId]);

    const removeCartItem = useCallback(async (cartItemId) => {
        setLoadingCart(true);
        setCartError(null);

        if (!isAuthenticated || !userCartId) {
            setCartError('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.');
            setLoadingCart(false);
            return false;
        }

        try {
            const updatedCart = await removeCartItem(userCartId, cartItemId);
            if (updatedCart) {
                setCart(updatedCart);
                console.log('Sản phẩm đã được xóa khỏi giỏ:', updatedCart);
                return true;
            } else {
                setCartError('Mục giỏ hàng không tồn tại.');
                return false;
            }
        } catch (err) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ:', err);
            setCartError(err.message || 'Lỗi khi xóa sản phẩm khỏi giỏ.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, userCartId]);

    const clearCartFunc = useCallback(async () => {
        setLoadingCart(true);
        setCartError(null);

        if (!isAuthenticated || !userCartId) {
            setCartError('Bạn cần đăng nhập để làm trống giỏ hàng.');
            setLoadingCart(false);
            return false;
        }

        try {
            const emptiedCart = await clearCart(userCartId);
            setCart(emptiedCart);
            console.log('Giỏ hàng đã được làm trống.');
            return true;
        } catch (err) {
            console.error('Lỗi khi làm trống giỏ hàng:', err);
            setCartError(err.message || 'Lỗi khi làm trống giỏ hàng.');
            return false;
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, userCartId]);

    // Các hàm xử lý wishlist (giữ nguyên)
    const addToWishlist = (product) => {
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
    };

    const removeProductFromWishlist = (productId) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    };

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
        cartTotalItems: cart ? cart.totalItems : 0,
        cartTotalAmount: cart ? cart.totalAmount : 0,
    };

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};