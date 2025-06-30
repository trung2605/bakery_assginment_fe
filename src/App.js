// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/Home/HomePage"; // Sẽ tạo ở bước tiếp theo
import "./App.css"; // Global CSS (nếu có)
import "./styles/global.css"; // Ví dụ một file CSS toàn cục khác
import UserProfile from "./pages/User/UserProfile";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          {" "}
          {/* Sử dụng thẻ main để bao bọc nội dung chính của trang */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Thêm các Route khác cho các trang Sản Phẩm, Tin Tức, v.v. */}
            {/* <Route path="/products" element={<ProductsPage />} /> */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* ... */}

            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
