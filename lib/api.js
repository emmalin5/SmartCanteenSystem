/**
 * API Configuration and Utility Functions
 * Handles all API calls using axios
 */

import axios from 'axios';

// Base URL for API calls
// Use relative path for Next.js API routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor (can be used for adding auth tokens later)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Student API Functions
 */

/**
 * Get student dashboard data
 * @param {string} studentId - Student ID
 * @returns {Promise} Dashboard data
 */
export const getStudentDashboard = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/dashboard`);
  return response.data;
};

/**
 * Get student transactions
 * @param {string} studentId - Student ID
 * @returns {Promise} Transactions array
 */
export const getStudentTransactions = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/transactions`);
  return response.data;
};

/**
 * Report lost card
 * @param {string} studentId - Student ID
 * @param {object} reportData - Report data
 * @returns {Promise} Response data
 */
export const reportLostCard = async (studentId, reportData) => {
  const response = await apiClient.post(`/student/${studentId}/report-lost-card`, reportData);
  return response.data;
};

/**
 * Admin API Functions
 */

/**
 * Get all users (admin only)
 * @returns {Promise} Users array
 */
export const getAdminUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

/**
 * Block a card
 * @param {string} cardId - Card ID
 * @returns {Promise} Response data
 */
export const blockCard = async (cardId) => {
  const response = await apiClient.post('/admin/block-card', { cardId });
  return response.data;
};

/**
 * Unblock a card
 * @param {string} cardId - Card ID
 * @returns {Promise} Response data
 */
export const unblockCard = async (cardId) => {
  const response = await apiClient.post('/admin/unblock-card', { cardId });
  return response.data;
};

/**
 * Get all transactions (admin only)
 * @returns {Promise} Transactions array
 */
export const getAdminTransactions = async () => {
  const response = await apiClient.get('/admin/transactions');
  return response.data;
};

export default apiClient;

