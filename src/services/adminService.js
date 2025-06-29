import httpClient from '../utils/httpClient';

/**
 * Admin service untuk operasi administratif
 */
const API_URL = import.meta.env.VITE_BE_BASE_URL;

/**
 * Menangani error API secara konsisten
 * @param {Error} error - Objek error dari respons API
 * @param {string} defaultMessage - Pesan error default jika respons tidak menyertakan pesan
 * @throws {Object} Objek error dengan pesan
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

export const adminService = {
  /**
   * Mendapatkan semua data pengguna dengan filter opsional
   * @param {Object} params - Parameter query (seperti role, limit, page, sort, s)
   * @returns {Promise<Object>} Data pengguna
   * @throws {Object} Objek error dengan pesan
   */
  getUsers: async (params = {}) => {
    try {
      const response = await httpClient.get(`${API_URL}/admins/me/users`, { params });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Terjadi kesalahan saat mengambil data pengguna');
    }
  },
  
  /**
   * Mendapatkan detail data pengguna berdasarkan ID
   * @param {string} userId - ID pengguna
   * @returns {Promise<Object>} Data detail pengguna
   * @throws {Object} Objek error dengan pesan
   */
  getUserDetail: async (userId) => {
    try {
      const response = await httpClient.get(`${API_URL}/admins/me/users/${userId}`);
      
      // Log response untuk debugging
      console.log('Full API Response:', response.data);
      console.log('Partner data:', response.data?.data?.partner);
      console.log('Legality data:', response.data?.data?.partner?.legality);
      
      return response.data;
    } catch (error) {
      console.error('Error in getUserDetail:', error);
      handleApiError(error, 'Terjadi kesalahan saat mengambil detail pengguna');
    }
  },
  
  /**
   * Review Partner Profile
   * @param {string} partnerId - ID partner
   * @param {string} status - Status review ("accepted" atau "rejected")
   * @param {string} message - Pesan review
   * @returns {Promise<Object>} Response data
   */
  reviewPartnerProfile: async (partnerId, status, message = "") => {
    try {
      const response = await httpClient.post(`${API_URL}/admins/me/partners/${partnerId}/profile/review`, {
        status: status,
        message: message
      });
      return response.data;
    } catch (error) {
      console.error("Error reviewing partner profile:", error);
      handleApiError(error, 'Terjadi kesalahan saat mereview profil partner');
    }
  },

  /**
   * Review Partner Legality Documents
   * @param {string} partnerId - ID partner
   * @param {string} status - Status review ("accepted" atau "rejected")
   * @param {string} message - Pesan review
   * @returns {Promise<Object>} Response data
   */
  reviewPartnerLegality: async (partnerId, status, message = "") => {
    try {
      const response = await httpClient.post(`${API_URL}/admins/me/partners/${partnerId}/legality/review`, {
        status: status,
        message: message
      });
      return response.data;
    } catch (error) {
      console.error("Error reviewing partner legality:", error);
      handleApiError(error, 'Terjadi kesalahan saat mereview legalitas partner');
    }
  },

  /**
   * Generic Partner Review - sesuaikan dengan endpoint API yang tersedia
   * @param {string} partnerId - ID partner
   * @param {Object} reviewData - Data review
   * @returns {Promise<Object>} Response data
   */
  reviewPartner: async (partnerId, reviewData) => {
    try {
      // Sesuaikan endpoint ini dengan dokumentasi API yang benar
      const response = await httpClient.post(`${API_URL}/admins/me/partners/${partnerId}/review`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error reviewing partner:", error);
      handleApiError(error, 'Terjadi kesalahan saat mereview partner');
    }
  },

  /**
   * Review Partner Status - metode alternatif jika API menggunakan endpoint yang berbeda
   * @param {string} partnerId - ID partner
   * @param {string} reviewResult - Hasil review (ACCEPTED_PROFILE, ACCEPTED_LEGALITY, etc.)
   * @param {string} information - Informasi/pesan review
   * @returns {Promise<Object>} Response data
   */
  reviewPartnerStatus: async (partnerId, reviewResult, information = "") => {
    try {
      const response = await httpClient.put(`${API_URL}/admins/me/partners/${partnerId}`, {
        status: reviewResult,
        information: information
      });
      return response.data;
    } catch (error) {
      console.error("Error updating partner status:", error);
      handleApiError(error, 'Terjadi kesalahan saat mengupdate status partner');
    }
  }
};