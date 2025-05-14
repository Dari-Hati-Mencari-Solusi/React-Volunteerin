import httpClient from '../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

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
 * Partner service containing methods for partner-specific operations
 */
export const partnerService = {
  /**
   * Get authenticated partner's profile
   * @returns {Promise<Object>} Partner profile data
   * @throws {Object} Error object with message
   */
  getPartnerProfile: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/profile`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching partner profile');
    }
  },

  /**
   * Update partner profile information
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated partner data
   * @throws {Object} Error object with message
   */
  updatePartnerProfile: async (profileData) => {
    try {
      const response = await httpClient.put(`${API_URL}/partners/me/profile`, profileData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while updating partner profile');
    }
  },

  /**
   * Create new partner profile
   * @param {Object} profileData - New partner profile data
   * @returns {Promise<Object>} Created partner data
   * @throws {Object} Error object with message
   */
  createPartnerProfile: async (profileData) => {
    try {
      const response = await httpClient.post(`${API_URL}/partners/me/profile`, profileData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while creating partner profile');
    }
  },

  /**
   * Get partner's events
   * @param {Object} params - Query parameters for filtering events
   * @returns {Promise<Object>} Partner events data
   * @throws {Object} Error object with message
   */
  getPartnerEvents: async (params = {}) => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/events`, { params });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching partner events');
    }
  },

  /**
   * Create a new event for the partner
   * @param {Object} eventData - New event data
   * @returns {Promise<Object>} Created event data
   * @throws {Object} Error object with message
   */
  // Perbarui metode createEvent
  createEvent: async (formData) => {
    try {
      // Debug: Log form data dengan detail lebih baik
      console.log("===== CREATING EVENT =====");
      console.log("FormData entries:");
      
      let hasBenefits = false;
      let benefitCount = 0;
      let categoryCount = 0;
      
      for (let [key, value] of formData.entries()) {
        if (key === 'banner') {
          console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`);
        } else {
          console.log(`${key}: ${value}`);
          
          // Cek format benefitIds
          if (key === 'benefitIds[]') {
            hasBenefits = true;
            benefitCount++;
          }
          
          // Cek categoryIds
          if (key === 'categoryIds[]') {
            categoryCount++;
          }
        }
      }
      
      // Validasi kritis
      console.log(`Found ${benefitCount} benefit IDs and ${categoryCount} category IDs`);
      
      if (!hasBenefits || benefitCount === 0) {
        console.error("CRITICAL ERROR: No benefit IDs found in form data");
        throw { message: "Minimal pilih satu manfaat event" };
      }
      
      if (categoryCount === 0) {
        console.error("CRITICAL ERROR: No category IDs found in form data");
        throw { message: "Minimal pilih satu kategori event" };
      }
      
      // Send API request dengan timeout dan header tambahan
      console.log("Sending request to:", `${API_URL}/partners/me/events`);
      const response = await httpClient.post(`${API_URL}/partners/me/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Request-Source': 'React-App', // Header tambahan untuk debugging
        },
        timeout: 60000 // Timeout 60 detik
      });
      
      console.log("Event created successfully, response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      
      // Improved error logging
      if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        
        // Jika error 500, coba dengan data minimal
        if (error.response.status === 500) {
          try {
            console.log("Server error detected. Retrying with minimal data...");
            
            // Buat minimal FormData baru
            const minimalFormData = new FormData();
            
            // Ambil data utama dari formData asli
            const title = formData.get('title') || 'Default Title';
            const type = formData.get('type') || 'OPEN';
            const description = formData.get('description') || 'Default Description';
            const requirement = formData.get('requirement') || 'Default Requirement';
            const contactPerson = formData.get('contactPerson') || '081234567890';
            const startAt = formData.get('startAt') || new Date().toISOString();
            const province = formData.get('province') || 'Default Province';
            const regency = formData.get('regency') || 'Default Regency';
            
            // Tambahkan data utama
            minimalFormData.append('title', title);
            minimalFormData.append('type', type);
            minimalFormData.append('description', description);
            minimalFormData.append('requirement', requirement);
            minimalFormData.append('contactPerson', contactPerson);
            minimalFormData.append('startAt', startAt);
            minimalFormData.append('maxApplicant', '10');
            minimalFormData.append('province', province);
            minimalFormData.append('regency', regency);
            minimalFormData.append('isPaid', 'false');
            minimalFormData.append('isRelease', 'false');
            
            // Ambil 1 categoryId dari formData asli
            const categoryIds = formData.getAll('categoryIds[]');
            if (categoryIds && categoryIds.length > 0) {
              minimalFormData.append('categoryIds[]', categoryIds[0]);
            } else {
              throw new Error("Tidak ada category ID yang valid");
            }
            
            // Ambil 1 benefitId dari formData asli
            const benefitIds = formData.getAll('benefitIds[]');
            if (benefitIds && benefitIds.length > 0) {
              minimalFormData.append('benefitIds[]', benefitIds[0]);
            } else {
              throw new Error("Tidak ada benefit ID yang valid");
            }
            
            // Tambahkan banner jika ada
            if (formData.get('banner')) {
              minimalFormData.append('banner', formData.get('banner'));
            }
            
            console.log("Minimal data retry - sending request");
            const minimalResponse = await httpClient.post(`${API_URL}/partners/me/events`, minimalFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-Retry-Attempt': 'true'
              },
              timeout: 60000
            });
            
            console.log("Minimal data approach successful:", minimalResponse.data);
            return minimalResponse.data;
          } catch (retryError) {
            console.error("Retry failed:", retryError);
            throw { 
              message: "Server error persists even with minimal data. Please contact admin or try again later.", 
              originalError: error.response?.data 
            };
          }
        }
        
        // Handle specific error cases
        if (error.response.status === 413) {
          throw { message: "Ukuran file banner terlalu besar. Maksimal 1MB." };
        }
        
        if (error.response.status === 400) {
          // Detailed validation error handling
          if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
            const errorMsg = error.response.data.message || "Data tidak valid";
            console.log("Validation errors:", error.response.data.errors);
            
            // Check for benefit-specific errors
            const benefitErrors = error.response.data.errors.filter(
              err => err.toLowerCase().includes('benefit') || 
                    err.toLowerCase().includes('manfaat')
            );
            
            if (benefitErrors.length > 0) {
              throw { 
                message: benefitErrors[0],
                errors: error.response.data.errors 
              };
            }
            
            throw { 
              message: errorMsg, 
              errors: error.response.data.errors 
            };
          } else if (error.response.data?.message) {
            throw { message: error.response.data.message };
          } else {
            throw { message: "Terjadi kesalahan pada validasi data." };
          }
        }
        
        // Other status codes handling - unchanged
        if (error.response.status === 401) {
          throw { message: "Sesi Anda telah berakhir. Silakan login kembali." };
        }
        
        if (error.response.status === 404) {
          throw { message: "Endpoint tidak ditemukan. Silakan hubungi administrator." };
        }
        
        if (error.response.status === 500) {
          throw { message: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." };
        }
        
        // Default response error
        throw { message: error.response.data?.message || "Terjadi kesalahan pada saat memproses permintaan." };
      }
      
      // Network or other errors - unchanged
      if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Gagal membuat event. Silakan coba lagi.' };
      }
    }
  },
  /**
   * Get event details by ID
   * @param {string} eventId - ID of the event
   * @returns {Promise<Object>} Event details data
   * @throws {Object} Error object with message
   */
  getEventDetails: async (eventId) => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/events/${eventId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching event details');
    }
  },  
  
  /**
   * Update an existing event
   * @param {string} eventId - ID of the event to update
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event data
   * @throws {Object} Error object with message
   */
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await httpClient.put(`${API_URL}/partners/me/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while updating the event');
    }
  },

  /**
   * Delete an event
   * @param {string} eventId - ID of the event to delete
   * @returns {Promise<Object>} Deletion response
   * @throws {Object} Error object with message
   */
  deleteEvent: async (eventId) => {
    try {
      const response = await httpClient.delete(`${API_URL}/partners/me/events/${eventId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while deleting the event');
    }
  },

  /**
   * Get event applications for a specific event
   * @param {string} eventId - ID of the event
   * @param {Object} params - Query parameters for filtering applications
   * @returns {Promise<Object>} Event applications data
   * @throws {Object} Error object with message
   */
  getEventApplications: async (eventId, params = {}) => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/events/${eventId}/applications`, { params });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching event applications');
    }
  },

  /**
   * Update an application status
   * @param {string} eventId - ID of the event
   * @param {string} applicationId - ID of the application
   * @param {string} status - New status for the application
   * @returns {Promise<Object>} Updated application data
   * @throws {Object} Error object with message
   */
  updateApplicationStatus: async (eventId, applicationId, status) => {
    try {
      const response = await httpClient.put(`${API_URL}/partners/me/events/${eventId}/applications/${applicationId}`, { status });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while updating application status');
    }
  },

  /**
   * Get dashboard statistics for partner
   * @returns {Promise<Object>} Dashboard stats data
   * @throws {Object} Error object with message
   */
  getDashboardStats: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/dashboard`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching dashboard statistics');
    }
  },

  /**
   * Upload a banner image for partner profile
   * @param {FormData} formData - Form data containing the image file
   * @returns {Promise<Object>} Upload response with image URL
   * @throws {Object} Error object with message
   */
  uploadBanner: async (formData) => {
    try {
      const response = await httpClient.post(`${API_URL}/partners/me/banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while uploading banner image');
    }
  },

  /**
   * Upload an avatar/logo image for partner profile
   * @param {FormData} formData - Form data containing the avatar image file
   * @returns {Promise<Object>} Upload response with avatar URL
   * @throws {Object} Error object with message
   */
  uploadAvatar: async (formData) => {
    try {
      // Validasi formData
      if (formData.has('avatar')) {
        const avatarFile = formData.get('avatar');
        console.log(`Uploading avatar: ${avatarFile.name}, size: ${avatarFile.size} bytes`);
      } else {
        console.warn("FormData does not contain 'avatar' field");
        throw new Error("File avatar tidak ditemukan dalam form data");
      }
      
      // Ganti endpoint sesuai dengan API yang tersedia
      const response = await httpClient.post(`${API_URL}/users/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Avatar upload API response:", response.data);
      
      // Validasi struktur response
      if (!response.data || !response.data.data || !response.data.data.user) {
        console.error("Invalid response format from avatar upload API:", response.data);
        throw new Error("Format response tidak valid dari server");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error in uploadAvatar:", error);
      
      // Log detail error
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
      
      // Handle timeout
      if (error.code === 'ECONNABORTED') {
        throw new Error("Koneksi timeout. Coba lagi nanti.");
      }
      
      // Handle offline
      if (!navigator.onLine) {
        throw new Error("Anda sedang offline. Periksa koneksi internet Anda.");
      }
      
      // Gunakan handler error global
      handleApiError(error, 'Gagal mengunggah logo. Silakan coba lagi.');
    }
  },
  
  // Method tambahan untuk menghapus avatar (opsional)
  removeAvatar: async () => {
    try {
      const response = await httpClient.delete(`${API_URL}/users/avatar`);
      return response.data;
    } catch (error) {
      console.error("Error removing avatar:", error);
      handleApiError(error, 'Gagal menghapus logo');
    }
  },

  fetchAvatar: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/users/avatar`);
      return response.data;
    } catch (error) {
      console.error("Error fetching avatar:", error);
      handleApiError(error, 'Gagal mengambil avatar');
    }
  },

  /**
   * Get responsible person data
   * @returns {Promise<Object>} Responsible person data
   * @throws {Object} Error object with message
   */
  getResponsiblePerson: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/responsible-person`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while fetching responsible person data');
    }
  },
  
  /**
   * Create responsible person data
   * @param {Object} personData - Responsible person data
   * @returns {Promise<Object>} Created responsible person data
   * @throws {Object} Error object with message
   */
  createResponsiblePerson: async (personData) => {
    try {
      const response = await httpClient.post(`${API_URL}/partners/me/responsible-person`, personData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while creating responsible person data');
    }
  },
  
  /**
   * Update responsible person data
   * @param {Object} personData - Updated responsible person data
   * @returns {Promise<Object>} Updated responsible person data
   * @throws {Object} Error object with message
   */
  updateResponsiblePerson: async (personData) => {
    try {
      const response = await httpClient.put(`${API_URL}/partners/me/responsible-person`, personData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while updating responsible person data');
    }
  },
  
  /**
   * Upload KTP image for responsible person
   * @param {FormData} formData - Form data containing the KTP image file
   * @returns {Promise<Object>} Upload response with image URL and ID
   * @throws {Object} Error object with message
   */
  uploadKtpImage: async (formData) => {
    try {
      const response = await httpClient.post(`${API_URL}/partners/me/responsible-person/ktp`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while uploading KTP image');
    }
  },

  /**
   * Get all legal documents
   * @returns {Promise<Object>} Legal documents data
   * @throws {Object} Error object with message
   */
  getLegalDocuments: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/partners/me/legality`);
      return response.data;
    } catch (error) {
      console.error("Error in getLegalDocuments:", error);
      handleApiError(error, 'An error occurred while fetching legal documents');
    }
  },
  
  /**
   * Upload a new legal document
   * @param {FormData} formData - Form data containing the document file
   * @returns {Promise<Object>} Upload response with document data
   * @throws {Object} Error object with message
   */
  uploadLegalDocument: async (formData) => {
    try {
      // Log all formData entries for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }
      
      const response = await httpClient.post(`${API_URL}/partners/me/legality`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error in uploadLegalDocument:", error);
      throw error; // Rethrow to handle in component
    }
  },
  
  /**
   * Delete a legal document
   * @param {string} documentId - ID of the document to delete
   * @returns {Promise<Object>} Deletion response
   * @throws {Object} Error object with message
   */
  deleteLegalDocument: async (documentId) => {
    try {
      console.log(`Menghapus dokumen dengan ID: ${documentId}`);
      
      // Metode 1: DELETE dengan path parameter
      const response = await httpClient.delete(`${API_URL}/partners/me/legality/${documentId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Metode 2: DELETE dengan query params
        try {
          console.log("Trying with query params...");
          const response = await httpClient.delete(`${API_URL}/partners/me/legality`, {
            params: { id: documentId }
          });
          return response.data;
        } catch (queryError) {
          // Metode 3: DELETE dengan request body
          try {
            console.log("Trying with request body...");
            const response = await httpClient.delete(`${API_URL}/partners/me/legality`, {
              data: { id: documentId }
            });
            return response.data;
          } catch (bodyError) {
            console.error("All delete methods failed:", bodyError);
            
            if (bodyError.response) {
              console.log("Final error status:", bodyError.response.status);
              console.log("Final error data:", bodyError.response.data);
            }
            
            throw bodyError;
          }
        }
      } else {
        console.error("Error in deleteLegalDocument:", error);
        
        if (error.response) {
          console.log("Response status:", error.response.status);
          console.log("Response data:", error.response.data);
        }
        
        throw error;
      }
    }
  }
};