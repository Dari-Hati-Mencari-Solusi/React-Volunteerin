import axios from 'axios';
const API_URL = import.meta.env.VITE_BE_BASE_URL || 'http://localhost:3000';

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

export const fetchEvents = async (limit, categoryId = null) => {
  try {
    if (!API_URL) {
      throw new Error('API URL not configured. Check your environment variables.');
    }
    
    // Set parameter request
    const params = {};
    
    // Tambahkan limit jika ada
    if (limit) {
      params.limit = limit;
    }
    
    // Tambahkan categoryId jika ada dan bukan null
    if (categoryId) {
      params.categoryId = categoryId;
      console.log('Including category filter:', categoryId);
    }
    
    console.log('Fetching events with params:', params);
    
    // Kirim request ke API
    const response = await axios.get(`${API_URL}/events`, {
      params,
      timeout: 8000 
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }

    if (!Array.isArray(response.data.data)) {
      response.data.data = [];
    }

    let results = response.data.data;
    
    console.log(`Retrieved ${results.length} events from API`);
    
    // Apply limit jika perlu (sebagai fallback jika API tidak menerapkan limit)
    if (limit && results.length > limit) {
      results = results.slice(0, limit);
      console.log(`Limited to ${results.length} events`);
    }
    
    return {
      data: results,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

export const fetchEventById = async (eventId, token) => {
  try {
    if (!API_URL) {
      throw new Error('API URL not configured');
    }
    
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/events/${eventId}`, {
      headers,
      timeout: 8000
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
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
    return { isRegistered: false };
  }
};

export const registerForEvent = async (eventId, token) => {
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
    if (error.response) {
      const errorMsg = error.response.data?.message || 'Gagal mendaftar untuk event ini';
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Server tidak merespon. Silakan coba lagi nanti');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export const cancelEventRegistration = async (eventId, token) => {
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
    if (error.response) {
      const errorMsg = error.response.data?.message || 'Gagal membatalkan pendaftaran';
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Server tidak merespon. Silakan coba lagi nanti');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export const getSavedEvents = async (token) => {
  try {
    if (!API_URL) {
      throw new Error('API URL not configured.');
    }
    
    if (!token) {
      throw new Error('Authentication token is required');
    }

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

export const saveEvent = async (eventId, token) => {
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

export const unsaveEvent = async (eventId, token) => {
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

export const checkEventSaveStatus = async (eventId, token) => {
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