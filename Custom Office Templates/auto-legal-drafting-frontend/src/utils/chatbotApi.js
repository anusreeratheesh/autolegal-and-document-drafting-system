import API from './api';

// ===== CHATBOT ENDPOINTS =====
export const chatbotAPI = {
    sendMessage: (data) => API.post('/chatbot/message', data),
    getHistory: (documentId) => API.get(`/chatbot/history/${documentId || ''}`),
    clearHistory: (documentId) => API.delete(`/chatbot/history/${documentId || ''}`),
};

export default chatbotAPI;
