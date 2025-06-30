import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import "./HomePage.css";

// Hàm parseDays dùng chung cho sort expirationDate
const parseDays = (expDate) => {
  const match = expDate && expDate.match(/\d+/);
  return match ? parseInt(match[0], 10) : 999;
};

const HomePage = () => {
  // State cho sản phẩm nổi bật (Bánh Mì)
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);

  // State cho sản phẩm mới nhất
  const [latestProducts, setLatestProducts] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [errorLatest, setErrorLatest] = useState(null);

  // Lấy sản phẩm nổi bật (ví dụ: Bánh Mì)
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getProductsByCategory("Bánh Mì");
        // response có thể là object {data: Array} hoặc Array
        const list = Array.isArray(response) ? response : response.data;
        setFeaturedProducts(list.slice(0, 4));
        setLoadingFeatured(false);
      } catch (err) {
        setErrorFeatured(
          "Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau."
        );
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Lấy bánh mới nhất
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        // Nếu response là object có data, dùng response.data
        const list = Array.isArray(response) ? response : response.data;
        const sorted = list
          .slice()
          .sort(
            (a, b) => parseDays(a.expirationDate) - parseDays(b.expirationDate)
          );
        setLatestProducts(sorted); // Không giới hạn số lượng nữa!
        setLoadingLatest(false);
      } catch (err) {
        setErrorLatest("Không thể tải bánh mới nhất.");
        setLoadingLatest(false);
        console.log("Lỗi lấy bánh mới nhất:", err); // log cả lỗi ra nếu có
      }
    };
    fetchLatestProducts();
  }, []);

  // Card chung hiển thị sản phẩm
  const ProductCard = ({ product }) => (
    <div className="product-card">
      <Link to={`/products/${product.productId}`}>
        <img
          src={
            product.imageUrl ||
            "https://bizweb.dktcdn.net/100/492/035/themes/919334/assets/logo.png?1735117293436"
          }
          alt={product.name}
        />
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">
          {product.price.toLocaleString("vi-VN")} VNĐ
        </p>
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
          <Link to="/products" className="btn btn-primary">
            Xem ngay
          </Link>
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
        {loadingFeatured && <p className="text-center">Đang tải sản phẩm...</p>}
        {errorFeatured && (
          <p className="text-center error-message">{errorFeatured}</p>
        )}
        {!loadingFeatured && !errorFeatured && (
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))
            ) : (
              <p className="text-center">Không có sản phẩm nào để hiển thị.</p>
            )}
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-outline">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* 4. Latest Products Section */}
      <section className="latest-products-section container">
        <h2 className="section-title">Bánh mới nhất</h2>
        {loadingLatest && (
          <p className="text-center">Đang tải bánh mới nhất...</p>
        )}
        {errorLatest && (
          <p className="text-center error-message">{errorLatest}</p>
        )}
        {!loadingLatest && !errorLatest && (
          <div className="latest-products-grid">
            {latestProducts.length > 0 ? (
              latestProducts.slice(0, 5).map(
                (
                  product // <-- Thêm .slice(0, 5) ở đây
                ) => (
                  <div key={product.productId} className="latest-product-card">
                    <div className="badge-row">
                      {product.discount && (
                        <span className="badge-discount">
                          -{product.discount}%
                        </span>
                      )}
                      <span className="badge-new">New</span>
                    </div>
                    <Link to={`/products/${product.productId}`}>
                      <img src={product.imageUrl} alt={product.name} />
                      <div className="latest-product-info">
                        <h3>{product.name}</h3>
                        <div className="latest-product-prices">
                          <span className="product-price">
                            {product.price.toLocaleString("vi-VN")}₫
                          </span>
                          {product.oldPrice && (
                            <span className="product-old-price">
                              {product.oldPrice.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              )
            ) : (
              <p className="text-center">Không có bánh mới nhất để hiển thị.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
