import axios from 'axios';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

// Buat client HTTP dengan interceptor untuk token
const httpClient = axios.create({
  baseURL: API_URL
});

// Tambahkan interceptor untuk menambahkan token pada setiap request
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userRegistrationService = {
  /**
   * Mengambil daftar pendaftar (volunteer) untuk event tertentu
   * GET /partners/me/events/:eventId/registrants
   * 
   * @param {string} eventId - ID event yang ingin dilihat pendaftarnya
   * @param {Object} options - Opsi tambahan seperti pagination, filter, dll
   * @returns {Promise<Object>} - Hasil API dengan data pendaftar
   */
  getVolunteerRegistrations: async (eventId, options = {}) => {
    try {
      if (!eventId) {
        throw new Error('EventId diperlukan untuk mendapatkan daftar pendaftar');
      }

      // Build query string from options
      const queryParams = new URLSearchParams();
      if (options.page) queryParams.append('page', options.page);
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.status) queryParams.append('status', options.status.toLowerCase());
      if (options.search || options.s) queryParams.append('s', options.search || options.s);
      if (options.sort) queryParams.append('sort', options.sort);

      const queryString = queryParams.toString();
      const url = `${API_URL}/partners/me/events/${eventId}/registrants${queryString ? `?${queryString}` : ''}`;
      
      console.log('Calling API:', url);
      const response = await httpClient.get(url);
      
      // Berdasarkan contoh respons yang diberikan
      return response.data;
    } catch (error) {
      console.error('Error in getVolunteerRegistrations:', error);
      throw error.response?.data || { 
        message: error.message || 'Gagal mendapatkan daftar pendaftar' 
      };
    }
  },

  /**
   * Mengambil detail pendaftaran volunteer tertentu
   * GET /partners/me/events/:eventId/registrants/:registrantId
   * 
   * @param {string} eventId - ID event
   * @param {string} registrantId - ID pendaftar yang ingin dilihat detailnya
   * @returns {Promise<Object>} - Hasil API dengan data detail pendaftar
   */
  getRegistrationDetails: async (eventId, registrantId) => {
    try {
      if (!eventId || !registrantId) {
        throw new Error('EventId dan registrantId diperlukan untuk mendapatkan detail pendaftar');
      }
      
      const url = `${API_URL}/partners/me/events/${eventId}/registrants/${registrantId}`;
      
      console.log('Calling API:', url);
      const response = await httpClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error in getRegistrationDetails:', error);
      throw error.response?.data || { 
        message: error.message || 'Gagal mendapatkan detail pendaftar' 
      };
    }
  },

  /**
   * Memperbarui status pendaftaran volunteer
   * PATCH /partners/me/events/:eventId/registrants/:registrantId
   * 
   * @param {string} eventId - ID event
   * @param {string} registrantId - ID pendaftar yang akan diupdate statusnya
   * @param {string} status - Status baru (accepted/rejected)
   * @param {string} notes - Catatan tambahan (opsional)
   * @returns {Promise<Object>} - Hasil API setelah update status
   */
  updateRegistrationStatus: async (eventId, registrantId, status, notes = '') => {
    try {
      if (!eventId || !registrantId) {
        throw new Error('EventId dan registrantId diperlukan untuk mengupdate status pendaftar');
      }
      
      // Berdasarkan dokumentasi API, status yang dikirim harus lowercase
      if (!status || !['accepted', 'rejected', 'APPROVED', 'REJECTED'].includes(status)) {
        throw new Error('Status tidak valid. Gunakan accepted atau rejected');
      }
      
      // Konversi status jika perlu
      const apiStatus = status === 'APPROVED' ? 'accepted' : 
                         status === 'REJECTED' ? 'rejected' : status;
      
      const url = `${API_URL}/partners/me/events/${eventId}/registrants/${registrantId}`;
      
      console.log('Calling API:', url, 'with data:', { status: apiStatus, notes });
      const response = await httpClient.patch(url, { status: apiStatus, notes });
      return response.data;
    } catch (error) {
      console.error('Error in updateRegistrationStatus:', error);
      throw error.response?.data || { 
        message: error.message || 'Gagal mengupdate status pendaftar' 
      };
    }
  }
};