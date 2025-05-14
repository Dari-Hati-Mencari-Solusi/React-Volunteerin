import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../../components/Elements/forms/Event";
import EventDate from "../../components/Elements/forms/Date";
import Location from "../../components/Elements/forms/Location";
import Volunteer from "../../components/Elements/forms/Volunteer";
import RegistrationFee from "../../components/Elements/forms/RegistrationFee";
import BannerUpload from "../../components/Elements/forms/BannerUpload";
import Swal from "sweetalert2";
import { partnerService } from "../../services/partnerService";
import { authService } from "../../services/authService";
import axios from "axios";

// Static IDs for fallback
const STATIC_BENEFIT_IDS = {
  sertifikat: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  uangSaku: "d9e7c6e0-3d73-4d1c-9930-35c0855cb752",
  pengalaman: "550e8400-e29b-41d4-a716-446655440000",
  networking: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  makanan: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  kaos: "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
};

const STATIC_CATEGORY_IDS = {
  pendidikan: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  lingkungan: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
  sosial: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13"
};

// API utilities
const apiUtils = {
  getApiUrl: () => {
    const savedApiUrl = localStorage.getItem('api_url');
    if (savedApiUrl) return savedApiUrl;
    
    const envApiUrl = import.meta.env.VITE_BE_BASE_URL;
    if (envApiUrl && envApiUrl !== 'undefined') return envApiUrl;
    
    return 'http://localhost:3000';
  },
  
  detectApiServer: async (setLoading, setApiStatus) => {
    try {
      setLoading(true);
      
      Swal.fire({
        title: "Mencari Server API...",
        text: "Sedang mencari server API yang aktif",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const url = 'http://localhost:3000';
      
      // First try /partners/me/events endpoint if we have a token
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        try {
          const eventsResponse = await fetch(`${url}/partners/me/events`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'X-Requested-With': 'XMLHttpRequest' 
            },
            signal: AbortSignal.timeout(3000)
          });
          
          if (eventsResponse.ok) {
            localStorage.setItem('api_url', url);
            
            Swal.fire({
              icon: "success",
              title: "Server Ditemukan!",
              text: `Berhasil terhubung ke API Events di ${url}`,
              confirmButtonText: "OK"
            });
            
            setApiStatus({
              url: url,
              isConnected: true,
              lastChecked: new Date().toLocaleTimeString(),
              error: null
            });
            
            return url;
          }
        } catch (err) {
          console.warn("Events endpoint check failed:", err.message);
        }
      }
      
      // Fallback to /ping endpoint if events check fails
      try {
        const pingResponse = await fetch(`${url}/ping`, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: AbortSignal.timeout(3000)
        });
        
        if (pingResponse.ok) {
          localStorage.setItem('api_url', url);
          
          Swal.fire({
            icon: "success",
            title: "Server Ditemukan!",
            text: `Berhasil terhubung ke server API di ${url}`,
            confirmButtonText: "OK"
          });
          
          setApiStatus({
            url: url,
            isConnected: true,
            lastChecked: new Date().toLocaleTimeString(),
            error: null
          });
          
          return url;
        }
      } catch (err) {
        console.warn(`Failed to connect to ${url}:`, err.message);
      }
      
      Swal.fire({
        icon: "error",
        title: "Server API Tidak Ditemukan",
        html: `
          <div class="text-left">
            <p>Tidak dapat menemukan server API yang aktif.</p>
            <p class="mt-2 font-semibold">Opsi yang tersedia:</p>
            <ul class="list-disc pl-5">
              <li>Aktifkan mode simulasi untuk testing UI</li>
              <li>Periksa apakah server API berjalan di lokasi yang benar</li>
              <li>Pastikan tidak ada blocking dari firewall</li>
            </ul>
          </div>
        `,
        confirmButtonText: "Aktifkan Mode Simulasi",
        showCancelButton: true,
        cancelButtonText: "Tutup"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('simulate_create_event', 'true');
          window.location.reload();
        }
      });
      
      return null;
    } catch (error) {
      console.error("Error detecting API server:", error);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mencari server API: " + error.message,
        confirmButtonText: "OK"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  },
  
  testServerConnection: async (setLoading) => {
    try {
      setLoading(true);
      
      Swal.fire({
        title: "Memeriksa Server...",
        text: "Sedang memeriksa koneksi ke server API",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const API_URL = apiUtils.getApiUrl();
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // First try /partners/me/events endpoint if we have a token
      if (token) {
        try {
          const eventsResponse = await fetch(`${API_URL}/partners/me/events`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'X-Requested-With': 'XMLHttpRequest' 
            }
          });
          
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            
            Swal.fire({
              icon: "success",
              title: "Koneksi Berhasil",
              html: `
                <div class="text-left">
                  <p>Berhasil terhubung ke API Events!</p>
                  <p>Jumlah Event: ${eventsData.data?.events?.length || 0}</p>
                  <p class="mt-2 text-sm text-green-600">Status: Koneksi dan Autentikasi Berhasil</p>
                </div>
              `,
              confirmButtonText: "OK"
            });
            return true;
          }
        } catch (error) {
          console.warn("partners/me/events check failed:", error);
        }
      }
      
      // Try partnerService next
      try {
        const profileData = await partnerService.getPartnerProfile();
        
        if (profileData && profileData.data) {
          Swal.fire({
            icon: "success",
            title: "Koneksi Berhasil",
            html: `
              <div class="text-left">
                <p>Berhasil terhubung ke server API!</p>
                <p>Partner Name: ${profileData.data.name || 'Unknown'}</p>
                <p class="mt-2 text-sm text-green-600">Status: Koneksi Berhasil</p>
              </div>
            `,
            confirmButtonText: "OK"
          });
          return true;
        }
      } catch (error) {
        console.warn("partnerService check failed:", error);
      }
      
      // Fallback to /ping as last resort
      try {
        const response = await fetch(`${API_URL}/ping`, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Server Aktif",
            text: "Server API merespons permintaan ping dengan sukses.",
            confirmButtonText: "OK"
          });
          return true;
        }
      } catch (error) {
        console.warn("API ping failed:", error);
      }
      
      // If all checks fail
      Swal.fire({
        icon: "error",
        title: "Koneksi Gagal",
        html: `
          <div class="text-left">
            <p>Tidak dapat terhubung ke server API!</p>
            <p>Status: Server tidak merespons</p>
            <hr class="my-2">
            <p class="mt-2 text-sm">Periksa apakah:</p>
            <ul class="list-disc pl-5 text-sm">
              <li>Server API sedang berjalan</li>
              <li>URL API benar: <code>${apiUtils.getApiUrl()}</code></li>
              <li>Token autentikasi Anda valid</li>
              <li>Tidak ada masalah jaringan</li>
            </ul>
          </div>
        `,
        confirmButtonText: "OK"
      });
      
      return false;
    } catch (error) {
      console.error("Test connection error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Terjadi kesalahan saat memeriksa koneksi",
        confirmButtonText: "OK"
      });
      return false;
    } finally {
      setLoading(false);
    }
  },
  
  // Fungsi untuk mengambil event berdasarkan id
  getEventById: async (eventId) => {
    try {
      const API_URL = apiUtils.getApiUrl();
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
      
      const response = await fetch(`${API_URL}/partners/me/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get event: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting event by ID:", error);
      throw error;
    }
  },
  
  // Fungsi untuk mengambil daftar event partner
  getPartnerEvents: async (page = 1, limit = 10) => {
    try {
      const API_URL = apiUtils.getApiUrl();
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
      
      const response = await fetch(`${API_URL}/partners/me/events?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get events: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting partner events:", error);
      throw error;
    }
  }
};

