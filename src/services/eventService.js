import axios from 'axios';
const API_URL = import.meta.env.VITE_BE_BASE_URL || 'http://localhost:3000';

/**
 * Fetches all categories from the API
 * @returns {Promise<Object>} Categories data
 * @throws {Error} If the API request fails
 */
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      timeout: 8000
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format from categories API');
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

/**
 * Fetches events from the API with optional filtering
 * @param {number} limit - Maximum number of events to return
 * @param {string|null} categoryId - Optional category ID to filter events
 * @returns {Promise<Object>} Events data with pagination
 * @throws {Error} If the API request fails
 */
export const fetchEvents = async (limit, categoryId = null) => {
  try {
    validateApiUrl();
    
    const params = buildEventParams(limit, categoryId);
    
    const response = await axios.get(`${API_URL}/events`, {
      params,
      timeout: 8000 
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }

    const results = Array.isArray(response.data.data) ? response.data.data : [];
    
    // Apply limit if needed (fallback if API doesn't implement limit)
    const limitedResults = limit && results.length > limit ? results.slice(0, limit) : results;
    
    return {
      data: limitedResults,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

/**
 * Fetches a single event by ID
 * @param {string} eventId - ID of the event to fetch
 * @param {string} token - Optional authentication token
 * @returns {Promise<Object>} Event data
 * @throws {Error} If the API request fails
 */
export const fetchEventById = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_URL}/events/${eventId}`, {
      headers,
      timeout: 8000
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    handleEventFetchError(error);
  }
};

/**
 * Checks if the user is registered for an event
 * @param {string} eventId - ID of the event to check
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Registration status
 */
export const checkEventRegistrationStatus = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    validateToken(token);

    const response = await axios.get(`${API_URL}/event-registrations/check`, {
      params: { eventId },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to check registration status:', error);
    return { isRegistered: false };
  }
};

/**
 * Registers a user for an event
 * @param {string} eventId - ID of the event to register for
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Registration result
 * @throws {Error} If the API request fails
 */
export const registerForEvent = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    validateToken(token);

    const response = await axios.post(
      `${API_URL}/event-registrations`,
      { eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );
    
    return response.data;
  } catch (error) {
    handleRegistrationError(error);
  }
};

/**
 * Cancels a user's registration for an event
 * @param {string} eventId - ID of the event to cancel registration for
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Cancellation result
 * @throws {Error} If the API request fails
 */
export const cancelEventRegistration = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    validateToken(token);

    const response = await axios.delete(`${API_URL}/event-registrations`, {
      data: { eventId },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    return response.data;
  } catch (error) {
    handleCancellationError(error);
  }
};

/**
 * Gets all events saved by the user
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} Saved events
 * @throws {Error} If the API request fails
 */
export const getSavedEvents = async (token) => {
  try {
    validateApiUrl();
    validateToken(token);

    const response = await axios.get(`${API_URL}/saved-events`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 8000
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch saved events:', error);
    throw new Error('Gagal mengambil daftar event tersimpan');
  }
};

/**
 * Saves an event for the user
 * @param {string} eventId - ID of the event to save
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Save result
 * @throws {Error} If the API request fails
 */
export const saveEvent = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    validateToken(token);

    const response = await axios.post(
      `${API_URL}/saved-events`,
      { eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error('Event sudah disimpan sebelumnya');
    } else {
      throw new Error('Gagal menyimpan event');
    }
  }
};

/**
 * Removes an event from the user's saved events
 * @param {string} eventId - ID of the event to unsave
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Unsave result
 * @throws {Error} If the API request fails
 */
export const unsaveEvent = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    validateToken(token);

    const response = await axios.delete(`${API_URL}/saved-events`, {
      data: { eventId },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to unsave event:', error);
    throw new Error('Gagal menghapus event dari daftar tersimpan');
  }
};

/**
 * Checks if an event is saved by the user
 * @param {string} eventId - ID of the event to check
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Save status
 */
export const checkEventSaveStatus = async (eventId, token) => {
  try {
    validateApiUrl();
    validateEventId(eventId);
    validateToken(token);

    const response = await axios.get(`${API_URL}/saved-events/check`, {
      params: { eventId },
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to check save status:', error);
    return { isSaved: false };
  }
};

// Helper functions

/**
 * Validates that the API URL is configured
 * @throws {Error} If API URL is not configured
 */
const validateApiUrl = () => {
  if (!API_URL) {
    throw new Error('API URL not configured. Check your environment variables.');
  }
};

/**
 * Validates that an event ID is provided
 * @param {string} eventId - Event ID to validate
 * @throws {Error} If event ID is not provided
 */
const validateEventId = (eventId) => {
  if (!eventId) {
    throw new Error('Event ID is required');
  }
};

/**
 * Validates that a token is provided
 * @param {string} token - Token to validate
 * @throws {Error} If token is not provided
 */
const validateToken = (token) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }
};

/**
 * Builds parameters for event requests
 * @param {number} limit - Maximum number of events to return
 * @param {string|null} categoryId - Optional category ID to filter events
 * @returns {Object} Request parameters
 */
const buildEventParams = (limit, categoryId) => {
  const params = {};
  
  if (limit) {
    params.limit = limit;
  }
  
  if (categoryId) {
    params.categoryId = categoryId;
  }
  
  return params;
};

/**
 * Handles errors from event fetch requests
 * @param {Error} error - Error to handle
 * @throws {Error} Formatted error message
 */
const handleEventFetchError = (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      throw new Error('Event ini belum dirilis atau Anda tidak memiliki akses');
    } else if (error.response.status === 404) {
      throw new Error('Event tidak ditemukan');
    } else {
      throw new Error(error.response.data?.message || 'Terjadi kesalahan saat mengambil data event');
    }
  } else if (error.request) {
    throw new Error('Server tidak merespon. Silakan coba lagi nanti');
  } else {
    throw new Error(`Error: ${error.message}`);
  }
};

/**
 * Handles errors from registration requests
 * @param {Error} error - Error to handle
 * @throws {Error} Formatted error message
 */
const handleRegistrationError = (error) => {
  if (error.response) {
    const errorMsg = error.response.data?.message || 'Gagal mendaftar untuk event ini';
    throw new Error(errorMsg);
  } else if (error.request) {
    throw new Error('Server tidak merespon. Silakan coba lagi nanti');
  } else {
    throw new Error(`Error: ${error.message}`);
  }
};

/**
 * Handles errors from cancellation requests
 * @param {Error} error - Error to handle
 * @throws {Error} Formatted error message
 */
const handleCancellationError = (error) => {
  if (error.response) {
    const errorMsg = error.response.data?.message || 'Gagal membatalkan pendaftaran';
    throw new Error(errorMsg);
  } else if (error.request) {
    throw new Error('Server tidak merespon. Silakan coba lagi nanti');
  } else {
    throw new Error(`Error: ${error.message}`);
  }
};