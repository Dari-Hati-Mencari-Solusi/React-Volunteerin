import axios from 'axios';
const API_URL = import.meta.env.VITE_BE_BASE_URL || 'http://localhost:3000';

// Periksa nilai API_URL
console.log('API_URL value:', API_URL);

// Function untuk fetch semua events (yang sudah ada)
export const fetchEvents = async (limit, categoryId = null) => {
  try {
    // Validasi parameter
    if (!API_URL) {
      throw new Error('API URL not configured. Check your environment variables.');
    }
    
    const params = { limit: limit || 10 }; // Default limit if none provided
    if (categoryId) params.categoryId = categoryId;

    console.log('Attempting to fetch events:', { API_URL, params });
    
    const response = await axios.get(`${API_URL}/events`, {
      params,
      timeout: 8000 // Increase timeout a bit
    });
    
    console.log('API Response:', response.data);
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    // Pastikan data adalah array, jika kosong tetap gunakan array kosong
    if (!Array.isArray(response.data.data)) {
      response.data.data = [];
    }
    
    // Apply limit to results
    let results = response.data.data;
    
    // Filter by category if specified
    if (categoryId) {
      results = results.filter(event =>
        event.categories && event.categories.some(cat => cat.id === categoryId)
      );
      console.log('Filtered Events by category:', results);
    }
    
    // Apply limit to final results
    if (limit && results.length > limit) {
      results = results.slice(0, limit);
    }
    
    console.log('Final Events:', results);
    response.data.data = results;
    
    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      url: error.config?.url || `${API_URL}/events`,
      params: error.config?.params,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack?.slice(0, 150) // Include part of stack trace
    });
    
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

// Function baru untuk fetch detail event berdasarkan ID
export const fetchEventById = async (eventId, token) => {
  try {
    if (!API_URL) {
      throw new Error('API URL not configured. Check your environment variables.');
    }
    
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    console.log(`Fetching event with ID: ${eventId}`);
    
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/events/${eventId}`, {
      headers,
      timeout: 8000
    });
    
    console.log('Event detail response:', response.data);
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      eventId,
      status: error.response?.status,
      data: error.response?.data
    });

    // Tangani berbagai jenis error
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
  }
};

// Function untuk check status pendaftaran user pada event tertentu
export const checkEventRegistrationStatus = async (eventId, token) => {
  try {
    if (!API_URL) {
      throw new Error('API URL not configured.');
    }
    
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/event-registrations/check`, {
      params: { eventId },
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to check registration status:', error);
    // Default to not registered if there's an error
    return { isRegistered: false };
  }
};