/**
 * API Configuration and Utility Functions
 * Handles all API calls using axios
 */

import axios from 'axios';

// Base URL for API calls
// Use relative path for Next.js API routes unless JSON Server is enabled
const isJsonServer = process.env.NEXT_PUBLIC_API_PROVIDER === 'json-server';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (isJsonServer ? 'http://localhost:3001' : '/api');

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
  if (isJsonServer) {
    try {
      const response = await apiClient.get(`/studentDashboards/${studentId}`);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await apiClient.get(`/users/${studentId}`);
        return {
          id: studentId,
          studentId,
          studentName: fallback.data?.name || `Student ${studentId}`,
          cardId: fallback.data?.cardId || 'CARD000000',
          cardStatus: fallback.data?.cardStatus || 'active',
          balance: fallback.data?.balance ?? 0,
          mealsToday: [],
          monthlyUsage: {
            currentMonth: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            totalSpent: 0,
            totalMeals: 0,
            averagePerMeal: 0,
            dailyAverage: 0,
            breakdown: []
          },
          nextMealWindow: {
            mealType: 'Lunch',
            startTime: '12:00',
            endTime: '14:00',
            location: 'Main Canteen',
            isActive: false
          },
          notifications: []
        };
      }
      throw error;
    }
  }

  const response = await apiClient.get(`/student/${studentId}/dashboard`);
  return response.data;
};

/**
 * Get student transactions
 * @param {string} studentId - Student ID
 * @returns {Promise} Transactions array
 */
export const getStudentTransactions = async (studentId) => {
  if (isJsonServer) {
    const response = await apiClient.get('/transactions', {
      params: { studentId }
    });
    const transactions = Array.isArray(response.data) ? response.data : response.data?.transactions || [];
    return {
      studentId,
      transactions,
      total: transactions.length,
      totalAmount: transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0)
    };
  }

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
  if (isJsonServer) {
    await apiClient.post('/lostCards', {
      studentId,
      ...reportData,
      timestamp: new Date().toISOString()
    });

    try {
      const userResponse = await apiClient.get(`/users/${studentId}`);
      if (userResponse?.data?.id) {
        await apiClient.patch(`/users/${studentId}`, { cardStatus: 'blocked' });
      }
    } catch (error) {
      // Ignore user update errors for mock workflow
    }

    return { message: 'Lost card reported successfully' };
  }

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
  const data = response.data;

  if (Array.isArray(data)) {
    const active = data.filter((u) => u.cardStatus === 'active').length;
    const blocked = data.filter((u) => u.cardStatus === 'blocked').length;
    return {
      users: data,
      total: data.length,
      active,
      blocked
    };
  }

  return data;
};

/**
 * Get all students (admin)
 * @returns {Promise} Students array
 */
export const getAdminStudents = async () => {
  if (isJsonServer) {
    const response = await apiClient.get('/admin/students');
    const students = Array.isArray(response.data) ? response.data : response.data?.users || [];
    const active = students.filter((u) => u.cardStatus === 'active').length;
    const blocked = students.filter((u) => u.cardStatus === 'blocked').length;
    return {
      students,
      total: students.length,
      active,
      blocked
    };
  }

  const response = await apiClient.get('/admin/students');
  return response.data;
};

/**
 * Create a student (admin)
 * @param {object} studentData
 */
export const createStudent = async (studentData) => {
  if (isJsonServer) {
    const response = await apiClient.post('/admin/students', {
      ...studentData,
      restaurantAssignedAt: studentData.restaurantId ? new Date().toISOString() : ''
    });
    return response.data;
  }

  const response = await apiClient.post('/admin/students', studentData);
  return response.data;
};

/**
 * Update a student (admin)
 * @param {string} studentId
 * @param {object} studentData
 */
export const updateStudent = async (studentId, studentData) => {
  if (isJsonServer) {
    const response = await apiClient.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  }

  const response = await apiClient.put(`/admin/students/${studentId}`, studentData);
  return response.data;
};

/**
 * Delete a student (admin)
 * @param {string} studentId
 */
export const deleteStudent = async (studentId) => {
  if (isJsonServer) {
    const response = await apiClient.delete(`/admin/students/${studentId}`);
    return response.data;
  }

  const response = await apiClient.delete(`/admin/students/${studentId}`);
  return response.data;
};

/**
 * Add amount to student balance (admin)
 * @param {string} studentId
 * @param {number} amount
 */
export const topUpStudentBalance = async (studentId, amount) => {
  if (isJsonServer) {
    const current = await apiClient.get(`/admin/students/${studentId}`);
    const balance = Number(current.data?.balance || 0);
    const response = await apiClient.patch(`/admin/students/${studentId}`, {
      balance: balance + Number(amount || 0)
    });
    return response.data;
  }

  const response = await apiClient.post(`/admin/students/${studentId}/top-up`, { amount });
  return response.data;
};

/**
 * Restaurant CRUD (admin)
 */