// Form utilities
const formUtils = {
  validateForm: (formData, refs) => {
    let errors = [];
    
    try {
      // Event form validation
      if (refs.eventFormRef.current && typeof refs.eventFormRef.current.validate === 'function') {
        const eventErrors = refs.eventFormRef.current.validate();
        if (Array.isArray(eventErrors)) {
          errors = [...errors, ...eventErrors];
        }
      } else {
        if (!formData.title) errors.push("Judul event harus diisi");
        if (!formData.description) errors.push("Deskripsi event harus diisi");
        if (!formData.categoryIds || formData.categoryIds.length === 0) 
          errors.push("Minimal pilih satu kategori event");
        if (!formData.benefitIds || formData.benefitIds.length === 0) 
          errors.push("Minimal pilih satu manfaat event");
      }
      
      // Date validation
      if (refs.dateFormRef.current && typeof refs.dateFormRef.current.validate === 'function') {
        const dateErrors = refs.dateFormRef.current.validate();
        if (Array.isArray(dateErrors)) {
          errors = [...errors, ...dateErrors];
        }
      } else {
        if (!formData.startAt) errors.push("Tanggal & jam pembukaan pendaftaran harus diisi");
      }
      
      // Location validation
      if (refs.locationFormRef.current && typeof refs.locationFormRef.current.validate === 'function') {
        const locationErrors = refs.locationFormRef.current.validate();
        if (Array.isArray(locationErrors)) {
          errors = [...errors, ...locationErrors];
        }
      } else {
        if (!formData.province || !formData.regency) 
          errors.push("Provinsi dan kabupaten/kota harus diisi");
      }
      
      // Banner validation
      if (!formData.banner) {
        errors.push("Banner event harus diunggah");
      }
    } catch (validationError) {
      console.error("Validation error:", validationError);
      errors.push("Terjadi kesalahan saat validasi form");
    }
    
    return errors;
  },
  
  prepareFormDataForSubmit: (formData, isReadyToPublish) => {
    try {
      const apiFormData = new FormData();
      
      // Basic event data validation
      if (!formData.title) {
        throw new Error("Judul event harus diisi");
      }
      
      // Basic event data
      apiFormData.append('title', formData.title || '');
      apiFormData.append('type', formData.type || 'OPEN');
      apiFormData.append('description', formData.description || '');
      
      // Volunteer data
      apiFormData.append('requirement', formData.requirement || '');
      apiFormData.append('contactPerson', formData.contactPerson || '');
      if (formData.maxApplicant) apiFormData.append('maxApplicant', formData.maxApplicant);
      if (formData.acceptedQuota) apiFormData.append('acceptedQuota', formData.acceptedQuota);
      
      // Date data
      if (!formData.startAt) {
        throw new Error("Tanggal dan waktu mulai harus diisi");
      }
      apiFormData.append('startAt', formData.startAt);
      if (formData.endAt) apiFormData.append('endAt', formData.endAt);
      
      // Location data
      if (!formData.province || !formData.regency) {
        throw new Error("Provinsi dan kota/kabupaten harus diisi");
      }
      apiFormData.append('province', formData.province);
      apiFormData.append('regency', formData.regency);
      if (formData.address) apiFormData.append('address', formData.address);
      if (formData.gmaps) apiFormData.append('gmaps', formData.gmaps);
      if (formData.latitude) apiFormData.append('latitude', formData.latitude);
      if (formData.longitude) apiFormData.append('longitude', formData.longitude);
      
      // Fee data
      apiFormData.append('isPaid', formData.isPaid);
      apiFormData.append('price', formData.price || '0');
      
      // Release status
      apiFormData.append('isRelease', isReadyToPublish);
      
      // Safety check for categoryIds
      let hasValidCategories = false;
      
      // Append categoryIds
      if (formData.categoryIds && Array.isArray(formData.categoryIds) && formData.categoryIds.length > 0) {
        formData.categoryIds.forEach(id => {
          if (id) {
            apiFormData.append('categoryIds[]', id);
            hasValidCategories = true;
          }
        });
      }
      
      // If no valid categories, use fallback
      if (!hasValidCategories) {
        apiFormData.append('categoryIds[]', STATIC_CATEGORY_IDS.pendidikan);
      }
      
      // Safety check for benefitIds
      let hasValidBenefits = false;
      
      // Append benefitIds
      if (formData.benefitIds && Array.isArray(formData.benefitIds) && formData.benefitIds.length > 0) {
        formData.benefitIds.forEach(id => {
          if (id) {
            apiFormData.append('benefitIds[]', id);
            hasValidBenefits = true;
          }
        });
      }
      
      // If no valid benefits, use fallback
      if (!hasValidBenefits) {
        apiFormData.append('benefitIds[]', STATIC_BENEFIT_IDS.sertifikat);
      }
      
      // Add banner file
      if (!formData.banner) {
        throw new Error("Banner event harus diunggah");
      }
      
      apiFormData.append('banner', formData.banner);
      
      return apiFormData;
    } catch (error) {
      console.error("Error in prepareFormDataForSubmit:", error);
      throw error;
    }
  },
  
  saveFormToLocalStorage: (formData) => {
    try {
      const formCopy = {...formData};
      // Remove the file object which can't be serialized
      formCopy.banner = formCopy.banner ? {
        name: formCopy.banner.name,
        size: formCopy.banner.size,
        type: formCopy.banner.type
      } : null;
      
      localStorage.setItem('eventFormBackup', JSON.stringify({
        formData: formCopy,
        savedAt: new Date().toISOString()
      }));
      
      return true;
    } catch (error) {
      console.error("Failed to save form data to localStorage:", error);
      return false;
    }
  }
};

