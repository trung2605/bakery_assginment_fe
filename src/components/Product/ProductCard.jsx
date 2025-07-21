import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  const { addToCart, cartError } = useCart();
  const { cartId } = useAuth(); // Lấy cartId từ AuthContext
  const [adding, setAdding] = useState(false);

  const [quantity, setQuantity] = useState(1);

 const handleAddToCart = () => {
    if (product) {
      // Đảm bảo số lượng không vượt quá tồn kho nếu có
      if (
        product.stockQuantity !== undefined &&
        quantity > product.stockQuantity
      ) {
        alert(
          `Không đủ số lượng trong kho. Chỉ còn ${product.stockQuantity} sản phẩm.`
        );
        return;
      }
      addToCart(product, quantity); // Gọi hàm từ CartContext
      alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
    } else {
      alert("Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };


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
        disabled={product.stockQuantity <= 0}
      >
        {adding ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  // 'product' là một đối tượng và là bắt buộc
  product: PropTypes.shape({
    productId: PropTypes.string.isRequired, // productId là chuỗi và bắt buộc
    name: PropTypes.string.isRequired, // name là chuỗi và bắt buộc
    description: PropTypes.string, // description là chuỗi (tùy chọn)
    price: PropTypes.number.isRequired, // price là số và bắt buộc
    stockQuantity: PropTypes.number, // stockQuantity là số (tùy chọn)
    category: PropTypes.string, // category là chuỗi (tùy chọn)
    imageUrl: PropTypes.string.isRequired, // imageUrl là chuỗi và bắt buộc
    expirationDate: PropTypes.string, // expirationDate là chuỗi (tùy chọn)
  }).isRequired, // Toàn bộ đối tượng 'product' là bắt buộc

  // 'onAddToCart' là một hàm và là bắt buộc
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
