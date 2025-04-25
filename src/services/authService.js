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
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  loginPartner: async (email, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log(response, 'response login');  
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  registerPartner: async (userData) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  register: async (userData) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUserProfile: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/auth/profile`);
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

  getStoredUser: () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  resetPassword: async (email) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while resetting password' };
    }
  },

  // Alias untuk forgotPassword
  forgotPassword: async (email) => {
    return authService.resetPassword(email);
  },
  
  confirmPasswordReset: async (token, newPassword) => {
    try {
      console.log("Sending request to /auth/reset-password with token:", token);
      const response = await httpClient.post(`${API_URL}/auth/reset-password`, {
        token,
        password: newPassword
      });
      console.log("Response from /auth/reset-password:", response);
      return response.data;
    } catch (error) {
      console.error("Error in confirmPasswordReset:", error);
      throw error.response?.data || { message: 'Failed to confirm password reset' };
    }
  },
  refreshToken: async () => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/refresh-token`);
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      authService.logout();
      throw error.response?.data || { message: 'Session expired. Please login again.' };
    }
  }
};