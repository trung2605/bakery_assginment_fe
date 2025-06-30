import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css'; // File CSS cho cả hai form

const LoginForm = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        identifier: '', // Có thể là email hoặc phone
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu nhập
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(formData.identifier, formData.password);
        setLoading(false);

        if (!result.success) {
            setError(result.message);
        }
        // Nếu thành công, AuthContext đã tự động chuyển hướng
    };

    return (
        <div className="auth-form-container">
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="identifier">Email hoặc SĐT:</label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;