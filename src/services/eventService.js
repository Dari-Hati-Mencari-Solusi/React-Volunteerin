const API_URL = import.meta.env.VITE_BE_BASE_URL;

export const fetchEvents = async (limit, categoryId = null) => {
  try {
    const params = { limit };
    if (categoryId) params.categoryId = categoryId;

    const response = await axios.get(`${API_URL}/partners/me/events`, {
      params,
      timeout: 5000
    });
    console.log('API Response:', response.data);
    if (response.status !== 200) {
      throw new Error('Failed to fetch events');
    }
    if (response.data.status !== 'success') {
      throw new Error('Failed to fetch events');
    }
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error('No events found');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    if (categoryId) {
      response.data.data = response.data.data.filter(event =>
        event.categories && event.categories.some(cat => cat.id === categoryId)
      );
    }
    console.log('Filtered Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    console.log('Limited Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    console.log('Limited Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    console.log('Limited Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    console.log('Limited Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    console.log('Limited Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    console.log('Limited Events:', response.data.data);
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }
    
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }
    if (response.data.data.length > limit) {
      response.data.data = response.data.data.slice(0, limit);
    }   
    if (response.data.data.length === 0) {
      throw new Error('No events found for the selected category');
    }

    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};