// Event creation strategies
const eventCreationStrategies = {
  isTokenExpired: (token) => {
    try {
      const decoded = authService.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      console.error("Error decoding token:", e);
      return true;
    }
  },
  
  refreshAuthToken: async () => {
    try {
      const newToken = await authService.refreshToken();
      console.log("Token refreshed successfully");
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  },
  
  createWithPartnerService: async (formData) => {
    try {
      console.log("Creating event using partnerService...");
      const response = await partnerService.createEvent(formData);
      console.log("Event created successfully using partnerService:", response);
      return response;
    } catch (error) {
      console.error("Error using partnerService:", error);
      throw error;
    }
  },
  
  createDirect: async (formData) => {
    try {
      // Check if API URL is valid
      const API_URL = apiUtils.getApiUrl();
      if (!API_URL) {
        throw new Error("API URL tidak ditemukan. Periksa konfigurasi aplikasi.");
      }
      
      // Get token and check validity
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }
      
      // Refresh token if expired
      if (eventCreationStrategies.isTokenExpired(token)) {
        console.log("Token is expired, refreshing...");
        const newToken = await eventCreationStrategies.refreshAuthToken();
        if (!newToken) {
          throw new Error("Gagal memperbaharui token. Silakan login kembali.");
        }
      }
      
      const endpoint = "/partners/me/events";
      
      try {
        const currentToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        console.log(`Sending request to: ${API_URL}${endpoint}`);
        
        const response = await axios.post(`${API_URL}${endpoint}`, formData, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            // Don't set Content-Type with FormData
          },
          timeout: 60000
        });
        
        console.log(`Success creating event!`, response.data);
        return response.data;
      } catch (error) {
        console.error(`Failed to create event:`, error.message);
        
        // For 500 errors, provide more helpful message
        if (error.response?.status === 500) {
          throw new Error("Terjadi kesalahan server (500). Server mungkin sedang overload atau mengalami masalah internal. Silakan coba lagi nanti.");
        }
        
        // For 401/403 errors, provide auth error message
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error("Sesi Anda telah berakhir atau tidak memiliki akses. Silakan login kembali.");
        }
        
        // For networking errors
        if (error.message?.includes('Network Error') || error.code === 'ECONNABORTED') {
          throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.");
        }
        
        // Pass through any other errors
        throw error;
      }
    } catch (error) {
      console.error("Direct API call failed:", error);
      throw error;
    }
  },
  
  simulateCreate: async (formData) => {
    // Add a delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: {
        id: "simulated-event-" + Date.now(),
        title: formData.title,
        description: formData.description,
        createdAt: new Date().toISOString()
      },
      message: "Event created successfully (Simulation)"
    };
  }
};

