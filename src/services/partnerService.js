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
      // First check if the profile exists
      try {
        await httpClient.get(`${API_URL}/partners/me/profile`);
        // If we get here, profile exists, update it
        const response = await httpClient.put(`${API_URL}/partners/me/profile`, profileData);
        return response.data;
      } catch (checkError) {
        // If profile doesn't exist, create it
        if (checkError.response?.status === 404) {
          console.log("Profile doesn't exist, creating instead of updating");
          const response = await httpClient.post(`${API_URL}/partners/me/profile`, profileData);
          return response.data;
        } else {
          // Re-throw other errors
          throw checkError;
        }
      }
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

// ...existing code...

/**
 * Upload an avatar/logo image for partner profile
 * @param {FormData} formData - Form data containing the logo image file and profile data
 * @returns {Promise<Object>} Upload response with avatar URL
 * @throws {Object} Error object with message
 */
uploadAvatar: async (formData) => {
  try {
    // Validasi formData
    if (!formData.has('logo')) {
      throw new Error("File logo tidak ditemukan dalam form data");
    }
    
    const logoFile = formData.get('logo');
    console.log(`Uploading logo: ${logoFile.name}, size: ${logoFile.size} bytes`);
    
    // Debug: Log all form data
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    // Strategi 1: Coba GET profile dulu untuk cek apakah profile sudah ada
    let profileExists = false;
    try {
      console.log("Checking if profile exists...");
      const existingProfile = await httpClient.get(`${API_URL}/partners/me/profile`);
      profileExists = existingProfile && existingProfile.data;
      console.log("Profile exists:", profileExists);
    } catch (getError) {
      console.log("Profile check failed or doesn't exist:", getError.response?.status);
      profileExists = false;
    }
    
    // Strategi 2: Jika profile ada, coba update dengan PUT, jika tidak ada, coba POST
    const method = profileExists ? 'PUT' : 'POST';
    console.log(`Using ${method} method for avatar upload...`);
    
    try {
      const response = await httpClient({
        method: method.toLowerCase(),
        url: `${API_URL}/partners/me/profile`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000, // Increase timeout to 60 seconds
        maxContentLength: 10 * 1024 * 1024, // 10MB
        maxBodyLength: 10 * 1024 * 1024, // 10MB
      });
      
      console.log(`Logo upload API response (${method}):`, response.data);
      
      // Validasi struktur response
      if (response.data && response.data.data && response.data.data.avatarUrl) {
        return response.data;
      } else if (response.data && response.data.avatarUrl) {
        // Fallback jika struktur response berbeda
        return {
          data: {
            avatarUrl: response.data.avatarUrl
          }
        };
      } else {
        throw new Error("Response tidak mengandung avatarUrl");
      }
    } catch (primaryError) {
      console.log(`${method} method failed:`, primaryError.response?.status, primaryError.response?.data?.message);
      
      // Strategi 3: Jika PUT gagal, coba POST (dan sebaliknya)
      const alternativeMethod = method === 'PUT' ? 'POST' : 'PUT';
      console.log(`Trying alternative method: ${alternativeMethod}`);
      
      try {
        const response = await httpClient({
          method: alternativeMethod.toLowerCase(),
          url: `${API_URL}/partners/me/profile`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000,
          maxContentLength: 10 * 1024 * 1024,
          maxBodyLength: 10 * 1024 * 1024,
        });
        
        console.log(`Logo upload API response (${alternativeMethod}):`, response.data);
        
        if (response.data && response.data.data && response.data.data.avatarUrl) {
          return response.data;
        } else if (response.data && response.data.avatarUrl) {
          return {
            data: {
              avatarUrl: response.data.avatarUrl
            }
          };
        } else {
          throw new Error("Response tidak mengandung avatarUrl");
        }
      } catch (alternativeError) {
        console.error(`Both ${method} and ${alternativeMethod} methods failed`);
        
        // Strategi 4: Coba dengan data minimal jika masih gagal
        if (primaryError.response?.status === 500) {
          console.log("Trying with minimal data due to server error...");
          
          try {
            // Buat FormData minimal hanya dengan logo dan data wajib
            const minimalFormData = new FormData();
            minimalFormData.append('logo', logoFile);
            
            // Hanya tambahkan data yang benar-benar diperlukan
            const currentData = formData.get('organizationType') || 'COMMUNITY';
            const currentAddress = formData.get('organizationAddress') || 'Default Address';
            const currentInstagram = formData.get('instagram') || 'default_instagram';
            
            minimalFormData.append('organizationType', currentData);
            minimalFormData.append('organizationAddress', currentAddress);
            minimalFormData.append('instagram', currentInstagram);
            
            console.log("Minimal FormData:");
            for (let [key, value] of minimalFormData.entries()) {
              if (value instanceof File) {
                console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`);
              } else {
                console.log(`${key}: ${value}`);
              }
            }
            
            const response = await httpClient.put(`${API_URL}/partners/me/profile`, minimalFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-Retry-Minimal': 'true'
              },
              timeout: 60000,
            });
            
            console.log("Minimal data upload successful:", response.data);
            
            if (response.data && response.data.data && response.data.data.avatarUrl) {
              return response.data;
            } else if (response.data && response.data.avatarUrl) {
              return {
                data: {
                  avatarUrl: response.data.avatarUrl
                }
              };
            } else {
              throw new Error("Response minimal tidak mengandung avatarUrl");
            }
          } catch (minimalError) {
            console.error("Minimal data approach also failed:", minimalError);
            throw primaryError; // Throw original error
          }
        } else {
          throw primaryError; // Throw original error
        }
      }
    }
  } catch (error) {
    console.error("Error in uploadAvatar:", error);
    
    // Enhanced error logging
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
      console.log("Response headers:", error.response.headers);
    }
    
    // Handle specific error cases
    if (error.response?.status === 500) {
      const errorMessage = error.response.data?.message;
      
      if (errorMessage?.includes('mengubah gambar') || errorMessage?.includes('image')) {
        throw new Error("Server gagal memproses gambar. Coba dengan gambar yang berbeda atau hubungi administrator.");
      } else {
        throw new Error(`Server error: ${errorMessage || 'Terjadi kesalahan pada server'}`);
      }
    }
    
    if (error.response?.status === 413) {
      throw new Error("Ukuran file terlalu besar. Maksimal 200KB");
    }
    
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message;
      
      if (errorMessage?.includes('sudah memiliki profile')) {
        throw new Error("Profile sudah ada. Mencoba dengan method update...");
      } else if (errorMessage?.includes('Data tidak valid')) {
        throw new Error(`Validasi gagal: ${errorMessage}`);
      } else {
        throw new Error(errorMessage || "Data tidak valid");
      }
    }
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error("Koneksi timeout. Coba lagi nanti atau gunakan gambar yang lebih kecil.");
    }
    
    // Handle offline
    if (!navigator.onLine) {
      throw new Error("Anda sedang offline. Periksa koneksi internet Anda.");
    }
    
    // Default error handling
    throw new Error(error.message || 'Gagal mengunggah logo. Silakan coba lagi.');
  }
},

// ...existing code...
  
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
    // Handle 404 (tidak ada data) sebagai kondisi normal
    if (error.response?.status === 404) {
      return { message: "Data penanggung jawab belum ada", data: null };
    }
    handleApiError(error, 'An error occurred while fetching responsible person data');
  }
},

// Di dalam method updateResponsiblePerson

/**
 * Update responsible person data dengan pendekatan try POST first, then PUT
 * @param {Object} personData - Responsible person data
 * @param {File} ktpFile - KTP image file (optional)
 * @returns {Promise<Object>} Updated responsible person data
 * @throws {Object} Error object with message
 */
updateResponsiblePerson: async (personData, ktpFile = null) => {
  try {
    console.log("Updating responsible person data...");
    console.log("Person data:", personData);
    console.log("KTP file:", ktpFile);
    
    // Buat FormData dengan nama field yang benar sesuai BE
    const formData = new FormData();
    
    // Data personal
    formData.append('nik', personData.nik);
    formData.append('fullName', personData.fullName);
    formData.append('phoneNumber', personData.phoneNumber);
    formData.append('position', personData.position);
    
    // HANYA gunakan field 'ktp' untuk file KTP
    // Pastikan file KTP valid
    if (ktpFile && ktpFile instanceof File) {
      formData.append('ktp', ktpFile);
      console.log(`Adding KTP file: ${ktpFile.name}, size: ${ktpFile.size} bytes`);
    } else if (personData.ktpImageId) {
      // Jika tidak ada file baru tapi ada ID gambar lama, kirim ID tersebut
      formData.append('ktpImageId', personData.ktpImageId);
      console.log(`Using existing KTP image ID: ${personData.ktpImageId}`);
    }
    
    // Debug: Log FormData
    console.log("FormData for responsible person update:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    // PENDEKATAN BARU: Coba POST terlebih dahulu
    console.log("Trying POST first for responsible person...");
    try {
      const postResponse = await httpClient.post(`${API_URL}/partners/me/responsible-person`, formData, {
        // PENTING: Jangan set Content-Type header untuk FormData
        timeout: 60000 
      });
      
      console.log("POST responsible person successful:", postResponse.data);
      return postResponse.data;
    } catch (postError) {
      console.log("POST attempt failed:", postError.response?.status, postError.response?.data);
      
      // Jika POST gagal, coba PUT
      console.log("Trying PUT for responsible person...");
      const putResponse = await httpClient.put(`${API_URL}/partners/me/responsible-person`, formData, {
        // PENTING: Jangan set Content-Type header untuk FormData
        timeout: 60000 
      });
      
      console.log("PUT responsible person successful:", putResponse.data);
      return putResponse.data;
    }
  } catch (error) {
    console.error("Error updating responsible person:", error);
    
    if (error.response?.status === 500 && error.response?.data?.message) {
      throw new Error(`Server error: ${error.response.data.message}`);
    }
    
    handleApiError(error, 'An error occurred while updating responsible person data');
  }
},
/**
 * Create responsible person data (untuk data baru)
 * @param {Object} personData - Responsible person data
 * @param {File} ktpFile - KTP image file (required for new data)
 * @returns {Promise<Object>} Created responsible person data
 * @throws {Object} Error object with message
 */
createResponsiblePerson: async (personData, ktpFile) => {
  try {
    console.log("Creating responsible person data...");
    
    // Untuk create, gunakan same endpoint dengan PUT karena BE menggunakan PUT
    return await partnerService.updateResponsiblePerson(personData, ktpFile);
  } catch (error) {
    console.error("Error creating responsible person:", error);
    handleApiError(error, 'An error occurred while creating responsible person data');
  }
},

 /**
 * Get all legal documents (sesuai dokumentasi BE)
 * @returns {Promise<Object>} Legal documents data
 * @throws {Object} Error object with message
 */
getLegalDocuments: async () => {
  try {
    console.log("Fetching legal documents...");
    const response = await httpClient.get(`${API_URL}/partners/me/legality`);
    console.log("Legal documents response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getLegalDocuments:", error);
    
    // Handle 404 sebagai kondisi normal (belum ada dokumen)
    if (error.response?.status === 404) {
      return { message: "Belum ada dokumen legalitas", data: null };
    }
    
    handleApiError(error, 'An error occurred while fetching legal documents');
  }
},

// Update fungsi uploadLegalDocument

uploadLegalDocument: async (formData) => {
  try {
    console.log("=== UPLOADING LEGAL DOCUMENT ===");
    
    // Basic validation
    if (!formData.has('document')) {
      throw new Error("File dokumen tidak ditemukan");
    }
    
    if (!formData.has('documentName')) {
      throw new Error("Nama dokumen tidak boleh kosong");
    }
    
    // Get original file
    const documentFile = formData.get('document');
    if (!documentFile || !(documentFile instanceof File)) {
      throw new Error("File dokumen tidak valid");
    }
    
    console.log(`Document file details: ${documentFile.name}, type: ${documentFile.type}, size: ${documentFile.size} bytes`);
    
    // PENTING: Buat FormData baru yang sangat sederhana
    const simpleFormData = new FormData();
    simpleFormData.append('documentName', formData.get('documentName'));
    simpleFormData.append('document', documentFile);
    
    // Tambahkan information jika ada
    if (formData.has('information')) {
      simpleFormData.append('information', formData.get('information'));
    }
    
    // Debug log
    console.log("Simple FormData prepared for upload:");
    for (let [key, value] of simpleFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    console.log("Sending document...");
    
    // PERUBAHAN KRITIS: Gunakan konfigurasi axios tanpa Content-Type manual
    try {
      // Kirim request dan WAJIB sertakan header multipart/form-data
      const response = await httpClient.post(
        `${API_URL}/partners/me/legality`, 
        simpleFormData, 
        {
          // PENTING: Sertakan header multipart/form-data
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000
        }
      );
      
      console.log("Upload success:", response.data);
      return response.data;
    } catch (uploadError) {
      console.error("Upload failed:", uploadError);
      
      // Tambahkan debugging info lebih detail
      if (uploadError.response) {
        console.log("Response status:", uploadError.response.status);
        console.log("Response data:", uploadError.response.data);
        console.log("Response headers:", uploadError.response.headers);
        
        // Tampilkan request yang dikirim
        console.log("Request configuration:");
        console.log("- URL:", uploadError.config.url);
        console.log("- Method:", uploadError.config.method);
        console.log("- Headers:", uploadError.config.headers);
      }
      
      // Jika masih gagal, coba pendekatan alternatif dengan FormData manual
      if (uploadError.response?.status === 400 && uploadError.response?.data?.message?.includes('tidak ditemukan')) {
        console.log("Trying alternative approach with direct FormData...");
        
        // Buat FormData baru dari awal
        const directFormData = new FormData();
        directFormData.append('documentName', formData.get('documentName'));
        directFormData.append('document', new Blob([documentFile], { type: documentFile.type }), documentFile.name);
        
        if (formData.has('information')) {
          directFormData.append('information', formData.get('information'));
        }
        
        try {
          const alternativeResponse = await fetch(`${API_URL}/partners/me/legality`, {
            method: 'POST',
            body: directFormData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!alternativeResponse.ok) {
            throw new Error(`Alternative approach failed with status ${alternativeResponse.status}`);
          }
          
          const responseData = await alternativeResponse.json();
          console.log("Alternative approach succeeded:", responseData);
          return responseData;
        } catch (alternativeError) {
          console.error("Alternative approach also failed:", alternativeError);
          throw new Error("Server tidak dapat memproses file dokumen melalui berbagai pendekatan. Silakan hubungi tim teknis.");
        }
      }
      
      throw uploadError;
    }
  } catch (error) {
    console.error("Error in uploadLegalDocument:", error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || "Gagal mengunggah dokumen");
  }
},


/**
 * Update partner profile with logo (optimized for backend requirements)
 * @param {FormData} formData - Form data with logo and profile fields
 * @returns {Promise<Object>} Update response
 * @throws {Object} Error object with message
 */
updatePartnerProfileWithLogo: async (formData) => {
  try {
    console.log("Updating partner profile with logo (optimized for BE requirements)");
    
    // Validate required fields exist
    if (!formData.has('logo')) {
      throw new Error("Logo file is required");
    }
    
    const logoFile = formData.get('logo');
    console.log(`Logo file: ${logoFile.name}, type: ${logoFile.type}, size: ${logoFile.size} bytes, size in KB: ${(logoFile.size / 1024).toFixed(2)}KB`);
    
    // STRICT validation against BE requirements
    if (logoFile.size > 200 * 1024) { // 200KB in bytes
      throw new Error(`Logo terlalu besar: ${(logoFile.size / 1024).toFixed(2)}KB. Maksimum 200KB.`);
    }
    
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(logoFile.type)) {
      throw new Error(`Format file ${logoFile.type} tidak didukung. Gunakan PNG, JPG, atau JPEG.`);
    }
    
    // Simple fetch implementation with additional logging
    const token = localStorage.getItem('token');
    
    console.log("Sending PUT request to /partners/me/profile with FormData:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`- ${key}: [File: ${value.name}, type: ${value.type}, size: ${(value.size / 1024).toFixed(2)}KB]`);
      } else {
        console.log(`- ${key}: ${value}`);
      }
    }
    
    const response = await fetch(`${API_URL}/partners/me/profile`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Response status: ${response.status}`);
    
    const responseData = await response.json();
    console.log("Response data:", responseData);
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || `Server responded with status ${response.status}`,
        data: responseData
      };
    }
    
    return responseData;
  } catch (error) {
    console.error("Error updating profile with logo:", error);
    throw error;
  }
},


/**
 * Get registrants for a specific event with filtering, search and pagination
 * @param {string} eventId - ID of the event
 * @param {Object} params - Query parameters (status, limit, page, sort, s)
 * @returns {Promise<Object>} Registrants data with pagination
 * @throws {Object} Error object with message
 */
getEventRegistrants: async (eventId, params = {}) => {
  try {
    const response = await httpClient.get(
      `${API_URL}/partners/me/events/${eventId}/registrants`, 
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registrants:", error);
    handleApiError(error, 'Gagal mendapatkan data pendaftar');
  }
},

/**
 * Get detailed data for a specific registrant
 * @param {string} eventId - ID of the event
 * @param {string} registrantId - ID of the registrant (form response ID)
 * @returns {Promise<Object>} Detailed registrant data
 * @throws {Object} Error object with message
 */
getRegistrantDetail: async (eventId, registrantId) => {
  try {
    const response = await httpClient.get(
      `${API_URL}/partners/me/events/${eventId}/registrants/${registrantId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registrant detail:", error);
    handleApiError(error, 'Gagal mendapatkan detail pendaftar');
  }
},

/**
 * Review a registrant application (accept or reject)
 * @param {string} eventId - ID of the event
 * @param {string} registrantId - ID of the registrant (form response ID)
 * @param {string} status - Review status ('accepted' or 'rejected')
 * @returns {Promise<Object>} Updated registrant data
 * @throws {Object} Error object with message
 */
reviewRegistrant: async (eventId, registrantId, status) => {
  try {
    if (!['accepted', 'rejected'].includes(status.toLowerCase())) {
      throw new Error('Status harus "accepted" atau "rejected"');
    }
    
    const response = await httpClient.post(
      `${API_URL}/partners/me/events/${eventId}/registrants/${registrantId}`,
      { status: status.toLowerCase() }
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing registrant:", error);
    handleApiError(error, 'Gagal mereview pendaftar');
  }
},

};