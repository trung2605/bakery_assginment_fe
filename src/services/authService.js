import axios from 'axios';

// Base URL của API backend AuthController
const API_URL = 'https://bakery-assginment-be.onrender.com/api/auth'; // Đảm bảo đúng với cổng backend của bạn

const register = (firstName, lastName, email, phone, password) => {
    return axios.post(`${API_URL}/register`, {
        firstName,
        lastName,
        email,
        phone,
        password,
    });
};

const login = (identifier, password) => {
    return axios.post(`${API_URL}/login`, {
        identifier, // Có thể là email hoặc phone
        password,
    });
};

const AuthService = {
    register,
    login,
};

export default AuthService;