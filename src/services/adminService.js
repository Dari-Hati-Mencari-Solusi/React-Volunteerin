import httpClient from '../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL || 'http://localhost:3000';

/**
 * Handle API errors consistently across service
 * @param {Error} error - The error object from the API response
 * @param {string} defaultMessage - Fallback error message if response doesn't contain one
 * @throws {Object} Formatted error object with message
 */
const handleApiError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    throw { message: error.response.data.message };
  } else if (error.message) {
    throw { message: error.message };
  } else {
    throw { message: defaultMessage };
  }
};

/**
 * Admin service containing methods for admin-specific operations
 */
export const adminService = {
  /**
   * Get all users with optional filtering
   * @param {URLSearchParams|Object} queryParams - Query parameters for filtering users
   * @returns {Promise<Object>} Users data
   * @throws {Object} Error object with message
   */
  getAllUsers: async (queryParams) => {
    try {
      let url = `${API_URL}/admins/me/users`;
      
      // Add query parameters if provided
      if (queryParams) {
        // If queryParams is URLSearchParams, convert to string
        if (queryParams instanceof URLSearchParams) {
          url += `?${queryParams.toString()}`;
        } 
        // If queryParams is an object, convert to URLSearchParams
        else if (typeof queryParams === 'object') {
          const params = new URLSearchParams();
          for (const key in queryParams) {
            if (queryParams[key]) {
              params.append(key, queryParams[key]);
            }
          }
          url += `?${params.toString()}`;
        }
      }
      
      console.log("Fetching users from:", url);
      
      const response = await httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error getting users:", error);
      handleApiError(error, 'An error occurred while fetching users data');
    }
  },

  /**
   * Get user details by ID
   * @param {string} userId - ID of the user
   * @returns {Promise<Object>} User details data
   * @throws {Object} Error object with message
   */
  getUserDetail: async (userId) => {
    try {
      const response = await httpClient.get(`${API_URL}/admins/me/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user details:", error);
      handleApiError(error, 'An error occurred while fetching user details');
    }
  },

  /**
   * Update user role - restricted to only User and Partner roles
   * @param {string} userId - ID of the user
   * @param {string} role - New role for the user (only 'User' or 'Partner')
   * @returns {Promise<Object>} Updated user data
   * @throws {Object} Error object with message
   */
  updateUserRole: async (userId, role) => {
    try {
      // Validate role - only allow User and Partner roles
      if (role !== 'User' && role !== 'Partner') {
        throw { message: 'Only User and Partner roles can be assigned' };
      }
      
      // Convert UI role format to API format (VOLUNTEER or PARTNER)
      const apiRole = role === 'Partner' ? 'PARTNER' : 'VOLUNTEER';
                      
      const response = await httpClient.put(`${API_URL}/admins/me/users/${userId}/role`, { role: apiRole });
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      handleApiError(error, 'An error occurred while updating user role');
    }
  },

  /**
   * Approve partner registration
   * @param {string} userId - ID of the partner user
   * @param {string} message - Message to include with approval
   * @returns {Promise<Object>} Approval response
   * @throws {Object} Error object with message
   */
  approvePartner: async (userId, message) => {
    try {
      const response = await httpClient.put(`${API_URL}/admins/me/users/${userId}/approve`, { 
        message: message || 'Selamat, akun partner kamu telah disetujui',
        reviewResult: 'ACCEPTED_PROFILE'
      });
      return response.data;
    } catch (error) {
      console.error("Error approving partner:", error);
      handleApiError(error, 'An error occurred while approving partner');
    }
  },

  /**
   * Reject partner registration
   * @param {string} userId - ID of the partner user
   * @param {string} message - Reason for rejection
   * @returns {Promise<Object>} Rejection response
   * @throws {Object} Error object with message
   */
  rejectPartner: async (userId, message) => {
    try {
      if (!message) {
        throw { message: 'Alasan penolakan harus diisi' };
      }
      
      const response = await httpClient.put(`${API_URL}/admins/me/users/${userId}/reject`, { 
        message: message,
        reviewResult: 'REJECTED_PROFILE'
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting partner:", error);
      handleApiError(error, 'An error occurred while rejecting partner');
    }
  },

  /**
   * Delete user
   * @param {string} userId - ID of the user to delete
   * @returns {Promise<Object>} Deletion response
   * @throws {Object} Error object with message
   */
  deleteUser: async (userId) => {
    try {
      const response = await httpClient.delete(`${API_URL}/admins/me/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      handleApiError(error, 'An error occurred while deleting user');
    }
  },

  /**
   * Get admin dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   * @throws {Object} Error object with message
   */
  getDashboardStats: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/admins/me/dashboard`);
      return response.data;
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      handleApiError(error, 'An error occurred while fetching dashboard statistics');
    }
  }
};