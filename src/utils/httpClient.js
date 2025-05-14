import axios from 'axios';

/**
 * Konfigurasi instance Axios
 * Client HTTP untuk melakukan requests ke API
 */
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout 10 detik
});

/**
 * Interceptor Request
 * Menambahkan token otentikasi ke header requests
 */
httpClient.interceptors.request.use(
  (config) => {
    // Tambahkan token ke header jika tersedia
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor Response
 * Menangani error dan mengatur logika global untuk responses
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      // Hapus token dan redirect ke login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Penanganan error lainnya
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan pada server';
    console.error('Response error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default httpClient;
