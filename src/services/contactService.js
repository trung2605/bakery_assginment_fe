// src/services/contactService.js

import axios from 'axios';

// API của bạn từ SheetDB
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/qojy5dv7e89il'; 

const contactService = {
    /**
     * Gửi dữ liệu form liên hệ lên SheetDB.
     * @param {Object} formData Đối tượng chứa dữ liệu từ form (name, email, phone, message).
     * @returns {Promise<Object>} Phản hồi từ API SheetDB.
     */
    sendContactForm: async (formData) => {
        try {
            // SheetDB yêu cầu dữ liệu được gửi trong một đối tượng 'data'
            const response = await axios.post(SHEETDB_API_URL, {
                data: formData
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi gửi thông tin liên hệ lên SheetDB:', error);
            // Ném lỗi để component có thể xử lý
            throw error;
        }
    }
};

export default contactService;