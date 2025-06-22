import axios from 'axios';

// Create axios instance with default config
const httpClient = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in all requests
httpClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (try both places where it might be stored)
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common API responses
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiry - redirect to login if 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Check if we're not already on the login page to avoid redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login-partner';
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;