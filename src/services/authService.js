import httpClient from '../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

/**
 * Handle API errors consistently across service
 * @param {Error} error - The error object from the API response
 * @param {string} defaultMessage - Fallback error message if response doesn't contain one
 * @throws {Object} Formatted error object with message
 */
const handleApiError = (error, defaultMessage) => {
  throw error.response?.data || { message: defaultMessage };
};

/**
 * Store user authentication data in localStorage
 * @param {string} token - JWT auth token
 * @param {Object|null} user - User data object
 * @returns {Object} Object containing token and user
 */
const storeUserData = (token, user) => {
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return { token, user };
};

/**
 * Authentication service containing methods for user authentication
 * and profile management
 */
export const authService = {
  /**
   * Get OAuth URL for Google authentication
   * @returns {string} Google OAuth URL
   */
  getGoogleOAuthUrl: () => `${API_URL}/auth/google`,
  
  /**
   * Get OAuth URL for Facebook authentication
   * @returns {string} Facebook OAuth URL
   */
  getFacebookOAuthUrl: () => `${API_URL}/auth/facebook`,

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   * @throws {Object} Error object with message
   */
  login: async (email, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data.data;
      return storeUserData(token, user);
    } catch (error) {
      handleApiError(error, 'An error occurred during login');
    }
  },

  /**
   * Partner login with email and password
   * @param {string} email - Partner email
   * @param {string} password - Partner password
   * @returns {Promise<Object>} Authentication data
   * @throws {Object} Error object with message
   */
  loginPartner: async (email, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data.data;
      return storeUserData(token, null);
    } catch (error) {
      handleApiError(error, 'An error occurred during login');
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   * @throws {Object} Error object with message
   */
  register: async (userData) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred during registration');
    }
  },

  /**
   * Register a new partner
   * @param {Object} userData - Partner registration data
   * @returns {Promise<Object>} Registration response
   * @throws {Object} Error object with message
   */
  registerPartner: async (userData) => {
    return authService.register(userData);
  },

  /**
   * Log out user by removing stored data
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get authenticated user profile
   * @returns {Promise<Object>} User profile data
   * @throws {Object} Error object with message
   */
  getUserProfile: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/auth/profile`);
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching profile data');
    }
  },

  /**
   * Update user profile information
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user data
   * @throws {Object} Error object with message
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/profile`, profileData);
      if (response.data?.data?.user) {
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while updating profile data');
    }
  },

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password response
   * @throws {Object} Error object with message
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/change-password`, { 
        oldPassword, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while changing password');
    }
  },

  /**
   * Get user data from localStorage
   * @returns {Object|null} User data or null if not found
   */
  getStoredUser: () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request response
   * @throws {Object} Error object with message
   */
  forgotPassword: async (email) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while requesting password reset');
    }
  },

  /**
   * Alias for forgotPassword to maintain consistent naming
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request response
   */
  resetPassword: async (email) => {
    return authService.forgotPassword(email);
  },
  
  /**
   * Confirm password reset with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset confirmation response
   * @throws {Object} Error object with message
   */
  confirmPasswordReset: async (token, newPassword) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/reset-password`, {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to confirm password reset');
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<string>} New token
   * @throws {Object} Error object with message
   */
  refreshToken: async () => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/refresh-token`);
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      authService.logout();
      handleApiError(error, 'Session expired. Please login again.');
    }
  }
};