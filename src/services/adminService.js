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
   * Review Partner User - Endpoint yang benar sesuai dokumentasi
   * @param {string} userId - ID user yang akan direview (bukan partnerId)
   * @param {string} reviewResult - Hasil review (ACCEPTED_PROFILE, ACCEPTED_LEGALITY, REJECTED_PROFILE, REJECTED_LEGALITY)
   * @param {string} information - Pesan/informasi review (wajib jika ditolak)
   * @returns {Promise<Object>} Response data
   * @throws {Object} Objek error dengan pesan
   */
  reviewPartnerUser: async (userId, reviewResult, information = "") => {
    try {
      console.log('Reviewing partner user:', { userId, reviewResult, information });
      
      const requestBody = {
        reviewResult: reviewResult
      };

      // Tambahkan information jika ada (wajib untuk penolakan)
      if (information && information.trim()) {
        requestBody.information = information.trim();
      }

      // Gunakan PATCH method sesuai dokumentasi
      const response = await httpClient.patch(`${API_URL}/admins/me/users/${userId}/review`, requestBody);
      
      console.log('Review partner user response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error reviewing partner user:", error);
      handleApiError(error, 'Terjadi kesalahan saat mereview partner user');
    }
  },

/**
   * Review Partner Profile - Wrapper method untuk kemudahan penggunaan
   * @param {string} userId - ID user
   * @param {string} status - Status review ("accepted" atau "rejected")
   * @param {string} message - Pesan review
   * @returns {Promise<Object>} Response data
   */
  reviewPartnerProfile: async (userId, status, message = "") => {
    try {
      const reviewResult = status === "accepted" ? "ACCEPTED_PROFILE" : "REJECTED_PROFILE";
      return await adminService.reviewPartnerUser(userId, reviewResult, message);
    } catch (error) {
      console.error("Error reviewing partner profile:", error);
      throw error;
    }
  },

   /**
   * Review Partner Legality Documents - Wrapper method untuk kemudahan penggunaan
   * @param {string} userId - ID user
   * @param {string} status - Status review ("accepted" atau "rejected")
   * @param {string} message - Pesan review
   * @returns {Promise<Object>} Response data
   */
  reviewPartnerLegality: async (userId, status, message = "") => {
    try {
      const reviewResult = status === "accepted" ? "ACCEPTED_LEGALITY" : "REJECTED_LEGALITY";
      return await adminService.reviewPartnerUser(userId, reviewResult, message);
    } catch (error) {
      console.error("Error reviewing partner legality:", error);
      throw error;
    }
  },

  /**
   * Review Partner Status - Metode wrapper untuk kompatibilitas dengan kode existing
   * @param {string} userId - ID user
   * @param {string} reviewResult - Hasil review langsung (ACCEPTED_PROFILE, ACCEPTED_LEGALITY, etc.)
   * @param {string} information - Informasi/pesan review
   * @returns {Promise<Object>} Response data
   */
  reviewPartnerStatus: async (userId, reviewResult, information = "") => {
    try {
      return await adminService.reviewPartnerUser(userId, reviewResult, information);
    } catch (error) {
      console.error("Error updating partner status:", error);
      throw error;
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
  }
}