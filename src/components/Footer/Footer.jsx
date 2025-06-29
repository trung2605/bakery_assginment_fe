// src/components/Footer/Footer.jsx

import React from 'react';
import './Footer.css'; // File CSS cho Footer

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Phần logo và giới thiệu ngắn (tùy chọn) */}
                <div className="footer-section footer-about">
                    <h3>Dola Bakery</h3>
                    <p>Mang đến những chiếc bánh tươi ngon và chất lượng nhất mỗi ngày.</p>
                </div>

                {/* Phần liên kết nhanh */}
                <div className="footer-section footer-links">
                    <h4>Liên kết nhanh</h4>
                    <ul>
                        <li><a href="/about">Về chúng tôi</a></li>
                        <li><a href="/privacy-policy">Chính sách bảo mật</a></li>
                        <li><a href="/terms-of-service">Điều khoản dịch vụ</a></li>
                        <li><a href="/faq">Câu hỏi thường gặp</a></li>
                    </ul>
                </div>

                {/* Phần liên hệ */}
                <div className="footer-section footer-contact">
                    <h4>Liên hệ</h4>
                    <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Đà Nẵng</p>
                    <p>Email: info@dolabakery.com</p>
                    <p>Điện thoại: 0123 456 789</p>
                </div>

                {/* Các icon mạng xã hội (tùy chọn) */}
                <div className="footer-section footer-social">
                    <h4>Theo dõi chúng tôi</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} Dola Bakery. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;