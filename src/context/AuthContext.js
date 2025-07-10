// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AuthService from '../services/authService'; // Import AuthService
import { useNavigate } from 'react-router-dom'; // Để chuyển hướng sau khi đăng nhập/đăng ký

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate(); // Hook để điều hướng

    // State để lưu trữ thông tin người dùng, token và cartId của người dùng
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [userCartId, setUserCartId] = useState(null); // <-- Thêm state mới này
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải ban đầu

    // Khôi phục trạng thái từ localStorage khi khởi động
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            const storedUserCartId = localStorage.getItem('userCartId'); // <-- Lấy cartId từ localStorage

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // Gán userCartId nếu có trong localStorage
                if (storedUserCartId) {
                    setUserCartId(storedUserCartId);
                }
            }
        } catch (error) {
            console.error("Failed to load auth data from localStorage:", error);
            // Xóa dữ liệu lỗi để tránh vòng lặp và đảm bảo trạng thái sạch
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userCartId'); // <-- Đảm bảo xóa cả userCartId nếu có lỗi
        } finally {
            setIsLoading(false); // Đã hoàn thành tải ban đầu
        }
    }, []);

    // Hàm đăng nhập
    const login = useCallback(async (identifier, password) => {
        try {
            const response = await AuthService.login(identifier, password);
            const userData = response.data; // AuthResponse từ backend

            if (userData.successMessage) { // Backend trả về AuthResponse với successMessage
                // Cập nhật state user
                const userProfile = {
                    userId: userData.userId,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                };
                setUser(userProfile);
                setToken(userData.jwtToken);
                setUserCartId(userData.cartId); // <-- Cập nhật state userCartId từ response

                // Lưu thông tin người dùng, token và cartId vào localStorage
                localStorage.setItem('user', JSON.stringify(userProfile));
                localStorage.setItem('token', userData.jwtToken);
                localStorage.setItem('userCartId', userData.cartId); // <-- Lưu cartId vào localStorage

                // Quan trọng: Xóa guestCartId nếu có trong localStorage
                // Điều này đảm bảo rằng khi người dùng đăng nhập, họ sẽ sử dụng giỏ hàng cố định của mình
                // thay vì giỏ hàng tạm thời của khách.
                localStorage.removeItem('guestCartId');

                navigate('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
                return { success: true, message: userData.successMessage };
            } else {
                return { success: false, message: userData.errorMessage || "Đăng nhập thất bại." };
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.errorMessage || "Đã xảy ra lỗi khi đăng nhập." };
        }
    }, [navigate]);

    // Hàm đăng ký
    const register = useCallback(async (firstName, lastName, email, phone, password) => {
        try {
            const response = await AuthService.register(firstName, lastName, email, phone, password);
            const userData = response.data; // AuthResponse từ backend
            if (userData.successMessage) {
                // Sau khi đăng ký thành công, tự động đăng nhập
                // Điều này đảm bảo AuthContext sẽ nhận và lưu userCartId ngay lập tức.
                const loginResult = await login(email, password);
                
                if (loginResult.success) {
                    return { success: true, message: "Đăng ký và đăng nhập thành công!" };
                } else {
                    return { success: false, message: "Đăng ký thành công nhưng đăng nhập tự động thất bại: " + loginResult.message };
                }
            } else {
                return { success: false, message: userData.errorMessage || "Đăng ký thất bại." };
            }
        } catch (error) {
            console.error("Register error:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.errorMessage || "Đã xảy ra lỗi khi đăng ký." };
        }
    }, [login]); // login là dependency vì chúng ta gọi nó

    // Hàm đăng xuất
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setUserCartId(null); // <-- Xóa userCartId khi đăng xuất
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userCartId'); // <-- Xóa userCartId từ localStorage
        localStorage.removeItem('guestCartId'); // <-- Xóa guestCartId (đảm bảo sạch sẽ)
        navigate('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    }, [navigate]);

    const value = {
        user,
        token,
        userCartId, // <-- Cung cấp userCartId qua context để các component khác có thể truy cập
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user, // Kiểm tra xem người dùng đã đăng nhập chưa
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children} {/* Chỉ render children khi đã hoàn thành tải */}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};