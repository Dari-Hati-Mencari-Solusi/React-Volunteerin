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
 * Store user authentication data in localStorage
 * @param {string} token - JWT auth token
 * @param {Object|null} user - User data object
 * @returns {Object} Object containing token and user
 */
const storeUserData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token); // Store in both places for compatibility
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return { token, user };
};

/**
 * Authentication service containing methods for user authentication
 * and profile management
 */
export const authService = {
  /**
   * Get OAuth URL for Google authentication
   * @returns {string} Google OAuth URL
   */
  getGoogleOAuthUrl: () => `${API_URL}/auth/google`,
  
  /**
   * Get OAuth URL for Facebook authentication
   * @returns {string} Facebook OAuth URL
   */
  getFacebookOAuthUrl: () => `${API_URL}/auth/facebook`,

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   * @throws {Object} Error object with message
   */
  login: async (email, password) => {
    try {
      console.log("Logging in with email:", email);
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format from server");
      }
      
      const { token, user } = response.data.data;
      
      // Store login response in sessionStorage for fallback access
      sessionStorage.setItem('loginResponse', JSON.stringify(response.data));
      
      return storeUserData(token, user);
    } catch (error) {
      console.error("Login error:", error);
      handleApiError(error, 'An error occurred during login. Please check your credentials.');
    }
  },

  /**
   * Partner login with email and password
   * @param {string} email - Partner email
   * @param {string} password - Partner password
   * @returns {Promise<Object>} Authentication data
   * @throws {Object} Error object with message
   */
  loginPartner: async (email, password) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data.data;
      
      // Store token in both locations
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      
      // Store login response in sessionStorage for fallback access
      sessionStorage.setItem('loginResponse', JSON.stringify(response.data));
      
      return storeUserData(token, user);
    } catch (error) {
      handleApiError(error, 'An error occurred during login. Please check your credentials.');
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   * @throws {Object} Error object with message
   */
  register: async (userData) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred during registration');
    }
  },

  /**
   * Register a new partner
   * @param {Object} userData - Partner registration data
   * @returns {Promise<Object>} Registration response
   * @throws {Object} Error object with message
   */
  registerPartner: async (userData) => {
    return authService.register(userData);
  },

  /**
   * Log out user by removing stored data
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('working_endpoint');
    localStorage.removeItem('api_base_path');
    sessionStorage.removeItem('loginResponse');
  },

  /**
   * Get authenticated user profile
   * @returns {Promise<Object>} User profile data
   * @throws {Object} Error object with message
   */
  getUserProfile: async () => {
    try {
      // First try with authToken
      const authToken = localStorage.getItem('authToken');
      const token = localStorage.getItem('token');
      
      const headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        // Also save it to authToken for consistency
        localStorage.setItem('authToken', token);
      }
      
      // Try calling the profile endpoint
      console.log("Fetching user profile with token");
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw { message: error.message || 'An error occurred while fetching profile data' };
    }
  },

  /**
   * Update user profile information
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user data
   * @throws {Object} Error object with message
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/profile`, profileData);
      if (response.data?.data?.user) {
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while updating profile data');
    }
  },

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password response
   * @throws {Object} Error object with message
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await httpClient.put(`${API_URL}/auth/change-password`, { 
        oldPassword, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while changing password');
    }
  },

  /**
   * Get user data from localStorage
   * @returns {Object|null} User data or null if not found
   */
  getStoredUser: () => {
    const userString = localStorage.getItem('user');
    if (!userString || userString === "null") {
      // Try to get from session storage if not in localStorage
      const loginResponse = sessionStorage.getItem('loginResponse');
      if (loginResponse) {
        try {
          const parsedResponse = JSON.parse(loginResponse);
          if (parsedResponse.data && parsedResponse.data.user) {
            // Store in localStorage for future use
            localStorage.setItem('user', JSON.stringify(parsedResponse.data.user));
            return parsedResponse.data.user;
          }
        } catch (e) {
          console.error("Error parsing login response:", e);
        }
      }
      return null;
    }
    try {
      return JSON.parse(userString);
    } catch (e) {
      console.error("Error parsing user JSON:", e);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    // Check both token locations for compatibility
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      return false;
    }
    
    try {
      // Decode token to check expiry
      const decoded = authService.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return false;
      }
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.warn("Token has expired");
        // Don't auto-logout here, just return false
        return false;
      }
      
      return true;
    } catch (e) {
      console.error("Error checking token validity:", e);
      return false;
    }
  },

  /**
   * Check if user is a partner
   * @returns {boolean} True if user is a partner, false otherwise
   */
  isPartner: () => {
    const user = authService.getStoredUser();
    return user && user.role === 'PARTNER';
  },

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request response
   * @throws {Object} Error object with message
   */
  forgotPassword: async (email) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      handleApiError(error, 'An error occurred while requesting password reset');
    }
  },

  /**
   * Alias for forgotPassword to maintain consistent naming
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request response
   */
  resetPassword: async (email) => {
    return authService.forgotPassword(email);
  },
  
  /**
   * Confirm password reset with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset confirmation response
   * @throws {Object} Error object with message
   */
  confirmPasswordReset: async (token, newPassword) => {
    try {
      const response = await httpClient.post(`${API_URL}/auth/reset-password`, {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to confirm password reset');
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<string>} New token
   * @throws {Object} Error object with message
   */
  refreshToken: async () => {
    try {
      // Try several possible refresh token endpoints
      const refreshEndpoints = [
        '/auth/refresh-token',
        '/auth/refresh',
        '/auth/token',
        '/auth/token/refresh',
        '/refresh-token'
      ];
      
      let lastError = null;
      
      // Try each endpoint until one works
      for (const endpoint of refreshEndpoints) {
        try {
          console.log(`Trying to refresh token with endpoint: ${API_URL}${endpoint}`);
          
          // Use direct fetch to avoid axios interceptors
          const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
            }
          });
          
          if (!response.ok) {
            console.warn(`Refresh token endpoint ${endpoint} failed with status ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          // Check different response formats
          let token = null;
          
          if (data.data && data.data.token) {
            token = data.data.token;
          } else if (data.token) {
            token = data.token;
          } else if (data.data && data.data.accessToken) {
            token = data.data.accessToken;
          } else if (data.accessToken) {
            token = data.accessToken;
          }
          
          if (token) {
            // Store in both locations for compatibility
            localStorage.setItem('token', token);
            localStorage.setItem('authToken', token);
            
            console.log("Token refreshed successfully via", endpoint);
            return token;
          } else {
            console.warn(`Token not found in response from ${endpoint}`, data);
          }
        } catch (endpointError) {
          console.warn(`Refresh token failed with endpoint ${endpoint}:`, endpointError.message);
          lastError = endpointError;
        }
      }
      
      // If all endpoints failed
      console.error("All refresh token endpoints failed");
      throw lastError || new Error("Failed to refresh token");
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw { message: "Session expired. Please login again." };
    }
  },

  /**
   * Decode JWT token to get payload
   * @param {string} token - JWT token to decode
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  decodeToken: (token = null) => {
    try {
      if (!token) {
        token = localStorage.getItem('token') || localStorage.getItem('authToken');
      }
      
      if (!token) return null;
      
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return null;
      
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  },

/**
 * Verify user email with verification token
 * @param {string} token - Email verification token
 * @returns {Promise<Object>} Verification response
 * @throws {Object} Error object with message
 */
verifyEmail: async (token) => {
  try {
    // Opsi 1: Mengirim token sebagai parameter di body request POST
    const response = await httpClient.post(`${API_URL}/auth/verify-email`, { token });
    return response.data;
    
    // Opsi 2 (alternatif): Jika API mengharapkan token di URL path
    // const response = await httpClient.get(`${API_URL}/auth/verify-email/${token}`);
    // return response.data;
  } catch (error) {
    console.error("Verification error detail:", error);
    handleApiError(error, 'Terjadi kesalahan saat verifikasi email');
  }
},

    /**
     * Resend verification email
     * @param {string} email - User email address
     * @returns {Promise<Object>} Response from resend request
     * @throws {Object} Error object with message
     */
    resendVerificationEmail: async (email) => {
      try {
        const response = await httpClient.post(`${API_URL}/auth/resend-verification`, { email });
        return response.data;
      } catch (error) {
        handleApiError(error, 'An error occurred while resending verification email');
      }
    },

};