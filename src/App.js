// src/App.js (hoặc App.tsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/HomePage';
import ProductsPage from './pages/Product/ProductsPage'; // Import ProductsPage
import ContactPage from './pages/Contact/ContactPage'; // Import ContactPage
import './styles/global.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} /> {/* Thêm route này */}
                        {/* Có thể thêm route cho trang chi tiết sản phẩm nếu muốn */}
                        {/* <Route path="/products/:productId" element={<ProductDetailPage />} /> */}
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;