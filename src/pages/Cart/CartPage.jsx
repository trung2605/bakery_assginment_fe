// src/page/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css'; // Tạo file CSS riêng cho CartPage

const CartPage = () => {
    const { cart, loadingCart, cartError, updateCartItemQuantity, removeCartItem, clearCart, fetchCart } = useCart();

    if (loadingCart) {
        return <div className="cart-container loading">Đang tải giỏ hàng...</div>;
    }

    if (cartError) {
        return <div className="cart-container error">Lỗi: {cartError}</div>;
    }

    // Đảm bảo cart và cart.cartItems không null trước khi render
    const cartItems = cart ? cart.cartItems : [];
    const totalAmount = cart ? cart.totalAmount : 0;

    return (
        <div className="cart-page">
            <div className="breadcrumb-section">
                <Link to="/">Trang chủ</Link>
                <span> / </span>
                <span>Giỏ hàng</span>
            </div>

            <h1>Giỏ hàng của bạn</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <Link to="/products" className="continue-shopping-btn">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        <div className="cart-header">
                            <span className="col-product">Sản phẩm</span>
                            <span className="col-price">Đơn giá</span>
                            <span className="col-quantity">Số lượng</span>
                            <span className="col-subtotal">Thành tiền</span>
                            <span className="col-actions"></span>
                        </div>
                        {cartItems.map((item) => (
                            <div key={item.cartItemId} className="cart-item">
                                <div className="col-product">
                                    <img src={item.productImage} alt={item.productName} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <Link to={`/products/${item.productId}`} className="cart-item-name">{item.productName}</Link>
                                        <button className="remove-item-text-btn" onClick={() => removeCartItem(item.cartItemId)}>Xóa</button>
                                    </div>
                                </div>
                                <div className="col-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceAtAddition)}</div>
                                <div className="col-quantity quantity-selector">
                                    <button onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => {
                                            const newQty = parseInt(e.target.value);
                                            if (!isNaN(newQty) && newQty >= 1) {
                                                updateCartItemQuantity(item.cartItemId, newQty);
                                            }
                                        }}
                                    />
                                    <button onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                                </div>
                                <div className="col-subtotal">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceAtAddition * item.quantity)}</div>
                                <div className="col-actions">
                                    <button className="remove-item-btn" onClick={() => removeCartItem(item.cartItemId)}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-and-promotions">
                        <div className="voucher-section">
                            <h2><i className="fas fa-tags"></i> Nhận voucher ngay !!!</h2>
                            <ul>
                                <li>Còn 245.000₫ để được nhận mã freeship <button className="copy-btn">Sao chép</button></li>
                                <li>Còn 645.000₫ để được nhận mã giảm 20.000₫ <button className="copy-btn">Sao chép</button></li>
                                <li>Còn 945.000₫ để được nhận mã giảm 50.000₫ <button className="copy-btn">Sao chép</button></li>
                            </ul>
                        </div>

                        <div className="cart-total">
                            <h3>Tổng tiền:</h3>
                            <span className="total-amount">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                            <button className="checkout-btn" onClick={() => alert('Chuyển đến trang thanh toán!')}>Thanh toán</button>
                            <button className="clear-cart-btn" onClick={clearCart}>Xóa tất cả</button>
                        </div>

                        <div className="delivery-time-section">
                            <h3>Thời gian giao hàng</h3>
                            <div className="delivery-options">
                                <select>
                                    <option>Chọn ngày</option>
                                    {/* Các option ngày */}
                                </select>
                                <select>
                                    <option>Chọn thời gian</option>
                                    {/* Các option giờ */}
                                </select>
                            </div>
                            <label className="invoice-checkbox">
                                <input type="checkbox" /> Xuất hóa đơn công ty
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;