export const getAdminRestaurants = async () => {
  const response = await apiClient.get('/admin/restaurants');
  const data = response.data;

  if (Array.isArray(data)) {
    return { restaurants: data, total: data.length };
  }

  return data;
};

export const createRestaurant = async (restaurantData) => {
  const response = await apiClient.post('/admin/restaurants', restaurantData);
  return response.data;
};

export const updateRestaurant = async (restaurantId, restaurantData) => {
  const response = await apiClient.put(`/admin/restaurants/${restaurantId}`, restaurantData);
  return response.data;
};

export const deleteRestaurant = async (restaurantId) => {
  const response = await apiClient.delete(`/admin/restaurants/${restaurantId}`);
  return response.data;
};

/**
 * Block a card
 * @param {string} cardId - Card ID
 * @returns {Promise} Response data
 */
export const blockCard = async (cardId) => {
  if (isJsonServer) {
    const lookup = await apiClient.get('/users', { params: { cardId } });
    const user = Array.isArray(lookup.data) ? lookup.data[0] : null;

    if (!user) {
      throw new Error('Card not found');
    }

    const updated = await apiClient.patch(`/users/${user.id}`, { cardStatus: 'blocked' });
    return { message: 'Card blocked successfully', user: updated.data };
  }

  const response = await apiClient.post('/admin/block-card', { cardId });
  return response.data;
};

/**
 * Unblock a card
 * @param {string} cardId - Card ID
 * @returns {Promise} Response data
 */
export const unblockCard = async (cardId) => {
  if (isJsonServer) {
    const lookup = await apiClient.get('/users', { params: { cardId } });
    const user = Array.isArray(lookup.data) ? lookup.data[0] : null;

    if (!user) {
      throw new Error('Card not found');
    }

    const updated = await apiClient.patch(`/users/${user.id}`, { cardStatus: 'active' });
    return { message: 'Card unblocked successfully', user: updated.data };
  }

  const response = await apiClient.post('/admin/unblock-card', { cardId });
  return response.data;
};

/**
 * Get all transactions (admin only)
 * @returns {Promise} Transactions array
 */
export const getAdminTransactions = async () => {
  const response = await apiClient.get('/admin/transactions');
  const data = response.data;

  if (Array.isArray(data)) {
    const totalAmount = data.reduce((sum, txn) => sum + (txn.amount || 0), 0);
    return {
      transactions: data,
      pagination: {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1
      },
      summary: {
        totalTransactions: data.length,
        totalAmount,
        averageTransaction: data.length > 0 ? totalAmount / data.length : 0
      }
    };
  }

  return data;
};

/**
 * Restaurant Owner API Functions
 */

/**
 * Get restaurant owner dashboard data
 * @returns {Promise} Dashboard data
 */
export const getOwnerDashboard = async () => {
  if (isJsonServer) {
    const [restaurantsRes, menuRes, dashboardRes] = await Promise.all([
      apiClient.get('/admin/restaurants'),
      apiClient.get('/owner/menu'),
      apiClient.get('/owner/dashboard')
    ]);

    const restaurants = Array.isArray(restaurantsRes.data)
      ? restaurantsRes.data
      : restaurantsRes.data?.restaurants || [];
    const menuItems = Array.isArray(menuRes.data)
      ? menuRes.data
      : menuRes.data?.menuItems || [];

    const dashboard = dashboardRes.data || {};
    const restaurant =
      restaurants.find((rest) => rest.ownerName === dashboard.ownerName) ||
      restaurants.find((rest) => rest.id === 'REST001') ||
      restaurants[0];

    const activeMenuItems = menuItems.filter((item) => item.available).length;
    const lowStockItems = menuItems.filter((item) => item.stock <= 10);

    return {
      ...dashboard,
      restaurantId: restaurant?.id || 'REST001',
      restaurantName: restaurant?.name || dashboard.restaurantName || 'Main Canteen',
      summary: {
        ...(dashboard.summary || {}),
        activeMenuItems,
        lowStockItems: lowStockItems.length
      },
      menuItems,
      lowStockItems
    };
  }

  const response = await apiClient.get('/owner/dashboard');
  return response.data;
};

/**
 * Restaurant Owner Menu API
 */
export const getOwnerMenuItems = async () => {
  const response = await apiClient.get('/owner/menu');
  return response.data;
};

export const createMenuItem = async (menuItemData) => {
  const response = await apiClient.post('/owner/menu', menuItemData);
  return response.data;
};

export const updateMenuItem = async (menuItemId, menuItemData) => {
  const response = await apiClient.put(`/owner/menu/${menuItemId}`, menuItemData);
  return response.data;
};

export const deleteMenuItem = async (menuItemId) => {
  const response = await apiClient.delete(`/owner/menu/${menuItemId}`);
  return response.data;
};

/**
 * Restaurant Owner Students API
 */
export const getOwnerStudents = async () => {
  const response = await apiClient.get('/owner/students');
  const data = response.data;

  if (Array.isArray(data)) {
    return { students: data, total: data.length };
  }

  return data;
};

export default apiClient;

