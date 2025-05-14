import httpClient from '../utils/httpClient';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

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
      if (error.response?.data?.message) {
        throw { message: error.response.data.message };
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Terjadi kesalahan saat mengambil formulir pendaftaran' };
      }
    }
  },

  /**
   * Submit volunteer registration form
   * @param {string} eventId - ID of the event
   * @param {string} formId - ID of the registration form
   * @param {Object} answers - Form answers
   * @returns {Promise<Object>} Submission response
   */
  submitVolunteerRegistration: async (eventId, formId, answers) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      };
      
      const data = {
        formId: formId,
        answers: answers
      };
      
      const response = await axios.post(
        `${API_URL}/events/${eventId}/register`, 
        data,
        config
      );
      
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw { message: error.response.data.message };
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Terjadi kesalahan saat mengirim formulir' };
      }
    }
  }
};

// Export default juga untuk kompatibilitas
export default userService;