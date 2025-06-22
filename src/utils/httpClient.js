import axios from 'axios';

// Create an axios instance with custom configuration
const httpClient = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Add token to request headers if available
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('[HTTP Client] Error', error.response?.status, 'from', error.config?.url + ':', error);

    // Handle unauthorized errors (401) - redirect to login
    if (error.response && error.response.status === 401) {
      // If the response includes a specific message, log it
      if (error.response.data && error.response.data.message) {
        console.warn('Authentication error:', error.response.data.message);
      }
      
      // Clear any existing auth tokens
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    
    // Handle not found errors (404)
    if (error.response && error.response.status === 404) {
      // Special handling for user registrations endpoint
      if (error.config.url.includes('/users/registrations')) {
        console.warn('User registrations endpoint not found, will use localStorage fallback');
        
        // Don't reject here - let the userService handle this specifically
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;