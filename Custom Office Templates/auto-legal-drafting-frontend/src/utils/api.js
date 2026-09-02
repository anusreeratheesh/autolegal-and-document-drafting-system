import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
// Only check sessionStorage (cleared on browser close)
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear all storage and redirect to login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH ENDPOINTS =====
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  sendOtp: (email) => API.post('/auth/send-otp', { email }),
  signup: (userData) => {
    const config = {};
    if (userData instanceof FormData) {
      // Let Axios and the browser set the Content-Type automatically 
      // with the correct multipart boundary 
    }
    return API.post('/auth/signup', userData, config);
  },

  logout: () => API.post('/auth/logout'),
  refreshToken: () => API.post('/auth/refresh'),
};

// ===== USER ENDPOINTS =====
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getAllUsers: (params) => API.get('/users', { params }),
  updateUserStatus: (id, data) => API.put(`/users/${id}/status`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
  suspendUser: (id) => API.post(`/users/${id}/suspend`),
};

// ===== DOCUMENT ENDPOINTS =====
export const documentAPI = {
  createDocument: (data) => API.post('/documents', data),
  getDocuments: () => API.get('/documents'),
  getDocument: (id) => API.get(`/documents/${id}`),
  updateDocument: (id, data) => API.put(`/documents/${id}`, data),
  deleteDocument: (id) => API.delete(`/documents/${id}`),
  generateDocument: (data) => API.post('/documents/generate', data),
  getVersionHistory: (id) => API.get(`/documents/${id}/versions`),
  downloadDocument: (id, format) =>
    API.get(`/documents/${id}/download?format=${format}`, { responseType: 'blob' }),
};

// ===== LAWYER ENDPOINTS =====
export const lawyerAPI = {
  getAllLawyers: (filters) => API.get('/lawyers', { params: filters }),
  getLawyer: (id) => API.get(`/lawyers/${id}`),
  updateProfile: (data) => API.put('/lawyers/profile', data),
  getStats: () => API.get('/lawyers/stats'),
  getPendingRequests: () => API.get('/lawyers/requests/pending'),
  getCompletedReviews: () => API.get('/lawyers/reviews/completed'),
};

// ===== REVIEW ENDPOINTS =====
export const reviewAPI = {
  createReview: (data) => API.post('/reviews', data),
  completeReview: (id, data) => API.post(`/reviews/${id}/complete`, data),
  getChatMessages: (reviewId) => API.get(`/reviews/${reviewId}/chat`),
  sendChatMessage: (reviewId, message) => API.post(`/reviews/${reviewId}/chat`, { message }),
  getReviews: () => API.get('/reviews'),
  getReview: (id) => API.get(`/reviews/${id}`),
  updateReviewStatus: (id, status) =>
    API.patch(`/reviews/${id}/status`, { status }),
  submitReview: (id, data) => API.post(`/reviews/${id}/submit`, data),
  acceptReview: (id) => API.post(`/reviews/${id}/accept`),
  rejectReview: (id, reason) => API.post(`/reviews/${id}/reject`, { reason }),
};

// ===== PAYMENT ENDPOINTS =====
export const paymentAPI = {
  createPayment: (data) => API.post('/payments', data),
  getPayments: () => API.get('/payments'),
  initiateRazorpay: (data) => API.post('/payments/razorpay/initiate', data),
  verifyRazorpayPayment: (data) => API.post('/payments/razorpay/verify', data),
};

// ===== PAYOUT ENDPOINTS =====
export const payoutAPI = {
  createPayout: (data) => API.post('/payouts', data),
  getPayouts: () => API.get('/payouts'),
  getPayout: (id) => API.get(`/payouts/${id}`),
};

// ===== DISPUTE ENDPOINTS =====
export const disputeAPI = {
  createDispute: (data) => API.post('/disputes', data),
  getDisputes: () => API.get('/disputes'),
  getDispute: (id) => API.get(`/disputes/${id}`),
  updateDispute: (id, data) => API.put(`/disputes/${id}`, data),
  resolveDispute: (id, resolution) =>
    API.post(`/disputes/${id}/resolve`, resolution),
};

// ===== NOTIFICATION ENDPOINTS =====
export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
};

// ===== ADMIN ENDPOINTS =====
export const adminAPI = {
  getDashboardStats: () => API.get('/admin/stats'),
  getPendingLawyers: () => API.get('/admin/lawyers/pending'),
  verifyLawyer: (id) => API.post(`/admin/lawyers/${id}/verify`),
  rejectLawyer: (id, reason) => API.post(`/admin/lawyers/${id}/reject`, { reason }),
  getFlaggedReviews: () => API.get('/admin/reviews/flagged'),
  approveReview: (id) => API.post(`/admin/reviews/${id}/approve`),
  rejectReview: (id) => API.post(`/admin/reviews/${id}/reject`),
  getDisputes: () => API.get('/admin/disputes'),
  getAuditLogs: () => API.get('/admin/audit-logs'),
  updateSettings: (data) => API.put('/admin/settings', data),
  exportReport: (type) =>
    API.get(`/admin/reports/${type}`, { responseType: 'blob' }),
};

export default API;
