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
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  // Other existing methods...

  getUserProfile: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/auth/profile`); // Fetch user profile data
      return response.data; // Assuming the response contains the user profile data
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching profile data' };
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/profile`, profileData); // Update user profile
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating profile data' };
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/change-password`, { oldPassword, newPassword }); // Change password
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while changing password' };
    }
  },

  // Other existing methods...
};
