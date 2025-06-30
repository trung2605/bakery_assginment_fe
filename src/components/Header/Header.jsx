// src/components/Layout/Header.jsx

import React, { useState, useEffect } from "react"; // Import useState và useEffect
import { Link, useLocation } from "react-router-dom"; // Import useLocation để xử lý các trang khác nhau
import "./Header.css";
import { useCart } from "../../context/CartContext"; // Import useCart để lấy thông tin giỏ hàng
import { useAuth } from "../../context/AuthContext"; // Import useAuth để lấy thông tin người dùng

const Header = () => {
  const { cartTotalItems } = useCart();
  // State để theo dõi xem người dùng đã cuộn xuống đủ xa hay chưa
  const [scrolled, setScrolled] = useState(false);
  // Hook useLocation để lấy thông tin về đường dẫn hiện tại
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  // Hàm xử lý sự kiện cuộn
  const handleScroll = () => {
    // Kiểm tra xem người dùng đã cuộn xuống hơn 100px (hoặc một giá trị bạn muốn)
    const offset = window.scrollY;
    if (offset > 100) {
      // Ví dụ: cuộn 100px thì đổi màu
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    // Thêm event listener khi component mount
    window.addEventListener("scroll", handleScroll);

    // Xóa event listener khi component unmount để tránh rò rỉ bộ nhớ
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Chỉ chạy một lần khi mount và unmount

  // MỚI: Thêm useEffect để xử lý khi chuyển trang
  useEffect(() => {
    // Nếu trang hiện tại không phải trang chủ, luôn đặt header là scrolled (màu nền)
    // hoặc bạn có thể điều chỉnh theo logic riêng của mình
    if (location.pathname !== "/") {
      setScrolled(true); // Luôn có nền khi không ở trang chủ
    } else {
      // Khi trở về trang chủ, kiểm tra lại vị trí cuộn
      handleScroll();
    }
  }, [location.pathname]); // Chạy lại khi đường dẫn thay đổi

  // Sử dụng class động dựa trên trạng thái `scrolled` và `location.pathname`
  const headerClasses = `header-container ${scrolled ? "scrolled" : ""}`;

  return (
    <header className={headerClasses}>
      <div className="header-left">
        <Link to="/" className="logo-link">
          <div
            className="logo-image-element"
            aria-label="Dola Bakery Logo"
          ></div>
          <span className="logo-text">Dola Bakery</span> {/* */}
        </Link>
      </div>
      <nav className="header-nav">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/products">Sản phẩm</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
          <li>
            <Link to="/store-system">Hệ thống cửa hàng</Link>
          </li>{" "}
          {/* Thêm link này nếu có */}
          <li>
            <Link to="/news">Tin tức</Link>
          </li>{" "}
          {/* Thêm link này nếu có */}
        </ul>
      </nav>

      <div className="header-right">
                <div className="user-section">
                    {isAuthenticated ? (
                        <>
                            <span className="welcome-message">Xin chào, {user.firstName}!</span>
                            <button onClick={logout} className="logout-button">Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="auth-link">Đăng nhập / Đăng ký</Link>
                        </>
                    )}
                </div>
                <Link to="/cart" className="cart-icon">
                    <i className="fas fa-shopping-cart"></i> 
                    {cartTotalItems > 0 && <span className="cart-count">{cartTotalItems}</span>}
                </Link>
            </div>
    </header>
  );
};

export default Header;
