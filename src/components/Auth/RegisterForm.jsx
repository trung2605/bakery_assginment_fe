import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css'; // File CSS cho cả hai form

const RegisterForm = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu nhập
        setSuccessMessage(''); // Xóa thông báo thành công
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        const result = await register(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.phone,
            formData.password
        );
        setLoading(false);

        if (result.success) {
            setSuccessMessage(result.message);
            // Xóa form sau khi đăng ký thành công nếu bạn không tự động đăng nhập
            // setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Đăng Ký</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <div className="form-group">
                    <label htmlFor="firstName">Tên:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Họ:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Số điện thoại:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10,11}" // Ví dụ: 10-11 chữ số
                        title="Số điện thoại phải có 10 hoặc 11 chữ số."
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;