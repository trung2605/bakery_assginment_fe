// src/pages/ProductsPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService'; // Đảm bảo đúng đường dẫn
import './ProductsPage.css'; // File CSS riêng cho trang này
import ProductCard from '../../components/Product/ProductCard'; // Component ProductCard riêng

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [highlightedProducts, setHighlightedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingHighlights, setLoadingHighlights] = useState(true);
    const [error, setError] = useState(null);
    const [errorHighlights, setErrorHighlights] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('productId');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedPriceRange, setSelectedPriceRange] = useState('All');
    const [highlightCategories, setHighlightCategories] = useState([]);

    // MỚI: States cho phân trang
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại (backend dùng 0-indexed)
    const [itemsPerPage, setItemsPerPage] = useState(9); // Số sản phẩm trên mỗi trang
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalElements, setTotalElements] = useState(0); // Tổng số sản phẩm
    

    useEffect(() => {
        const fetchHighlightCategories = async () => {
            try {
                // lấy 4 bánh có id từ 1 đến 4 làm ví dụ
                const response = await productService.getProductsByCategory('Bánh Ngọt');
                // Giả sử API trả về danh sách sản phẩm, ta sẽ lấy 4 sản phẩm đầu tiên
                const categories = response.slice(0, 4).map(product => ({
                    name: product.name,
                    imageUrl: product.imageUrl // Ảnh mặc định nếu không có
                }));

                // Cập nhật state với danh sách category nổi bật
                setHighlightCategories(categories);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách category nổi bật:", error);
            }
        };

        fetchHighlightCategories();
    }, []);

    // Dummy data cho danh sách category bên sidebar
    const sidebarCategories = [
        'Bánh kem', 'Bánh mì', 'Bánh ngọt', 'Bánh tráng miệng',
        'Bánh khô', 'Bánh đông lạnh', 'Bánh theo mùa', 'Đồ uống'
    ];

        const priceRanges = [
        { label: 'Tất cả', min: null, max: null, value: 'All' },
        { label: 'Dưới 10.000₫', min: 0, max: 9999, value: '0-10000' },
        { label: 'Từ 10.000₫ - 50.000₫', min: 10000, max: 50000, value: '10000-50000' },
        { label: 'Từ 50.000₫ - 100.000₫', min: 50000, max: 100000, value: '50000-100000' },
        { label: 'Từ 100.000₫ - 200.000₫', min: 100000, max: 200000, value: '100000-200000' },
        { label: 'Từ 200.000₫ - 300.000₫', min: 200000, max: 300000, value: '200000-300000' },
        { label: 'Từ 300.000₫ - 500.000₫', min: 300000, max: 500000, value: '300000-500000' },
        { label: 'Từ 500.000₫ - 1 triệu', min: 500000, max: 1000000, value: '500000-1000000' },
        { label: 'Trên 1 triệu', min: 1000000, max: null, value: '1000000-null' }, // max: null cho "trên X"
    ];

   useEffect(() => {
        const fetchPaginatedProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                const priceRange = priceRanges.find(range => range.value === selectedPriceRange);

                if (priceRange && (priceRange.min !== null || priceRange.max !== null)) {
                    // Lọc theo khoảng giá
                    response = await productService.getPaginatedProductsByPriceRange(
                        priceRange.min,
                        priceRange.max,
                        currentPage,
                        itemsPerPage,
                        sortBy,
                        sortDirection
                    );
                    // Nếu có thêm lọc category, sẽ cần lọc trên client-side hoặc backend API phức tạp hơn
                    if (selectedCategory !== 'All') {
                        response.content = response.content.filter(p => p.category === selectedCategory);
                        // Lưu ý: totalPages và totalElements sẽ không chính xác sau khi lọc client-side
                        // Đây là lý do cần API backend tổng hợp.
                    }
                } else if (selectedCategory !== 'All') {
                    // Lọc theo category
                    response = await productService.getPaginatedProductsByCategory(
                        selectedCategory,
                        currentPage,
                        itemsPerPage,
                        sortBy,
                        sortDirection
                    );
                } else {
                    // Lấy tất cả sản phẩm
                    response = await productService.getPaginatedProducts(
                        currentPage,
                        itemsPerPage,
                        sortBy,
                        sortDirection
                    );
                }

                setProducts(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);

            } catch (err) {
                console.error("Lỗi khi tải sản phẩm:", err);
                setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaginatedProducts();
    }, [currentPage, itemsPerPage, selectedCategory, selectedPriceRange, sortBy, sortDirection]);

 const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedPriceRange('All'); // Reset lọc giá khi thay đổi category
        setCurrentPage(0); // Reset về trang đầu tiên
    };

    const handlePriceRangeChange = (event) => {
        setSelectedPriceRange(event.target.value);
        setSelectedCategory('All'); // Reset lọc category khi thay đổi giá
        setCurrentPage(0); // Reset về trang đầu tiên
    };

    const handleSortChange = (newSortBy, newSortDirection) => {
        setSortBy(newSortBy);
        setSortDirection(newSortDirection);
        setCurrentPage(0); // Reset về trang đầu tiên
    };


     // MỚI: Hàm xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

     const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
    }
    return (
        <div className="products-page">
            {/* Breadcrumb / Banner */}
            <section className="product-page-hero">
                <div className="container text-center">
                    <h1>Tất cả sản phẩm</h1>
                    <p>
                        <Link to="/" className="breadcrumb-link">Trang chủ</Link>
                        {' > '}
                        <span className="breadcrumb-current">Tất cả sản phẩm</span>
                    </p>
                </div>
            </section>

            {/* Highlight Categories */}
            <section className="highlight-categories container">
                <div className="highlight-grid">
                    {highlightCategories.map((cat, index) => (
                        <div key={index} className="highlight-card" onClick={() => handleCategoryClick(cat.name)}>
                            <img src={cat.imageUrl} alt={cat.name} />
                            <h3>{cat.name}</h3>
                            <Link to="#" className="btn-small-outline">Xem ngay</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Content: Sidebar + Product List */}
            <div className="main-products-content container">
                <aside className="sidebar">
                    {/* Filter by Category */}
                    <div className="filter-section">
                        <h4>Danh mục sản phẩm</h4>
                        <ul>
                            <li className={selectedCategory === 'All' ? 'active' : ''} onClick={() => handleCategoryClick('All')}>
                                <i className="fas fa-box"></i> Tất cả sản phẩm
                            </li>
                            {sidebarCategories.map((cat, index) => (
                                <li key={index} className={selectedCategory === cat ? 'active' : ''} onClick={() => handleCategoryClick(cat)}>
                                    <i className="fas fa-caret-right"></i> {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Filter by Price (placeholder) */}
                    <div className="filter-section">
                        <h4>Chọn mức giá</h4>
                        <ul>
                            {priceRanges.map((range) => (
                                <li key={range.value}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            value={range.value}
                                            checked={selectedPriceRange === range.value}
                                            onChange={handlePriceRangeChange}
                                        />
                                        {range.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                   
                </aside>

                <div className="product-list-content">
                    {/* Sort Options */}
                    <div className="sort-options">
                        <span className="sort-label">Sắp xếp theo:</span>
                        <button
                            className={`sort-btn ${sortBy === 'name' && sortDirection === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('name', 'asc')}
                        >
                            Tên A-Z
                        </button>
                       
                        <button
                            className={`sort-btn ${sortBy === 'price' && sortDirection === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('price', 'asc')}
                        >
                            Giá thấp đến cao
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'price' && sortDirection === 'desc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('price', 'desc')}
                        >
                            Giá cao xuống thấp
                        </button>
                    </div>

                    {/* Product Grid */}
                    <div className="product-grid">
                        {loading && <p className="text-center">Đang tải sản phẩm...</p>}
                        {error && <p className="text-center error-message">{error}</p>}
                        {!loading && !error && (
                            products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product.productId} product={product} />
                                ))
                            ) : (
                                <p className="text-center">Không tìm thấy sản phẩm nào trong danh mục này.</p>
                            )
                        )}
                    </div>


                    {!loading && !error && totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                Trang trước
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => handlePageChange(number)}
                                >
                                    {number + 1} {/* Hiển thị 1-indexed cho người dùng */}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;