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
      try {
        await httpClient.get(`${API_URL}/partners/me/profile`);
        const response = await httpClient.put(`${API_URL}/partners/me/profile`, profileData);
        return response.data;
      } catch (checkError) {
        if (checkError.response?.status === 404) {
          const response = await httpClient.post(`${API_URL}/partners/me/profile`, profileData);
          return response.data;
        } else {
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
  createEvent: async (formData) => {
    try {
      let hasBenefits = false;
      let benefitCount = 0;
      let categoryCount = 0;
      
      for (let [key, value] of formData.entries()) {
        if (key === 'benefitIds[]') {
          hasBenefits = true;
          benefitCount++;
        }
        
        if (key === 'categoryIds[]') {
          categoryCount++;
        }
      }
      
      if (!hasBenefits || benefitCount === 0) {
        throw { message: "Please select at least one event benefit" };
      }
      
      if (categoryCount === 0) {
        throw { message: "Please select at least one event category" };
      }
      
      const response = await httpClient.post(`${API_URL}/partners/me/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Request-Source': 'React-App',
        },
        timeout: 60000
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          try {
            const minimalFormData = new FormData();
            
            const title = formData.get('title') || 'Default Title';
            const type = formData.get('type') || 'OPEN';
            const description = formData.get('description') || 'Default Description';
            const requirement = formData.get('requirement') || 'Default Requirement';
            const contactPerson = formData.get('contactPerson') || '081234567890';
            const startAt = formData.get('startAt') || new Date().toISOString();
            const province = formData.get('province') || 'Default Province';
            const regency = formData.get('regency') || 'Default Regency';
            
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
            
            const categoryIds = formData.getAll('categoryIds[]');
            if (categoryIds && categoryIds.length > 0) {
              minimalFormData.append('categoryIds[]', categoryIds[0]);
            } else {
              throw new Error("No valid category ID");
            }
            
            const benefitIds = formData.getAll('benefitIds[]');
            if (benefitIds && benefitIds.length > 0) {
              minimalFormData.append('benefitIds[]', benefitIds[0]);
            } else {
              throw new Error("No valid benefit ID");
            }
            
            if (formData.get('banner')) {
              minimalFormData.append('banner', formData.get('banner'));
            }
            
            const minimalResponse = await httpClient.post(`${API_URL}/partners/me/events`, minimalFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-Retry-Attempt': 'true'
              },
              timeout: 60000
            });
            
            return minimalResponse.data;
          } catch (retryError) {
            throw { 
              message: "Server error persists even with minimal data. Please contact admin or try again later.", 
              originalError: error.response?.data 
            };
          }
        }
        
        if (error.response.status === 413) {
          throw { message: "Banner file size is too large. Maximum 1MB allowed." };
        }
        
        if (error.response.status === 400) {
          if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
            const errorMsg = error.response.data.message || "Invalid data";
            
            const benefitErrors = error.response.data.errors.filter(
              err => err.toLowerCase().includes('benefit')
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
            throw { message: "Data validation error occurred." };
          }
        }
        
        if (error.response.status === 401) {
          throw { message: "Your session has expired. Please login again." };
        }
        
        if (error.response.status === 404) {
          throw { message: "Endpoint not found. Please contact administrator." };
        }
        
        if (error.response.status === 500) {
          throw { message: "Server error occurred. Please try again later." };
        }
        
        throw { message: error.response.data?.message || "An error occurred while processing the request." };
      }
      
      if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Failed to create event. Please try again.' };
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
   * @param {FormData} formData - Form data containing the logo image file and profile data
   * @returns {Promise<Object>} Upload response with avatar URL
   * @throws {Object} Error object with message
   */
  uploadAvatar: async (formData) => {
    try {
      if (!formData.has('logo')) {
        throw new Error("Logo file not found in form data");
      }
      
      const logoFile = formData.get('logo');
      
      // Strategy 1: Check if profile exists first
      let profileExists = false;
      try {
        const existingProfile = await httpClient.get(`${API_URL}/partners/me/profile`);
        profileExists = existingProfile && existingProfile.data;
      } catch (getError) {
        profileExists = false;
      }
      
      // Strategy 2: Use PUT if profile exists, POST if not
      const method = profileExists ? 'PUT' : 'POST';
      
      try {
        const response = await httpClient({
          method: method.toLowerCase(),
          url: `${API_URL}/partners/me/profile`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000,
          maxContentLength: 10 * 1024 * 1024,
          maxBodyLength: 10 * 1024 * 1024,
        });
        
        if (response.data && response.data.data && response.data.data.avatarUrl) {
          return response.data;
        } else if (response.data && response.data.avatarUrl) {
          return {
            data: {
              avatarUrl: response.data.avatarUrl
            }
          };
        } else {
          throw new Error("Response does not contain avatarUrl");
        }
      } catch (primaryError) {
        // Strategy 3: If first method fails, try the alternative
        const alternativeMethod = method === 'PUT' ? 'POST' : 'PUT';
        
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
          
          if (response.data && response.data.data && response.data.data.avatarUrl) {
            return response.data;
          } else if (response.data && response.data.avatarUrl) {
            return {
              data: {
                avatarUrl: response.data.avatarUrl
              }
            };
          } else {
            throw new Error("Response does not contain avatarUrl");
          }
        } catch (alternativeError) {
          // Strategy 4: Try with minimal data if still failing
          if (primaryError.response?.status === 500) {
            // Create minimal FormData with only logo and required fields
            const minimalFormData = new FormData();
            minimalFormData.append('logo', logoFile);
            
            const currentData = formData.get('organizationType') || 'COMMUNITY';
            const currentAddress = formData.get('organizationAddress') || 'Default Address';
            const currentInstagram = formData.get('instagram') || 'default_instagram';
            
            minimalFormData.append('organizationType', currentData);
            minimalFormData.append('organizationAddress', currentAddress);
            minimalFormData.append('instagram', currentInstagram);
            
            const response = await httpClient.put(`${API_URL}/partners/me/profile`, minimalFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-Retry-Minimal': 'true'
              },
              timeout: 60000,
            });
            
            if (response.data && response.data.data && response.data.data.avatarUrl) {
              return response.data;
            } else if (response.data && response.data.avatarUrl) {
              return {
                data: {
                  avatarUrl: response.data.avatarUrl
                }
              };
            } else {
              throw new Error("Minimal response does not contain avatarUrl");
            }
          } else {
            throw primaryError;
          }
        }
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 500) {
        const errorMessage = error.response.data?.message;
        
        if (errorMessage?.includes('image')) {
          throw new Error("Server failed to process image. Try a different image or contact administrator.");
        } else {
          throw new Error(`Server error: ${errorMessage || 'A server error occurred'}`);
        }
      }
      
      if (error.response?.status === 413) {
        throw new Error("File size too large. Maximum 200KB allowed");
      }
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message;
        
        if (errorMessage?.includes('already has a profile')) {
          throw new Error("Profile already exists. Trying update method...");
        } else if (errorMessage?.includes('Invalid data')) {
          throw new Error(`Validation failed: ${errorMessage}`);
        } else {
          throw new Error(errorMessage || "Invalid data");
        }
      }
      
      // Handle timeouts
      if (error.code === 'ECONNABORTED') {
        throw new Error("Connection timeout. Try again later or use a smaller image.");
      }
      
      // Handle offline state
      if (!navigator.onLine) {
        throw new Error("You are offline. Check your internet connection.");
      }
      
      throw new Error(error.message || 'Failed to upload logo. Please try again.');
    }
  },
  
  /**
   * Remove avatar/logo
   * @returns {Promise<Object>} Removal response
   * @throws {Object} Error object with message
   */
  removeAvatar: async () => {
    try {
      const response = await httpClient.delete(`${API_URL}/users/avatar`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to remove logo');
    }
  },

  /**
   * Fetch avatar/logo
   * @returns {Promise<Object>} Avatar data
   * @throws {Object} Error object with message
   */
  fetchAvatar: async () => {
    try {
      const response = await httpClient.get(`${API_URL}/users/avatar`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch avatar');
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
      // Handle 404 (no data yet) as normal condition
      if (error.response?.status === 404) {
        return { message: "No responsible person data yet", data: null };
      }
      handleApiError(error, 'An error occurred while fetching responsible person data');
    }
  },

  /**
   * Update responsible person data using try POST first, then PUT approach
   * @param {Object} personData - Responsible person data
   * @param {File} ktpFile - KTP image file (optional)
   * @returns {Promise<Object>} Updated responsible person data
   * @throws {Object} Error object with message
   */
  updateResponsiblePerson: async (personData, ktpFile = null) => {
    try {
      // Create FormData with correct field names for BE
      const formData = new FormData();
      
      // Personal data
      formData.append('nik', personData.nik);
      formData.append('fullName', personData.fullName);
      formData.append('phoneNumber', personData.phoneNumber);
      formData.append('position', personData.position);
      
      // Only use 'ktp' field for KTP file
      if (ktpFile && ktpFile instanceof File) {
        formData.append('ktp', ktpFile);
      } else if (personData.ktpImageId) {
        // If no new file but has old image ID, send that ID
        formData.append('ktpImageId', personData.ktpImageId);
      }
      
      // NEW APPROACH: Try POST first
      try {
        const postResponse = await httpClient.post(`${API_URL}/partners/me/responsible-person`, formData, {
          // Important: Don't set Content-Type header for FormData
          timeout: 60000 
        });
        
        return postResponse.data;
      } catch (postError) {
        // If POST fails, try PUT
        const putResponse = await httpClient.put(`${API_URL}/partners/me/responsible-person`, formData, {
          // Important: Don't set Content-Type header for FormData
          timeout: 60000 
        });
        
        return putResponse.data;
      }
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.message) {
        throw new Error(`Server error: ${error.response.data.message}`);
      }
      
      handleApiError(error, 'An error occurred while updating responsible person data');
    }
  },

  /**
   * Create responsible person data (for new data)
   * @param {Object} personData - Responsible person data
   * @param {File} ktpFile - KTP image file (required for new data)
   * @returns {Promise<Object>} Created responsible person data
   * @throws {Object} Error object with message
   */
  createResponsiblePerson: async (personData, ktpFile) => {
    try {
      // For create, use same endpoint with PUT since BE uses PUT
      return await partnerService.updateResponsiblePerson(personData, ktpFile);
    } catch (error) {
      handleApiError(error, 'An error occurred while creating responsible person data');
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
      // Handle 404 as normal condition (no documents yet)
      if (error.response?.status === 404) {
        return { message: "No legal documents yet", data: null };
      }
      
      handleApiError(error, 'An error occurred while fetching legal documents');
    }
  },

  /**
   * Upload legal document
   * @param {FormData} formData - Form data with document file and metadata
   * @returns {Promise<Object>} Upload response
   * @throws {Object} Error object with message
   */
  uploadLegalDocument: async (formData) => {
    try {
      // Basic validation
      if (!formData.has('document')) {
        throw new Error("Document file not found");
      }
      
      if (!formData.has('documentName')) {
        throw new Error("Document name cannot be empty");
      }
      
      // Get original file
      const documentFile = formData.get('document');
      if (!documentFile || !(documentFile instanceof File)) {
        throw new Error("Invalid document file");
      }
      
      // Create simple FormData
      const simpleFormData = new FormData();
      simpleFormData.append('documentName', formData.get('documentName'));
      simpleFormData.append('document', documentFile);
      
      // Add information if available
      if (formData.has('information')) {
        simpleFormData.append('information', formData.get('information'));
      }
      
      try {
        // Send request with multipart/form-data header
        const response = await httpClient.post(
          `${API_URL}/partners/me/legality`, 
          simpleFormData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 60000
          }
        );
        
        return response.data;
      } catch (uploadError) {
        // If upload fails with file not found, try alternative approach
        if (uploadError.response?.status === 400 && uploadError.response?.data?.message?.includes('not found')) {
          // Create new FormData from scratch
          const directFormData = new FormData();
          directFormData.append('documentName', formData.get('documentName'));
          directFormData.append('document', new Blob([documentFile], { type: documentFile.type }), documentFile.name);
          
          if (formData.has('information')) {
            directFormData.append('information', formData.get('information'));
          }
          
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
          return responseData;
        }
        
        throw uploadError;
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || "Failed to upload document");
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
      // Validate required fields exist
      if (!formData.has('logo')) {
        throw new Error("Logo file is required");
      }
      
      const logoFile = formData.get('logo');
      
      // STRICT validation against BE requirements
      if (logoFile.size > 200 * 1024) { // 200KB in bytes
        throw new Error(`Logo too large: ${(logoFile.size / 1024).toFixed(2)}KB. Maximum 200KB.`);
      }
      
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(logoFile.type)) {
        throw new Error(`File format ${logoFile.type} not supported. Use PNG, JPG, or JPEG.`);
      }
      
      // Simple fetch implementation
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/partners/me/profile`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || `Server responded with status ${response.status}`,
          data: responseData
        };
      }
      
      return responseData;
    } catch (error) {
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
      handleApiError(error, 'Failed to get registrant data');
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
      handleApiError(error, 'Failed to get registrant details');
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
        throw new Error('Status must be "accepted" or "rejected"');
      }
      
      const response = await httpClient.post(
        `${API_URL}/partners/me/events/${eventId}/registrants/${registrantId}`,
        { status: status.toLowerCase() }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to review registrant');
    }
  },
};