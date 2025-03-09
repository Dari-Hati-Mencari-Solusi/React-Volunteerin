import httpClient from '../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
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
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
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

  registerPartner: async (userData) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while processing your request' };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/reset-password`, {
        token,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while resetting password' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  }
};
