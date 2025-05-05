import axios from 'axios';
const API_URL = import.meta.env.VITE_BE_BASE_URL;

// Periksa nilai API_URL
console.log('API_URL value:', API_URL);

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
    
    // Tidak perlu memeriksa response.data.status === 'success'
    // Karena API tidak mengembalikan field tersebut
    
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
    
    // Jangan menambahkan nested error message
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};