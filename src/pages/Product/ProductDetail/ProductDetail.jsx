// src/page/ProductDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import productService from '../../../services/productService'; // Import productService
import './ProductDetail.css'; // File CSS cho trang này

const ProductDetail = () => {
    const { productId } = useParams(); // Lấy productId từ URL

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(''); // State cho ảnh chính đang hiển thị

    const { addToCart, addToWishlist, wishlistItems } = useCart();

    // ------------------- LOGIC FETCH DỮ LIỆU SẢN PHẨM -------------------
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                // Gọi hàm getProductById từ productService
                const fetchedProduct = await productService.getProductById(productId);

                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    // Đặt ảnh chính ban đầu là ảnh đầu tiên từ dữ liệu
                    // Giả sử dữ liệu trả về có trường 'imageUrl' hoặc một mảng 'images'
                    setMainImage(fetchedProduct.imageUrl || (fetchedProduct.images && fetchedProduct.images[0]) || '/path/to/default_image.jpg');
                } else {
                    setProduct(null); // Không tìm thấy sản phẩm
                    setError("Không tìm thấy sản phẩm này."); // Cập nhật lỗi cụ thể hơn
                }
            } catch (err) {
                console.error("Lỗi khi fetch sản phẩm:", err);
                setError("Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) { // Đảm bảo productId có giá trị trước khi fetch
            fetchProduct();
        } else {
            setLoading(false);
            setError("Không có ID sản phẩm được cung cấp.");
        }
    }, [productId]); // Chạy lại useEffect khi productId thay đổi

    // ------------------- XỬ LÝ SỐ LƯỢNG -------------------
    const handleQuantityChange = (type) => {
        setQuantity(prev => {
            let newQuantity = prev;
            if (type === 'increment') {
                newQuantity = prev + 1;
            } else if (type === 'decrement') {
                newQuantity = Math.max(1, prev - 1); // Không cho phép số lượng dưới 1
            }
            // Kiểm tra số lượng tồn kho nếu có trường stockQuantity trong dữ liệu sản phẩm
            if (product && product.stockQuantity !== undefined && newQuantity > product.stockQuantity) {
                alert(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho.`);
                return product.stockQuantity; // Giới hạn số lượng bằng số lượng tồn kho
            }
            return newQuantity;
        });
    };

    // ------------------- XỬ LÝ THÊM VÀO GIỎ HÀNG -------------------
    const handleAddToCart = () => {
        if (product) {
            // Đảm bảo số lượng không vượt quá tồn kho nếu có
            if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
                alert(`Không đủ số lượng trong kho. Chỉ còn ${product.stockQuantity} sản phẩm.`);
                return;
            }
            addToCart(product, quantity); // Gọi hàm từ CartContext
            alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
        } else {
            alert("Không thể thêm sản phẩm vào giỏ hàng.");
        }
    };

    // ------------------- XỬ LÝ THÊM VÀO YÊU THÍCH -------------------
    const handleAddToWishlist = () => {
        if (product) {
            addToWishlist(product); // Gọi hàm từ CartContext
            alert(`Đã thêm ${product.name} vào danh sách yêu thích!`);
        } else {
            alert("Không thể thêm sản phẩm vào danh sách yêu thích.");
        }
    };

    const isInWishlist = product ? wishlistItems.some(item => item.productId === product.productId) : false;
    // Lưu ý: Đảm bảo trường ID của sản phẩm trong context và từ API là giống nhau.
    // Ở đây tôi giả định bạn dùng 'productId' làm ID duy nhất.

    // ------------------- HIỂN THỊ TRẠNG THÁI TẢI/LỖI -------------------
    if (loading) {
        return <div className="product-detail-container loading">Đang tải chi tiết sản phẩm...</div>;
    }

    if (error) {
        return <div className="product-detail-container error">{error}</div>;
    }

    if (!product) {
        return <div className="product-detail-container not-found">Không tìm thấy sản phẩm này.</div>;
    }

    // ------------------- RENDER GIAO DIỆN -------------------
    return (
        <>
        <section className="product-page-hero">
            <div className="container text-center">
                <h1>Tất cả sản phẩm</h1>
                <p>
                    <Link to="/" className="breadcrumb-link">Trang chủ</Link>
                    {' > '}
                    <span className="breadcrumb-current">Tất cả sản phẩm</span>
                </p>
            </div>
        </section>
        

        <div className="product-detail-page">
            
            {/* Breadcrumb */}
            <div className="breadcrumb-section">
                <Link to="/">Trang chủ</Link>
                <span> / </span>
                <Link to="/products">Sản phẩm</Link>
                <span> / </span>
                <span>{product.name}</span>
            </div>

            <div className="product-detail-main">
                {/* Product Image Gallery */}
                <div className="product-images">
                    <div className="main-image">
                        <img src={mainImage} alt={product.name} />
                    </div>
                    <div className="thumbnail-images">
                        {/* Render ảnh thumbnail. Giả sử `product.images` là một mảng URLs */}
                        {product.images && product.images.length > 0 ? (
                            product.images.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`${product.name} - ${index + 1}`}
                                    className={imgUrl === mainImage ? 'active' : ''}
                                    onClick={() => setMainImage(imgUrl)}
                                />
                            ))
                        ) : (
                            // Fallback nếu chỉ có một imageUrl chính
                            product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className={product.imageUrl === mainImage ? 'active' : ''}
                                    onClick={() => setMainImage(product.imageUrl)}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="product-meta">
                        Loại: <span>{product.category || 'Không xác định'}</span> | Tình trạng: <span>{product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                    </p>

                    <div className="price-section">
                        {/* Định dạng giá tiền cho hiển thị người dùng */}
                        <span className="current-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                        {product.oldPrice && product.oldPrice > product.price && (
                            <>
                                <span className="original-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}</span>
                                <p className="save-amount">
                                    Tiết kiệm: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice - product.price)}</span>
                                </p>
                            </>
                        )}
                    </div>

                    <div className="quantity-selector">
                        <label htmlFor="quantity-input">Số lượng:</label>
                        <div className="quantity-input-group">
                            <button onClick={() => handleQuantityChange('decrement')}>-</button>
                            <input
                                type="number"
                                id="quantity-input"
                                value={quantity}
                                min="1"
                                // Đảm bảo số lượng không vượt quá tồn kho nếu có
                                max={product.stockQuantity !== undefined ? product.stockQuantity : 9999}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (isNaN(val) || val < 1) {
                                        setQuantity(1);
                                    } else if (product.stockQuantity !== undefined && val > product.stockQuantity) {
                                        setQuantity(product.stockQuantity);
                                        alert(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho.`);
                                    } else {
                                        setQuantity(val);
                                    }
                                }}
                            />
                            <button onClick={() => handleQuantityChange('increment')}>+</button>
                        </div>
                    </div>

                    <div className="product-actions">
                        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stockQuantity <= 0}>
                            <i className="fas fa-shopping-bag"></i> THÊM VÀO GIỎ
                            
                        </button>
                        <button
                            className="add-to-wishlist-btn"
                            onClick={handleAddToWishlist}
                            disabled={isInWishlist}
                        >
                            <i className="fas fa-heart"></i> {isInWishlist ? 'Đã trong Yêu thích' : 'YÊU THÍCH'}
                            {!isInWishlist && <span></span>}
                        </button>
                    </div>

                    {/* Promotions Section */}
                    <div className="promotions-section">
                        <h3><i className="fas fa-gift"></i> Khuyến mãi đặc biệt!!!</h3>
                        <ul>
                            <li>Áp dụng Phiếu quà tặng / Mã giảm giá theo ngành hàng</li>
                            <li>Giảm giá 10% khi mua từ 5 sản phẩm trở lên.</li>
                            <li>Tặng 100.000₫ mua hàng tại website thành viên Dola Fashion Accessories, áp dụng khi mua Online tại Hồ Chí Minh và 1 số khu vực khác.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Service & Policy Section */}
            <div className="service-policy-section">
                <div className="policy-item">
                    <img src="/assets/images/shipping-icon.png" alt="Miễn phí vận chuyển" />
                    <h4>Miễn phí vận chuyển</h4>
                    <p>Áp dụng free ship cho tất cả đơn hàng từ 300 nghìn</p>
                </div>
                <div className="policy-item">
                    <img src="/assets/images/return-icon.png" alt="Đổi trả dễ dàng" />
                    <h4>Đổi trả dễ dàng</h4>
                    <p>Đổi ngay trong ngày nếu như bánh không đúng yêu cầu</p>
                </div>
                <div className="policy-item">
                    <img src="/assets/images/support-icon.png" alt="Hỗ trợ nhanh chóng" />
                    <h4>Hỗ trợ nhanh chóng</h4>
                    <p>Gọi Hotline 19006750 để được hỗ trợ ngay</p>
                </div>
                <div className="policy-item">
                    <img src="/assets/images/payment-icon.png" alt="Thanh toán đa dạng" />
                    <h4>Thanh toán đa dạng</h4>
                    <p>Thanh toán khi nhận hàng, Napas, Visa, Chuyển khoản</p>
                </div>
            </div>

            {/* Product Description */}
            {product.description && (
                <div className="product-description">
                    <h2>Mô tả sản phẩm</h2>
                    <p>{product.description}</p>
                </div>
            )}
        </div>
        </>
    );
};

export default ProductDetail;