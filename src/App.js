// src/App.js (hoặc App.tsx)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/Home/HomePage";
import ProductsPage from "./pages/Product/ProductsPage"; // Import ProductsPage
import ContactPage from "./pages/Contact/ContactPage"; // Import ContactPage

import Chatbot from "./components/Chatbot/Chatbot"; // Import component Chatbot
import "./styles/global.css";
import ProductDetail from "./pages/Product/ProductDetail/ProductDetail"; // Import ProductDetail
import CartPage from "./pages/Cart/CartPage"; // Import CartPage
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import AuthPage from "./pages/AuthPage"; // Import AuthPage
import "./styles/global.css";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <CartProvider>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
            <Chatbot /> {/* Thêm component Chatbot */}
            <Footer />
          </CartProvider>
        </AuthProvider>

      </div>
    </Router>
  );
}

export default App;
