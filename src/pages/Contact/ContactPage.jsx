// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import contactService from '../../services/contactService';
import './ContactPage.css';
import { useInView } from 'react-intersection-observer'; // MỚI: Import useInView

const ContactPage = () => {
    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    // State cho các thông báo phản hồi (thành công/lỗi)
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'loading'
    const [submitMessage, setSubmitMessage] = useState('');

    // MỚI: Hooks cho Intersection Observer
    const { ref: infoRef, inView: infoInView } = useInView({
        triggerOnce: true, // Animation chỉ chạy một lần khi vào viewport
        threshold: 0.1,    // Kích hoạt khi 10% phần tử hiển thị
    });

    const { ref: formRef, inView: formInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Xử lý gửi form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form

        setSubmitStatus('loading');
        setSubmitMessage('Đang gửi thông tin...');

        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
            setSubmitStatus('error');
            setSubmitMessage('Vui lòng điền đầy đủ tất cả các trường bắt buộc.');
            return;
        }

        try {
            // Gọi service để gửi dữ liệu
            const response = await contactService.sendContactForm(formData);
            console.log('Phản hồi từ SheetDB:', response);

            setSubmitStatus('success');
            setSubmitMessage('Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.');
            // Xóa form sau khi gửi thành công
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
            console.error('Lỗi khi gửi form liên hệ:', error);
        }
    };

    return (
        <div className="contact-page">
            {/* Breadcrumb / Banner */}
            <section className="contact-page-hero">
                <div className="container text-center">
                    <h1>Liên hệ với chúng tôi</h1>
                    <p>
                        <Link to="/" className="breadcrumb-link">Trang chủ</Link>
                        {' > '}
                        <span className="breadcrumb-current">Liên hệ</span>
                    </p>
                </div>
            </section>

            <div className="contact-content container">
                {/* Store Information */}
                <section
                    ref={infoRef} // Gắn ref cho section
                    className={`store-info fade-in-section ${infoInView ? 'is-visible' : ''}`} // Thêm class cho animation
                >
                    <h2 className="section-title">Cửa hàng Dola Bakery</h2>
                    <div className="info-grid">
                        
                        <div className="info-item">
                            <i className="fas fa-clock"></i>
                            <div className="info-text">
                                <h3>Thời gian làm việc</h3>
                                <p>8h - 22h</p>
                                <p>Từ thứ 2 đến chủ nhật</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-phone-alt"></i>
                            <div className="info-text">
                                <h3>Hotline</h3>
                                <p>1900 6750</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-envelope"></i>
                            <div className="info-text">
                                <h3>Email</h3>
                                <p>support@sapo.vn</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section
                    ref={formRef} // Gắn ref cho section
                    className={`contact-form-section fade-in-section ${formInView ? 'is-visible' : ''}`} // Thêm class cho animation
                >
                    <h2 className="section-title">Liên hệ với chúng tôi</h2>
                    <p className="form-description">
                        Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể.
                    </p>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Họ và tên <span className="required-star">*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên của bạn"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email <span className="required-star">*</span></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ email của bạn"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Điện thoại <span className="required-star">*</span></label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại của bạn"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Nội dung <span className="required-star">*</span></label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Nhập nội dung tin nhắn của bạn"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        {submitStatus && (
                            <div className={`submit-message ${submitStatus}`}>
                                {submitMessage}
                            </div>
                        )}
                        <button type="submit" className="submit-btn" disabled={submitStatus === 'loading'}>
                            {submitStatus === 'loading' ? 'Đang gửi...' : 'Gửi thông tin'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;