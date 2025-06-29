// src/components/Header/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // File CSS cho Header

const Header = () => {
    return (
        <header className="header-container">
            <div className="header-left">
                <Link to="/" className="logo">
                    <img src="/assets/images/logo.png" alt="Dola Bakery Logo" className="logo-img" />
                    {/* Hoặc chỉ là text nếu bạn chưa có file logo.png */}
                    {/* <span>Dola Bakery</span> */}
                </Link>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/">Trang Chủ</Link></li>
                    <li><Link to="/products">Sản Phẩm</Link></li>
                    <li><Link to="/news">Tin Tức</Link></li>
                    <li><Link to="/contact">Liên Hệ</Link></li>
                    <li><Link to="/branches">Hệ Thống Cửa Hàng</Link></li>
                </ul>
            </nav>
            <div className="header-right">
                {/* Đây là nơi bạn sẽ thêm các biểu tượng */}
                <Link to="/search" className="icon-link"><i className="fas fa-search"></i></Link> {/* Font Awesome */}
                <Link to="/cart" className="icon-link"><i className="fas fa-shopping-cart"></i></Link>
                <Link to="/favorites" className="icon-link"><i className="fas fa-heart"></i></Link>
                <Link to="/profile" className="icon-link"><i className="fas fa-user"></i></Link>
            </div>
        </header>
    );
};

export default Header;