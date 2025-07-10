import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart, cartError } = useCart();
  const { cartId } = useAuth(); // Lấy cartId từ AuthContext
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (
      adding ||
      !cartId ||
      !product.stockQuantity ||
      product.stockQuantity <= 0
    ) {
      // Sử dụng alert tạm thời, nên thay bằng toast notification trong thực tế
      alert(
        "Lỗi: Chưa đăng nhập, hoặc sản phẩm đã hết hàng, hoặc đang xử lý. Vui lòng kiểm tra lại."
      );
      return; // Dừng hàm nếu có lỗi
    }

    setAdding(true); // Đặt trạng thái đang thêm để vô hiệu hóa nút
    const success = await addToCart(product.productId, 1);
    setAdding(false); // Đặt lại trạng thái sau khi thêm xong

    if (success) {
      alert(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
    } else {
      alert(
        cartError || "Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."
      );
    }
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.productId}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
          }}
        />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">
            {product.price ? product.price.toLocaleString("vi-VN") : "N/A"} VNĐ
          </p>
          {product.stockQuantity !== undefined && (
            <p className="product-stock">Còn: {product.stockQuantity}</p>
          )}
        </div>
      </Link>
      <button
        className="btn btn-add-to-cart"
        onClick={handleAddToCart}
        disabled={
          adding ||
          !cartId ||
          !product.stockQuantity ||
          product.stockQuantity <= 0
        }
      >
        {adding ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>
    </div>
  );
};

export default ProductCard;
