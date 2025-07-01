import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import '../components/Auth/AuthForms.css'; // Tái sử dụng CSS

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true); // Mặc định hiển thị form đăng nhập

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-page">
            {isLogin ? <LoginForm /> : <RegisterForm />}
            <div className="auth-toggle">
                {isLogin ? (
                    <p>Chưa có tài khoản?
                        <button onClick={toggleForm}>Đăng ký ngay</button>
                    </p>
                ) : (
                    <p>Đã có tài khoản?
                        <button onClick={toggleForm}>Đăng nhập</button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthPage;