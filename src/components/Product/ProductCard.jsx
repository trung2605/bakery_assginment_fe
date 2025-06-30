// src/components/Product/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // CSS riêng cho ProductCard

const ProductCard = ({ product }) => {
    // URL ảnh mặc định nếu product.imageUrl không tồn tại
    const defaultImageUrl = 'https://via.placeholder.com/200x200?text=No+Image';

    return (
        <div className="product-card">
            <Link to={`/products/${product.productId}`}>
                <img
                    src={product.imageUrl || defaultImageUrl}
                    alt={product.name}
                    className="product-image"
                    // Xử lý lỗi tải ảnh
                    onError={(e) => {
                        e.target.onerror = null; // Ngăn chặn vòng lặp lỗi
                        e.target.src = defaultImageUrl; // Thay thế bằng ảnh mặc định khi lỗi
                    }}
                />
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price ? product.price.toLocaleString('vi-VN') : 'N/A'} VNĐ</p>
                    {/* Bạn có thể thêm các thông tin khác như category, stock_quantity */}
                    {/* <p className="product-category">{product.category}</p> */}
                    {/* <p className="product-stock">Còn: {product.stockQuantity}</p> */}
                </div>
            </Link>
            {/* Có thể thêm nút "Thêm vào giỏ hàng" ở đây */}
            {/* <button className="btn btn-add-to-cart">Thêm vào giỏ</button> */}
        </div>
    );
};

export default ProductCard;