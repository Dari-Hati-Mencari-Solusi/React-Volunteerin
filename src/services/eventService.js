const API_URL = import.meta.env.VITE_BE_BASE_URL;

export const fetchEvents = async (limit, categoryId = null) => {
  try {
    const params = { limit };
    if (categoryId) params.categoryId = categoryId;

    const response = await axios.get(`${API_URL}/events`, {
      params,
      timeout: 5000
    });

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
