import React from "react";
import "./UserProfile.css"; // nhớ import file css riêng!
import bannerImg from "../../assets/images/background.jpg";

const user = {
  name: "Mai Nguyễn Tiến Đạt",
  email: "tiendatyyy2005@gmail.com",
};

export default function UserProfile() {
  return (
    <div className="user-profile-page">
      {/* Banner */}
      <div className="user-banner">
        <img
          src={bannerImg} // thay bằng ảnh cover của bạn
          alt="banner"
          className="user-banner-img"
        />
        <div className="user-banner-overlay" />
        <div className="user-banner-content">
          <h1>Trang khách hàng</h1>
          <div className="breadcrumb">
            <span>Trang chủ</span> <span>&gt;</span>{" "}
            <span>Trang khách hàng</span>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="user-main-content container">
        <div className="user-menu">
          <h2>TRANG TÀI KHOẢN</h2>
          <p>
            <b>
              Xin chào, <span className="user-name-highlight">{user.name}</span>{" "}
              !
            </b>
          </p>
          <ul>
            <li className="muted">Thông tin tài khoản</li>
            <li>Đơn hàng của bạn</li>
            <li>Đổi mật khẩu</li>
            <li>Số địa chỉ (0)</li>
          </ul>
        </div>
        <div className="user-info">
          <h2>THÔNG TIN TÀI KHOẢN</h2>
          <p>
            <b>Họ tên:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
