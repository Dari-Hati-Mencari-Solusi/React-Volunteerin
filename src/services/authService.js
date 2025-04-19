import httpClient from '../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user data for offline access
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Any other cleanup needed
  },

  getUserProfile: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/auth/profile`);
      
      // Update stored user data
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching profile data' };
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/profile`, profileData);
      
      // Update stored user data if successful
      if (response.data?.data?.user) {
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating profile data' };
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/change-password`, { 
        oldPassword, 
        newPassword 
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while changing password' };
    }
  },

  // Get user from localStorage (for offline access)
  getStoredUser: () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Refresh token if needed
  refreshToken: async () => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/refresh-token`);
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      // If refresh fails, logout
      authService.logout();
      throw error.response?.data || { message: 'Session expired. Please login again.' };
    }
  }
};