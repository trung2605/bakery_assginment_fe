// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService'// Import service để gọi API
import './HomePage.css'; // File CSS riêng cho HomePage

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Ví dụ: Lấy 4 sản phẩm bất kỳ hoặc theo một danh mục cụ thể cho phần nổi bật
                // Hiện tại, API backend của chúng ta chưa có endpoint lấy "featured products" hoặc limit số lượng.
                // Tạm thời, tôi sẽ gọi `getProductsByCategory` để lấy "Bánh Ngọt" như một ví dụ.
                // Trong thực tế, bạn có thể cần một endpoint mới ở backend hoặc lọc ở frontend.
                const response = await productService.getProductsByCategory('Bánh Mì');
                // Lấy tối đa 4 sản phẩm để hiển thị ở trang chủ
                setFeaturedProducts(response.data.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm nổi bật:", err);
                setError("Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    // Component nhỏ để hiển thị một thẻ sản phẩm
    const ProductCard = ({ product }) => (
        <div className="product-card">
            <Link to={`/products/${product.productId}`}>
                <img src={product.imageUrl || 'https://bizweb.dktcdn.net/100/492/035/themes/919334/assets/logo.png?1735117293436'} alt={product.name} />
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                {/* Có thể thêm nút "Thêm vào giỏ hàng" */}
            </Link>
        </div>
    );

    return (
        <div className="home-page">
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Bánh tươi mỗi ngày</h1>
                    <p>Giảm 20% đơn đầu tiên khi đăng ký thành viên</p>
                    <Link to="/products" className="btn btn-primary">Xem ngay</Link>
                </div>
            </section>

            {/* 2. Features Section */}
            <section className="features-section container">
                <div className="feature-item">
                    <i className="fas fa-truck feature-icon"></i>
                    <h3>Miễn phí vận chuyển</h3>
                    <p>Áp dụng cho đơn hàng từ 500 nghìn</p>
                </div>
                <div className="feature-item">
                    <i className="fas fa-undo-alt feature-icon"></i>
                    <h3>Đổi trả dễ dàng</h3>
                    <p>Đổi ngay trong ngày nếu như bánh không đúng yêu cầu</p>
                </div>
                <div className="feature-item">
                    <i className="fas fa-headset feature-icon"></i>
                    <h3>Hỗ trợ nhanh chóng</h3>
                    <p>Hotline 19001900 để được hỗ trợ ngay</p>
                </div>
                <div className="feature-item">
                    <i className="fas fa-credit-card feature-icon"></i>
                    <h3>Thanh toán đa dạng</h3>
                    <p>Thanh toán khi nhận hàng, Napas, Visa, Chuyển khoản</p>
                </div>
            </section>

            {/* 3. Featured Products Section */}
            <section className="featured-products-section container">
                <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
                {loading && <p className="text-center">Đang tải sản phẩm...</p>}
                {error && <p className="text-center error-message">{error}</p>}
                {!loading && !error && (
                    <div className="products-grid">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <ProductCard key={product.productId} product={product} />
                            ))
                        ) : (
                            <p className="text-center">Không có sản phẩm nào để hiển thị.</p>
                        )}
                    </div>
                )}
                <div className="text-center mt-4">
                    <Link to="/products" className="btn btn-outline">Xem tất cả sản phẩm</Link>
                </div>
            </section>

           
        </div>
    );
};

export default HomePage;