const CreateEvent = ({ onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Track if auth check has completed
  const [authError, setAuthError] = useState(null); // Track auth error state
  const [formData, setFormData] = useState({
    title: "",
    type: "OPEN",
    description: "",
    categoryIds: [],
    benefitIds: [],
    startAt: "",
    endAt: "",
    province: "",
    regency: "",
    address: "",
    gmaps: "",
    latitude: "",
    longitude: "",
    requirement: "",
    contactPerson: "",
    maxApplicant: "",
    acceptedQuota: "",
    isPaid: false,
    price: "0",
    banner: null
  });

  // References to child components for validation
  const eventFormRef = useRef(null);
  const dateFormRef = useRef(null);
  const locationFormRef = useRef(null);
  const volunteerFormRef = useRef(null);
  const feeFormRef = useRef(null);
  const bannerUploadRef = useRef(null);

  // Form data state for backup
  const [formBackup, setFormBackup] = useState(null);
  
  // API connection status
  const [apiStatus, setApiStatus] = useState({
    url: apiUtils.getApiUrl(),
    isConnected: false,
    lastChecked: null,
    error: null
  });

  // Check auth and API connection on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setAuthError("not_authenticated");
          setAuthChecked(true);
          
          Swal.fire({
            icon: "error",
            title: "Tidak Terautentikasi",
            text: "Anda harus login untuk membuat event",
            confirmButtonText: "Login Sekarang"
          }).then(() => {
            navigate("/login");
          });
          return;
        }
        
        // Check if user is a partner
        if (!authService.isPartner()) {
          setAuthError("not_partner");
          setAuthChecked(true);
          
          Swal.fire({
            icon: "error",
            title: "Akses Dibatasi",
            text: "Hanya partner yang dapat membuat event",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/dashboard");
          });
          return;
        }
        
        // User is authenticated and a partner
        setAuthChecked(true);
        
        try {
          // We'll try to check partner profile, but we'll continue even if it fails
          // since the user is already authenticated and is a partner
          const profileData = await partnerService.getPartnerProfile();
          
          if (profileData && profileData.data) {
            console.log("Partner profile loaded successfully:", profileData.data.name);
          }
        } catch (profileError) {
          console.warn("Failed to load partner profile, but continuing:", profileError);
          // Don't redirect or show error, just log it
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthError("check_failed");
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle toggle for isReadyToPublish
  const handleToggle = () => {
    setIsReadyToPublish(!isReadyToPublish);
  };

  // Form update handlers
  const handleEventFormUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      type: data.type || prev.type,
      categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : prev.categoryIds,
      benefitIds: Array.isArray(data.benefitIds) ? data.benefitIds : prev.benefitIds,
    }));
  };

  const handleDateFormUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      startAt: data.startAt || prev.startAt,
      endAt: data.endAt || prev.endAt
    }));
  };

  const handleLocationFormUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      province: data.province || prev.province,
      regency: data.regency || prev.regency,
      address: data.address || prev.address,
      gmaps: data.gmaps || prev.gmaps,
      latitude: data.latitude || prev.latitude,
      longitude: data.longitude || prev.longitude
    }));
  };

  const handleVolunteerFormUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      requirement: data.requirement || prev.requirement,
      contactPerson: data.contactPerson || prev.contactPerson,
      maxApplicant: data.maxApplicant || prev.maxApplicant,
      acceptedQuota: data.acceptedQuota || prev.acceptedQuota
    }));
  };

  const handleFeeFormUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      isPaid: data.isPaid,
      price: data.isPaid ? data.price : "0"
    }));
  };

  const handleBannerUpdate = (data) => {
    if (data && data.banner) {
      setFormData(prev => ({
        ...prev,
        banner: data.banner
      }));
    } else if (data) {
      setFormData(prev => ({
        ...prev,
        banner: data
      }));
    }
  };

  // Main event creation handler
  const handleCreateEvent = async () => {
    try {
      setLoading(true);
      
      // Re-check authentication before submitting
      if (!authService.isAuthenticated()) {
        Swal.fire({
          icon: "error",
          title: "Tidak Terautentikasi",
          text: "Sesi Anda telah berakhir. Silakan login kembali.",
          confirmButtonText: "Login Sekarang"
        }).then(() => {
          navigate("/login");
        });
        return;
      }
      
      // Validate form
      const errors = formUtils.validateForm(formData, {
        eventFormRef, dateFormRef, locationFormRef, 
        volunteerFormRef, feeFormRef, bannerUploadRef
      });
      
      if (errors.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Form Tidak Lengkap",
          html: `<ul class="text-left">${errors.map(err => `<li>• ${err}</li>`).join('')}</ul>`,
          confirmButtonText: "OK",
        });
        return;
      }
      
      // Tampilkan loading state
      Swal.fire({
        title: "Memproses...",
        text: "Sedang membuat event, harap tunggu.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      
      // Prepare form data
      let apiFormData;
      try {
        apiFormData = formUtils.prepareFormDataForSubmit(formData, isReadyToPublish);
      } catch (prepareError) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Gagal Menyiapkan Data",
          text: prepareError.message || "Terjadi kesalahan saat menyiapkan data event",
          confirmButtonText: "OK",
        });
        return;
      }
      
      // Save backup
      setFormBackup({
        timestamp: new Date().toISOString()
      });
      formUtils.saveFormToLocalStorage(formData);
      
      // Check if simulation mode is enabled
      if (localStorage.getItem('simulate_create_event') === 'true') {
        console.log("SIMULATION MODE: Using simulated event creation");
        const simulatedResponse = await eventCreationStrategies.simulateCreate(formData);
        
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Simulasi Berhasil",
          text: "Event berhasil dibuat (Mode Simulasi)",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/partner/events");
        });
        
        return;
      }
      
      // Try creating with partnerService first
      try {
        const response = await eventCreationStrategies.createWithPartnerService(apiFormData);
        
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: isReadyToPublish 
            ? "Event berhasil dibuat dan dipublish!"
            : "Event berhasil dibuat tetapi belum dipublish.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/partner/events");
        });
        return;
      } catch (serviceError) {
        console.error("partnerService.createEvent failed:", serviceError);
        
        // Check for authentication error in service response
        if (serviceError.status === 401 || serviceError.status === 403 || 
            serviceError.message?.includes("unauthorized") || 
            serviceError.message?.includes("tidak memiliki akses")) {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Sesi Berakhir",
            text: "Sesi Anda telah berakhir. Silakan login kembali.",
            confirmButtonText: "Login Sekarang"
          }).then(() => {
            navigate("/login");
          });
          return;
        }
        
        // Fallback to direct API call
        try {
          const directResponse = await eventCreationStrategies.createDirect(apiFormData);
          
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: isReadyToPublish 
              ? "Event berhasil dibuat dan dipublish!"
              : "Event berhasil dibuat tetapi belum dipublish.",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/partner/events");
          });
          return;
        } catch (directError) {
          console.error("Direct API call failed:", directError);
          
          // Check for auth errors
          if (directError.response?.status === 401 || directError.response?.status === 403 ||
              directError.message?.includes("tidak memiliki akses") ||
              directError.message?.includes("login kembali")) {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Sesi Berakhir",
              text: "Sesi Anda telah berakhir. Silakan login kembali.",
              confirmButtonText: "Login Sekarang"
            }).then(() => {
              navigate("/login");
            });
            return;
          }
          
          // Show error message
          Swal.close();
          
          let errorMessage = directError.message || serviceError.message || "Terjadi kesalahan saat membuat event.";
          
          // Special handling for 500 errors
          if (serviceError.status === 500 || directError?.response?.status === 500) {
            errorMessage = "Terjadi kesalahan server (500). Server mungkin sedang overload atau mengalami masalah internal.";
            
            Swal.fire({
              icon: "error",
              title: "Gagal Membuat Event",
              text: errorMessage,
              confirmButtonText: "OK",
              showCancelButton: true,
              cancelButtonText: "Simpan Draft",
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.cancel) {
                // Save as draft logic
                if (formUtils.saveFormToLocalStorage(formData)) {
                  Swal.fire({
                    icon: "success",
                    title: "Draft Tersimpan",
                    text: "Data event Anda telah disimpan sebagai draft. Anda dapat mencoba kembali nanti.",
                    confirmButtonText: "OK",
                  });
                }
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal Membuat Event",
              text: errorMessage,
              confirmButtonText: "OK",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in handleCreateEvent:", error);
      
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Event",
        text: error.message || "Terjadi kesalahan tak terduga saat membuat event.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle simulation mode for development
  const toggleSimulationMode = () => {
    const currentMode = localStorage.getItem('simulate_create_event') === 'true';
    localStorage.setItem('simulate_create_event', (!currentMode).toString());
    
    Swal.fire({
      icon: "info",
      title: currentMode ? "Mode Simulasi Dinonaktifkan" : "Mode Simulasi Diaktifkan",
      text: currentMode 
        ? "Pembuatan event akan menggunakan API sesungguhnya" 
        : "Pembuatan event akan menggunakan simulasi",
      confirmButtonText: "OK"
    });
  };

  // If auth check hasn't completed, show loading indicator
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="mb-4 w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memeriksa otentikasi...</p>
        </div>
      </div>
    );
  }

  // If auth error other than check_failed, the redirect happens in useEffect
  // For check_failed, we show a message but still render the form
  if (authError === "check_failed") {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Gagal memeriksa profil. Anda dapat melanjutkan tetapi sebagian fitur mungkin tidak berfungsi dengan baik.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="title">Buat Event Baru</h1>
      
      {/* Event info section */}
      <EventForm 
        ref={eventFormRef}
        onUpdate={handleEventFormUpdate}
      />
      
      {/* Date/schedule section */}
      <EventDate 
        ref={dateFormRef}
        onUpdate={handleDateFormUpdate}
      />
      
      {/* Location section */}
      <Location 
        ref={locationFormRef}
        onUpdate={handleLocationFormUpdate}
      />
      
      {/* Volunteer requirements section */}
      <Volunteer 
        ref={volunteerFormRef}
        onUpdate={handleVolunteerFormUpdate}
      />
      
      {/* Registration fee section */}
      <RegistrationFee 
        ref={feeFormRef}
        onUpdate={handleFeeFormUpdate}
      />
      
      {/* Banner upload section */}
      <BannerUpload 
        ref={bannerUploadRef}
        onUpdate={handleBannerUpdate}
      />

      {/* Toggle Switch for publish status */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="publish-toggle"
          className="text-sm font-medium text-gray-700"
        >
          Siap dipublish?
        </label>
        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            id="publish-toggle"
            checked={isReadyToPublish}
            onChange={handleToggle}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
              isReadyToPublish ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                isReadyToPublish ? "translate-x-7" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={handleCreateEvent}
          disabled={loading}
          className={`bg-[#0A3E54] py-2 px-4 text-white rounded-lg flex items-center ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#072a39]"
          }`}
        >
          {loading && (
            <div className="mr-2 w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
          )}
          Buat Event
        </button>
        
        {/* Debug buttons */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <button
              type="button"
              onClick={() => apiUtils.testServerConnection(setLoading)}
              disabled={loading}
              className="bg-purple-500 py-2 px-4 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Test Koneksi Server
            </button>
            
            <button
              type="button"
              onClick={() => apiUtils.detectApiServer(setLoading, setApiStatus)}
              disabled={loading}
              className="bg-green-500 py-2 px-4 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Cari Server API
            </button>
            
            <button
              type="button"
              onClick={toggleSimulationMode}
              className="bg-amber-500 py-2 px-4 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              {localStorage.getItem('simulate_create_event') === 'true' 
                ? 'Nonaktifkan Simulasi' 
                : 'Aktifkan Simulasi'}
            </button>
          </>
        )}
      </div>
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Debug Info</h3>
            <span className={`text-xs px-2 py-1 rounded ${apiStatus.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {apiStatus.isConnected ? 'API Connected' : 'API Disconnected'}
            </span>
          </div>
          
          <div className="mt-2 text-xs">
            <p>API URL: {apiUtils.getApiUrl() || 'Not defined'}</p>
            <p>Auth Status: {authService.isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}</p>
            <p>Is Partner: {authService.isPartner() ? 'Yes' : 'No'}</p>
            <p>Selected Benefits: {formData.benefitIds?.length || 0}</p>
            <p>Selected Categories: {formData.categoryIds?.length || 0}</p>
            <p>Has Banner: {formData.banner ? 'Yes' : 'No'}</p>
            <p>Simulation Mode: {localStorage.getItem('simulate_create_event') === 'true' ? 'On' : 'Off'}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateEvent;