// src/components/Chatbot/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css'; // File CSS cho chatbot
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import ReactMarkdown from 'react-markdown'; // Import thư viện

const CHATBOT_API_BASE_URL = 'http://localhost:8080/api/chatbot'; // URL của backend Spring Boot

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở chatbot
    const [messages, setMessages] = useState([]); // Lịch sử tin nhắn
    const [inputMessage, setInputMessage] = useState(''); // Tin nhắn người dùng nhập
    const [isLoading, setIsLoading] = useState(false); // Trạng thái đang tải phản hồi
    const messagesEndRef = useRef(null); // Ref để cuộn xuống cuối khung chat

    // Cuộn xuống cuối khung chat mỗi khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Kích hoạt khi `messages` thay đổi

    // Tải tin nhắn chào mừng khi chatbot mở lần đầu
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchGreetingMessage();
        }
    }, [isOpen]);

    const fetchGreetingMessage = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${CHATBOT_API_BASE_URL}/greet`);
            const data = await response.json();
            if (response.ok) {
                setMessages([data]); // Thêm tin nhắn chào mừng
            } else {
                console.error("Failed to fetch greeting message:", data);
                setMessages([{ text: "Xin lỗi, không thể kết nối với chatbot.", sender: "bot", timestamp: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }]);
            }
        } catch (error) {
            console.error("Error fetching greeting message:", error);
            setMessages([{ text: "Xin lỗi, có lỗi xảy ra khi tải tin nhắn chào mừng.", sender: "bot", timestamp: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        const newUserMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
        };

        // Cập nhật tin nhắn người dùng vào lịch sử ngay lập tức
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Chuẩn bị chat history để gửi lên backend
            // Backend mong đợi một mảng các đối tượng { text, sender, timestamp }
            const historyForBackend = messages.map(msg => ({
                text: msg.text,
                sender: msg.sender
                // timestamp không cần thiết cho backend, chỉ cần cho hiển thị UI
            }));

            const response = await fetch(`${CHATBOT_API_BASE_URL}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: inputMessage,
                    chatHistory: historyForBackend, // Gửi toàn bộ lịch sử để duy trì ngữ cảnh
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Cập nhật phản hồi của bot
                setMessages((prevMessages) => [...prevMessages, data]);
            } else {
                // Xử lý lỗi từ backend
                console.error("Error from chatbot API:", data);
                setMessages((prevMessages) => [...prevMessages, {
                    text: data.text || "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
                }]);
            }
        } catch (error) {
            console.error("Error sending message to chatbot:", error);
            setMessages((prevMessages) => [...prevMessages, {
                text: "Xin lỗi, không thể kết nối với máy chủ chatbot. Vui lòng thử lại sau.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* Nút mở/đóng chatbot */}
            <div className="chatbot-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                    <i className="fas fa-times"></i> // Icon đóng khi mở
                ) : (
                    <i className="fas fa-comments"></i> // Icon chat khi đóng
                )}
            </div>

            {/* Khung chat */}
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <h3>Trợ lý Dola Bakery</h3>
                </div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.sender}`}>
                            <div className="message-content">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                <span className="message-timestamp">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-bubble bot loading">
                            <div className="message-content">
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Dùng để cuộn xuống cuối */}
                </div>
                <form className="chatbot-input" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;