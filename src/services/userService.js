import axios from 'axios';
import httpClient from '../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

/**
 * Handles API errors consistently
 * @param {Error} error - Error object from axios
 * @param {string} defaultMessage - Default message if no error message found
 * @throws {Object} Formatted error object
 */
const handleApiError = (error, defaultMessage) => {
  console.error('API Error Details:', error.response || error);
  
  if (error.response?.data?.message) {
    throw { message: error.response.data.message };
  } else if (error.message) {
    throw { message: error.message };
  } else {
    throw { message: defaultMessage };
  }
};

/**
 * Gets authorization token from storage
 * @returns {string|null} The token or null if not found
 */
const getAuthToken = () => {
  return localStorage.getItem('token') || 
         localStorage.getItem('authToken') || 
         sessionStorage.getItem('token') || 
         null;
};

export const userService = {
  /**
   * Get registration form structure for an event
   * @param {string} eventId - ID of the event to register for
   * @returns {Promise<Object>} Form structure
   */
  getRegistrationForm: async (eventId) => {
    try {
      const response = await httpClient.get(`${API_URL}/forms?eventId=${eventId}`);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const matchingForm = response.data.data.find(form => form.eventId === eventId);
        
        if (matchingForm) {
          return {
            ...response.data,
            data: [matchingForm]
          };
        }
      }
      
      return response.data;
    } catch (error) {
      handleApiError(error, 'Terjadi kesalahan saat mengambil formulir pendaftaran');
    }
  },

  /**
   * Check if user has already registered for an event
   * @param {string} eventId - ID of the event
   * @returns {Promise<Object>} Registration status
   */
  getRegistrationStatus: async (eventId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for checking registration status');
        return { registered: false };
      }
      
      const response = await httpClient.get(`${API_URL}/events/${eventId}/registration-status`);
      return response.data;
    } catch (error) {
      console.warn('Error checking registration status:', error);
      // Don't throw here, just return not registered
      return { registered: false };
    }
  },

  /**
   * Submit volunteer registration form
   * @param {string} eventId - ID of the event
   * @param {string} formId - ID of the registration form
   * @param {Object} formData - Form data to submit
   * @returns {Promise<Object>} Submission response
   */
  submitVolunteerRegistration: async (eventId, formId, formData) => {
    try {
      // Validation
      if (!eventId) throw new Error('Event ID tidak valid');
      if (!formId) throw new Error('Form ID tidak valid');
      if (!formData || Object.keys(formData).length === 0) {
        throw new Error('Data formulir tidak boleh kosong');
      }
      
      // Debug info
      console.log('=== REGISTRASI VOLUNTEER ===');
      console.log('Event ID:', eventId);
      console.log('Form ID:', formId);
      console.log('Form Data:', formData);
      
      // Format payload sesuai dengan API docs
      const payload = {
        formId: formId,
        answers: { ...formData } // Clone formData untuk memastikan tidak ada referensi
      };
      
      console.log('Payload untuk API:', JSON.stringify(payload, null, 2));
      
      // Dapatkan token
      const token = getAuthToken();
      console.log('Token tersedia:', !!token);
      
      // Persiapkan headers
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('Token tidak ditemukan, request mungkin akan ditolak');
      }
      
      // Kirim dengan axios langsung untuk memastikan format benar
      // Dan kita bisa memantau headers yang dikirim secara detail
      try {
        console.log(`Mengirim ke: ${API_URL}/events/${eventId}/register`);
        const response = await axios({
          method: 'post',
          url: `${API_URL}/events/${eventId}/register`,
          data: payload,
          headers: headers
        });
        
        console.log('Respons API:', response.data);
        return response.data;
      } catch (directError) {
        console.error('Error dengan axios langsung:', directError);
        
        // Fallback ke httpClient yang mungkin memiliki konfigurasi lain
        console.log('Mencoba dengan httpClient...');
        const httpResponse = await httpClient.post(
          `${API_URL}/events/${eventId}/register`,
          payload
        );
        
        console.log('Respons httpClient:', httpResponse.data);
        return httpResponse.data;
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      handleApiError(error, 'Gagal mengirim data pendaftaran');
    }
  },
  
  /**
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Gagal mendapatkan profil pengguna');
    }
  },
  
  /**
   * Get user registrations history
   * @returns {Promise<Object>} User registrations data
   */
getUserRegistrations: async () => {
  try {
    // Pastikan endpoint ini sudah diimplementasikan di backend
    const response = await httpClient.get(`${API_URL}/users/registrations`);
    
    // Log untuk debugging
    console.log('User registrations data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    handleApiError(error, 'Gagal mengambil data pendaftaran');
  }
},
  
  /**
   * Test API connection with direct method
   * For debugging purposes only
   */
  testApiConnection: async () => {
    try {
      const token = getAuthToken();
      const eventId = "test-event-id";
      const formId = "test-form-id";
      const testData = { 
        fullName: "Test User", 
        emailAddress: "test@example.com" 
      };
      
      console.log('=== TEST KONEKSI API ===');
      console.log('URL:', `${API_URL}/events/${eventId}/register`);
      console.log('Token:', token ? 'Ada' : 'Tidak ada');
      
      // Tes koneksi dengan dummy data
      try {
        await axios({
          method: 'post',
          url: `${API_URL}/events/${eventId}/register`,
          data: {
            formId: formId,
            answers: testData
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            'X-Test-Request': 'true' // Flag untuk backend bahwa ini request test
          }
        });
        return { success: true, message: 'Koneksi API berhasil' };
      } catch (error) {
        return { 
          success: false, 
          message: 'Koneksi API gagal', 
          error: error.message,
          status: error.response?.status,
          details: error.response?.data 
        };
      }
    } catch (error) {
      return { success: false, message: 'Gagal melakukan test koneksi' };
    }
  }
};

/**
 * Helper function to verify authentication status
 * @returns {boolean} Whether user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Convert to boolean
};

export default userService;