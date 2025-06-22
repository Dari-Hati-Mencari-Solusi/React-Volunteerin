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
      // Sesuaikan dengan endpoint API yang benar
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
      return response.data;
    } catch (error) {
      handleApiError(error, 'Terjadi kesalahan saat mengambil detail pengguna');
    }
  },
  
  /**
   * Mendapatkan dokumen legalitas partner berdasarkan ID partner
   * @param {string} partnerId - ID pengguna partner
   * @returns {Promise<Object>} Data dokumen legalitas
   * @throws {Object} Objek error dengan pesan
   */
  getPartnerLegalDocs: async (partnerId) => {
    try {
      // Periksa apakah ada endpoint khusus untuk mendapatkan dokumen legalitas
      // Bisa saja endpoint ini berbeda dari dokumentasi yang diberikan
      const response = await httpClient.get(`${API_URL}/admins/me/partners/${partnerId}/legality`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Terjadi kesalahan saat mengambil dokumen legalitas');
    }
  },
  
  /**
   * Melakukan review terhadap status partner
   * @param {string} userId - ID pengguna partner
   * @param {string} reviewResult - Hasil review (ACCEPTED_PROFILE, ACCEPTED_LEGALITY, REJECTED_PROFILE, REJECTED_LEGALITY)
   * @param {string} information - Pesan informasi (wajib jika ditolak)
   * @returns {Promise<Object>} Data partner yang diperbarui
   * @throws {Object} Objek error dengan pesan
   */
  reviewPartner: async (userId, reviewResult, information = null) => {
    try {
      const payload = { reviewResult };
      
      // Tambahkan information jika ada
      if (information) {
        payload.information = information;
      }
      
      // Jika ditolak, pastikan ada informasi
      if ((reviewResult === 'REJECTED_PROFILE' || reviewResult === 'REJECTED_LEGALITY') && !information) {
        throw new Error('Pesan informasi diperlukan jika status ditolak');
      }
      
      const response = await httpClient.patch(`${API_URL}/admins/me/users/${userId}/review`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Terjadi kesalahan saat mereview partner');
    }
  }
};