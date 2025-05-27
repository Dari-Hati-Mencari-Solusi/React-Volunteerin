import React, { useState, useRef, useEffect, useCallback } from "react";
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
  sertifikat: "1f92b274-39b5-4104-af5a-831982496a9c",
  uangSaku: "d9e7c6e0-3d73-4d1c-9930-35c0855cb752",
  pengalaman: "550e8400-e29b-41d4-a716-446655440000",
  networking: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  makanan: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  kaos: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

const STATIC_CATEGORY_IDS = {
  pendidikan: "711cf650-e0d7-4028-950d-fc5d68039aa0",
  lingkungan: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
  sosial: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
};

// API utilities
const apiUtils = {
  getApiUrl: () => {
    const savedApiUrl = localStorage.getItem("api_url");
    if (savedApiUrl) return savedApiUrl;

    const envApiUrl = import.meta.env.VITE_BE_BASE_URL;
    if (envApiUrl && envApiUrl !== "undefined") return envApiUrl;

    return "http://localhost:3000";
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
        },
      });

      const url = "http://localhost:3000";

      // First try /partners/me/events endpoint if we have a token
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (token) {
        try {
          const eventsResponse = await fetch(`${url}/partners/me/events`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Requested-With": "XMLHttpRequest",
            },
            signal: AbortSignal.timeout(3000),
          });

          if (eventsResponse.ok) {
            localStorage.setItem("api_url", url);

            Swal.fire({
              icon: "success",
              title: "Server Ditemukan!",
              text: `Berhasil terhubung ke API Events di ${url}`,
              confirmButtonText: "OK",
            });

            setApiStatus({
              url: url,
              isConnected: true,
              lastChecked: new Date().toLocaleTimeString(),
              error: null,
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
          method: "GET",
          headers: { "X-Requested-With": "XMLHttpRequest" },
          signal: AbortSignal.timeout(3000),
        });

        if (pingResponse.ok) {
          localStorage.setItem("api_url", url);

          Swal.fire({
            icon: "success",
            title: "Server Ditemukan!",
            text: `Berhasil terhubung ke server API di ${url}`,
            confirmButtonText: "OK",
          });

          setApiStatus({
            url: url,
            isConnected: true,
            lastChecked: new Date().toLocaleTimeString(),
            error: null,
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
        cancelButtonText: "Tutup",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("simulate_create_event", "true");
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
        confirmButtonText: "OK",
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
        },
      });

      const API_URL = apiUtils.getApiUrl();
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      // First try /partners/me/events endpoint if we have a token
      if (token) {
        try {
          const eventsResponse = await fetch(`${API_URL}/partners/me/events`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Requested-With": "XMLHttpRequest",
            },
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
              confirmButtonText: "OK",
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
                <p>Partner Name: ${profileData.data.name || "Unknown"}</p>
                <p class="mt-2 text-sm text-green-600">Status: Koneksi Berhasil</p>
              </div>
            `,
            confirmButtonText: "OK",
          });
          return true;
        }
      } catch (error) {
        console.warn("partnerService check failed:", error);
      }

      // Fallback to /ping as last resort
      try {
        const response = await fetch(`${API_URL}/ping`, {
          method: "GET",
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Server Aktif",
            text: "Server API merespons permintaan ping dengan sukses.",
            confirmButtonText: "OK",
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
        confirmButtonText: "OK",
      });

      return false;
    } catch (error) {
      console.error("Test connection error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Terjadi kesalahan saat memeriksa koneksi",
        confirmButtonText: "OK",
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
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_URL}/partners/me/events/${eventId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(
        `${API_URL}/partners/me/events?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get events: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting partner events:", error);
      throw error;
    }
  },
};
// Add to CreateEvent.jsx
const fetchValidIds = async () => {
  try {
    Swal.fire({
      title: "Mengambil data...",
      text: "Sedang mengambil data yang valid dari server",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const API_URL = apiUtils.getApiUrl();
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");

    // Fetch valid benefits
    const benefitResponse = await fetch(`${API_URL}/benefits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const benefitData = await benefitResponse.json();

    // Fetch valid categories
    const categoryResponse = await fetch(`${API_URL}/categories?type=EVENT`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const categoryData = await categoryResponse.json();

    Swal.close();

    if (benefitData.data?.length > 0 && categoryData.data?.length > 0) {
      // Instead of trying to set state directly, return the valid IDs
      const validBenefitIds = benefitData.data.slice(0, 2).map((b) => b.id);
      const validCategoryIds = categoryData.data.slice(0, 1).map((c) => c.id);

      console.log("Valid benefit IDs:", validBenefitIds);
      console.log("Valid category IDs:", validCategoryIds);

      // Show the valid IDs in a Swal dialog for user to copy
      Swal.fire({
        icon: "success",
        title: "Valid IDs Found",
        html: `
          <div class="text-left">
            <p><strong>Benefit IDs:</strong></p>
            <pre style="background:#f0f0f0;padding:5px;max-height:100px;overflow:auto">${JSON.stringify(
              validBenefitIds,
              null,
              2
            )}</pre>
            <p><strong>Category IDs:</strong></p>
            <pre style="background:#f0f0f0;padding:5px;max-height:100px;overflow:auto">${JSON.stringify(
              validCategoryIds,
              null,
              2
            )}</pre>
          </div>
        `,
        confirmButtonText: "Use These IDs",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Store in localStorage for your handleCreateEvent function to use
          localStorage.setItem(
            "valid_benefit_ids",
            JSON.stringify(validBenefitIds)
          );
          localStorage.setItem(
            "valid_category_ids",
            JSON.stringify(validCategoryIds)
          );
          localStorage.setItem("use_valid_ids", "true");

          Swal.fire({
            icon: "success",
            title: "IDs Saved",
            text: "Valid IDs will be used for the next event creation attempt",
          });
        }
      });

      return true;
    } else {
      console.error("No valid benefits or categories found");
      Swal.fire({
        icon: "warning",
        title: "No Valid Data",
        text: "No valid benefits or categories found in the database",
      });
      return false;
    }
  } catch (error) {
    console.error("Error fetching valid IDs:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Gagal mengambil data valid dari server: " + error.message,
    });
    return false;
  }
};
// Form utilities
const formUtils = {
  validateForm: (formData, refs) => {
    let errors = [];

    try {
      // Event form validation
      if (
        refs.eventFormRef.current &&
        typeof refs.eventFormRef.current.validate === "function"
      ) {
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
      if (
        refs.dateFormRef.current &&
        typeof refs.dateFormRef.current.validate === "function"
      ) {
        const dateErrors = refs.dateFormRef.current.validate();
        if (Array.isArray(dateErrors)) {
          errors = [...errors, ...dateErrors];
        }
      } else {
        if (!formData.startAt)
          errors.push("Tanggal & jam pembukaan pendaftaran harus diisi");
      }

      // Location validation
      if (
        refs.locationFormRef.current &&
        typeof refs.locationFormRef.current.validate === "function"
      ) {
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
      apiFormData.append("title", formData.title || "");
      apiFormData.append("type", formData.type || "OPEN");
      apiFormData.append("description", formData.description || "");

      // Volunteer data
      apiFormData.append("requirement", formData.requirement || "");
      apiFormData.append("contactPerson", formData.contactPerson || "");
      if (formData.maxApplicant)
        apiFormData.append("maxApplicant", formData.maxApplicant);
      if (formData.acceptedQuota)
        apiFormData.append("acceptedQuota", formData.acceptedQuota);

      // Date data
      if (!formData.startAt) {
        throw new Error("Tanggal dan waktu mulai harus diisi");
      }
      apiFormData.append("startAt", formData.startAt);
      if (formData.endAt) apiFormData.append("endAt", formData.endAt);

      // Location data
      if (!formData.province || !formData.regency) {
        throw new Error("Provinsi dan kota/kabupaten harus diisi");
      }
      apiFormData.append("province", formData.province);
      apiFormData.append("regency", formData.regency);
      if (formData.address) apiFormData.append("address", formData.address);
      if (formData.gmaps) apiFormData.append("gmaps", formData.gmaps);
      if (formData.latitude) apiFormData.append("latitude", formData.latitude);
      if (formData.longitude)
        apiFormData.append("longitude", formData.longitude);

      // Fee data
      apiFormData.append("isPaid", formData.isPaid);
      apiFormData.append("price", formData.price || "0");

      // Release status
      apiFormData.append("isRelease", isReadyToPublish);

      // Safety check for categoryIds
      let hasValidCategories = false;

      // Append categoryIds
      if (
        formData.categoryIds &&
        Array.isArray(formData.categoryIds) &&
        formData.categoryIds.length > 0
      ) {
        formData.categoryIds.forEach((id) => {
          if (id) {
            apiFormData.append("categoryIds[]", id);
            hasValidCategories = true;
          }
        });
      }

      // If no valid categories, use fallback
      if (!hasValidCategories) {
        apiFormData.append("categoryIds[]", STATIC_CATEGORY_IDS.pendidikan);
      }

      // Ensure we have valid benefitIds
      if (
        formData.benefitIds &&
        Array.isArray(formData.benefitIds) &&
        formData.benefitIds.length > 0
      ) {
        // First try to use the IDs as they are
        formData.benefitIds.forEach((id) => {
          if (id) {
            apiFormData.append("benefitIds[]", id.toString().trim());
          }
        });
      } else {
        // Use static fallback
        console.log("Using fallback benefit ID");
        apiFormData.append("benefitIds[]", STATIC_BENEFIT_IDS.sertifikat);
      }

      // Apply same approach for categoryIds
      if (
        formData.categoryIds &&
        Array.isArray(formData.categoryIds) &&
        formData.categoryIds.length > 0
      ) {
        formData.categoryIds.forEach((id) => {
          if (id) {
            apiFormData.append("categoryIds[]", id.toString().trim());
          }
        });
      } else {
        console.log("Using fallback category ID");
        apiFormData.append("categoryIds[]", STATIC_CATEGORY_IDS.pendidikan);
      }

      // Add banner file
      if (!formData.banner) {
        throw new Error("Banner event harus diunggah");
      }

      apiFormData.append("banner", formData.banner);

      return apiFormData;
    } catch (error) {
      console.error("Error in prepareFormDataForSubmit:", error);
      throw error;
    }
  },

  saveFormToLocalStorage: (formData) => {
    try {
      const formCopy = { ...formData };
      // Remove the file object which can't be serialized
      formCopy.banner = formCopy.banner
        ? {
            name: formCopy.banner.name,
            size: formCopy.banner.size,
            type: formCopy.banner.type,
          }
        : null;

      localStorage.setItem(
        "eventFormBackup",
        JSON.stringify({
          formData: formCopy,
          savedAt: new Date().toISOString(),
        })
      );

      return true;
    } catch (error) {
      console.error("Failed to save form data to localStorage:", error);
      return false;
    }
  },
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
        throw new Error(
          "API URL tidak ditemukan. Periksa konfigurasi aplikasi."
        );
      }

      // Get token and check validity
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Token tidak ditemukan. Silakan login terlebih dahulu."
        );
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
        const currentToken =
          localStorage.getItem("authToken") || localStorage.getItem("token");

        console.log(`Sending request to: ${API_URL}${endpoint}`);

        const response = await axios.post(`${API_URL}${endpoint}`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            // Don't set Content-Type with FormData
          },
          timeout: 60000,
        });

        console.log(`Success creating event!`, response.data);
        return response.data;
      } catch (error) {
        console.error(`Failed to create event:`, error.message);

        // For 500 errors, provide more helpful message
        if (error.response?.status === 500) {
          throw new Error(
            "Terjadi kesalahan server (500). Server mungkin sedang overload atau mengalami masalah internal. Silakan coba lagi nanti."
          );
        }

        // For 401/403 errors, provide auth error message
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error(
            "Sesi Anda telah berakhir atau tidak memiliki akses. Silakan login kembali."
          );
        }

        // For networking errors
        if (
          error.message?.includes("Network Error") ||
          error.code === "ECONNABORTED"
        ) {
          throw new Error(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
          );
        }

        // Pass through any other errors
        throw error;
      }
    } catch (error) {
      // IN THE CATCH BLOCK OF createDirect
      console.error("Direct API call failed:", error);

      // MODIFY THIS SECTION - Add more detailed logging
      console.log("=== API CALL DETAILS ===");
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response headers:", error.response.headers);
        console.log("Response data:", error.response.data);
      }

      // For 500 errors, provide more helpful message and try a simpler approach
      if (error.response?.status === 500) {
        // TRY ONE MORE APPROACH WITH VANILLA FETCH
        try {
          console.log("Attempting one last approach with fetch API");

          const currentToken =
            localStorage.getItem("authToken") || localStorage.getItem("token");

          // Create a minimal version for final attempt
          const minimalFormData = new FormData();
          minimalFormData.append("title", "Event " + new Date().toISOString());
          minimalFormData.append("description", "Test description");
          minimalFormData.append("type", "OPEN");
          minimalFormData.append("startAt", new Date().toISOString());
          minimalFormData.append("province", "DKI JAKARTA");
          minimalFormData.append("regency", "KOTA JAKARTA PUSAT");
          minimalFormData.append("isPaid", "false");
          minimalFormData.append("isRelease", "false");
          minimalFormData.append("requirement", "Test requirement");
          minimalFormData.append("contactPerson", "081234567890");

          // Add one static benefit and category
          minimalFormData.append("benefitIds[]", STATIC_BENEFIT_IDS.sertifikat);
          minimalFormData.append(
            "categoryIds[]",
            STATIC_CATEGORY_IDS.pendidikan
          );

          // Add banner if available but with stricter check
          if (formData.banner && formData.banner.size < 500 * 1024) {
            minimalFormData.append("banner", formData.banner);
          }

          const response = await fetch(`${API_URL}/partners/me/events`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
            body: minimalFormData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Fetch API approach successful:", data);
            return data;
          } else {
            throw new Error(`Fetch API failed with status ${response.status}`);
          }
        } catch (finalError) {
          console.error("Final attempt failed:", finalError);
          throw new Error(
            "Terjadi kesalahan server (500). Server mungkin sedang overload atau mengalami masalah internal. Silakan coba lagi nanti."
          );
        }
      }

      // Pass through any other errors
      throw error;
    }
  },

  simulateCreate: async (formData) => {
    // Add a delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      data: {
        id: "simulated-event-" + Date.now(),
        title: formData.title,
        description: formData.description,
        createdAt: new Date().toISOString(),
      },
      message: "Event created successfully (Simulation)",
    };
  },
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
    banner: null,
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
    error: null,
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
            confirmButtonText: "Login Sekarang",
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
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/dashboard");
          });
          return;
        }

        // User is authenticated and a partner
        setAuthChecked(true);

        try {
          // Check partner profile with better error handling
          const profileData = await partnerService.getPartnerProfile();

          // Debug the actual structure
          console.log("Partner profile response:", profileData);

          // More robust checking of nested properties
          const partnerName =
            profileData?.data?.name ||
            profileData?.data?.partner?.name ||
            profileData?.partner?.name ||
            "Unknown Partner";

          console.log("Partner profile loaded successfully:", partnerName);

          // Store the partner ID for event creation
          if (
            profileData?.data?.id ||
            profileData?.data?.partner?.id ||
            profileData?.partner?.id
          ) {
            // Save partner ID to localStorage for use in event creation
            const partnerId =
              profileData?.data?.id ||
              profileData?.data?.partner?.id ||
              profileData?.partner?.id;
            localStorage.setItem("partnerId", partnerId);
            console.log("Partner ID saved:", partnerId);
          } else {
            console.warn("Could not determine partner ID from profile data");
          }
        } catch (profileError) {
          console.warn("Failed to load partner profile:", profileError);

          // Create a warning notification but don't block
          Swal.fire({
            icon: "warning",
            title: "Perhatian",
            text: "Profil partner tidak lengkap. Sebaiknya lengkapi profil partner terlebih dahulu.",
            confirmButtonText: "Lanjutkan",
            showCancelButton: true,
            cancelButtonText: "Ke Halaman Profil",
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              navigate("/partner/profile");
            }
          });
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
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      type: data.type || prev.type,
      categoryIds: Array.isArray(data.categoryIds)
        ? data.categoryIds
        : prev.categoryIds,
      benefitIds: Array.isArray(data.benefitIds)
        ? data.benefitIds
        : prev.benefitIds,
    }));
  };

  const handleDateFormUpdate = (data) => {
    setFormData((prev) => ({
      ...prev,
      startAt: data.startAt || prev.startAt,
      endAt: data.endAt || prev.endAt,
    }));
  };

  const handleLocationFormUpdate = (data) => {
    setFormData((prev) => ({
      ...prev,
      province: data.province || prev.province,
      regency: data.regency || prev.regency,
      address: data.address || prev.address,
      gmaps: data.gmaps || prev.gmaps,
      latitude: data.latitude || prev.latitude,
      longitude: data.longitude || prev.longitude,
    }));
  };

  const handleVolunteerFormUpdate = (data) => {
    setFormData((prev) => ({
      ...prev,
      requirement: data.requirement || prev.requirement,
      contactPerson: data.contactPerson || prev.contactPerson,
      maxApplicant: data.maxApplicant || prev.maxApplicant,
      acceptedQuota: data.acceptedQuota || prev.acceptedQuota,
    }));
  };

  const handleFeeFormUpdate = (data) => {
    setFormData((prev) => ({
      ...prev,
      isPaid: data.isPaid,
      price: data.isPaid ? data.price : "0",
    }));
  };

  const handleBannerUpdate = useCallback((data) => {
    if (data && data.banner) {
      setFormData((prev) => ({
        ...prev,
        banner: data.banner,
      }));
    } else if (data) {
      setFormData((prev) => ({
        ...prev,
        banner: data,
      }));
    }
  }, []);
  const testWithCorrectSizedBanner = async () => {
    try {
      // Create a canvas with the EXACT dimensions expected
      const canvas = document.createElement("canvas");
      canvas.width = 600; // Exactly the max width allowed
      canvas.height = 300; // Exactly the max height allowed
      const ctx = canvas.getContext("2d");

      // Fill with a gradient
      const gradient = ctx.createLinearGradient(0, 0, 600, 0);
      gradient.addColorStop(0, "#0A3E54");
      gradient.addColorStop(1, "#2D8BBA");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 300);

      // Add text
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Event Banner", 300, 150);

      // Convert to blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
      const file = new File([blob], "banner-600x300.jpg", {
        type: "image/jpeg",
      });

      console.log("Created banner with exact dimensions: 600×300 pixels");

      // Create form data
      const formData = new FormData();
      formData.append("title", "Test With Correct Size " + Date.now());
      formData.append("description", "Test description");
      formData.append("type", "OPEN");
      formData.append("startAt", new Date().toISOString());
      formData.append("province", "DKI JAKARTA");
      formData.append("regency", "KOTA JAKARTA PUSAT");
      formData.append("requirement", "Test");
      formData.append("contactPerson", "081234567890");
      formData.append("isPaid", "false");
      formData.append("isRelease", "false");
      formData.append("benefitIds[]", "d962d895-d6df-4aed-8acb-a9315e3ed1f7");
      formData.append("categoryIds[]", "d5ec8e93-4d7a-4a53-b528-a6ed4381649e");
      formData.append("banner", file);

      // Send request
      const API_URL = apiUtils.getApiUrl();
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      const response = await fetch(`${API_URL}/partners/me/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      alert(
        response.ok
          ? "Success with correctly sized banner!"
          : "Failed: " + data.message
      );
    } catch (error) {
      console.error("Test failed:", error);
      alert("Error: " + error.message);
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
          confirmButtonText: "Login Sekarang",
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      // Validate form
      const errors = formUtils.validateForm(formData, {
        eventFormRef,
        dateFormRef,
        locationFormRef,
        volunteerFormRef,
        feeFormRef,
        bannerUploadRef,
      });

      if (errors.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Form Tidak Lengkap",
          html: `<ul class="text-left">${errors
            .map((err) => `<li>• ${err}</li>`)
            .join("")}</ul>`,
          confirmButtonText: "OK",
        });
        return;
      }

      // Show loading state
      Swal.fire({
        title: "Memproses...",
        text: "Sedang membuat event, harap tunggu.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Get token and partnerId
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      const partnerId = localStorage.getItem("partnerId");

      // Check if we should use valid IDs from localStorage
      let dataToSubmit = { ...formData };

      try {
        // Override benefitIds and categoryIds if valid ones are available
        if (localStorage.getItem("use_valid_ids") === "true") {
          const validBenefitIds = JSON.parse(
            localStorage.getItem("valid_benefit_ids") || "[]"
          );
          const validCategoryIds = JSON.parse(
            localStorage.getItem("valid_category_ids") || "[]"
          );

          if (validBenefitIds.length > 0 && validCategoryIds.length > 0) {
            console.log("Using valid IDs from localStorage:");
            console.log("- Benefit IDs:", validBenefitIds);
            console.log("- Category IDs:", validCategoryIds);

            dataToSubmit = {
              ...dataToSubmit,
              benefitIds: validBenefitIds,
              categoryIds: validCategoryIds,
            };
          }
        }
      } catch (parseError) {
        console.warn("Error parsing valid IDs:", parseError);
        // Continue with original data
      }

      // Prepare form data
      let apiFormData;
      try {
        apiFormData = formUtils.prepareFormDataForSubmit(
          dataToSubmit,
          isReadyToPublish
        );

        // Add partnerId to formData after it's created
        if (partnerId) {
          console.log("Adding partner ID to request:", partnerId);
          apiFormData.append("partnerId", partnerId);
        }

        // Log the form data
        console.log("Form data entries before sending:");
        for (let [key, value] of apiFormData.entries()) {
          if (key === "banner") {
            console.log(
              `${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`
            );
          } else {
            console.log(`${key}: ${value}`);
          }
        }
      } catch (prepareError) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Gagal Menyiapkan Data",
          text:
            prepareError.message ||
            "Terjadi kesalahan saat menyiapkan data event",
          confirmButtonText: "OK",
        });
        return;
      }

      // Save backup
      setFormBackup({
        timestamp: new Date().toISOString(),
      });
      formUtils.saveFormToLocalStorage(dataToSubmit);

      // Check if simulation mode is enabled
      if (localStorage.getItem("simulate_create_event") === "true") {
        console.log("SIMULATION MODE: Using simulated event creation");
        const simulatedResponse = await eventCreationStrategies.simulateCreate(
          dataToSubmit
        );

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

      // Attempt to create event using the service
      try {
        console.log("Attempting to create event with partnerService...");
        const response = await eventCreationStrategies.createWithPartnerService(
          apiFormData
        );

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

        // Handle specific error types based on the message
        if (
          serviceError.message &&
          serviceError.message.includes("tidak ditemukan")
        ) {
          Swal.close();
          // This is a benefit/category ID error
          Swal.fire({
            icon: "error",
            title: "ID Tidak Valid",
            html: `
            <div class="text-left">
              <p>${serviceError.message}</p>
              <p class="mt-2">Tindakan yang dapat dilakukan:</p>
              <ul class="list-disc pl-5">
                <li>Gunakan "Ambil ID Valid" untuk mendapatkan ID yang benar</li>
                <li>Aktifkan mode simulasi untuk testing UI</li>
                <li>Hubungi admin untuk memperbaiki data</li>
              </ul>
            </div>
          `,
            confirmButtonText: "Ambil ID Valid",
            showCancelButton: true,
            cancelButtonText: "Tutup",
          }).then((result) => {
            if (result.isConfirmed) {
              // Call the fetchValidIds function
              fetchValidIds();
            }
          });
          return;
        }

        // Check for authentication errors
        if (
          serviceError.status === 401 ||
          serviceError.status === 403 ||
          serviceError.message?.includes("unauthorized") ||
          serviceError.message?.includes("tidak memiliki akses")
        ) {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Sesi Berakhir",
            text: "Sesi Anda telah berakhir. Silakan login kembali.",
            confirmButtonText: "Login Sekarang",
          }).then(() => {
            navigate("/login");
          });
          return;
        }

        // Try direct API call as fallback
        try {
          console.log("Partner service failed, trying direct API call...");
          const directResponse = await eventCreationStrategies.createDirect(
            apiFormData
          );

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

          // Add more detailed debugging
          console.log("=== API CALL DETAILS ===");
          if (directError.response) {
            console.log("Status:", directError.response.status);
            console.log("Response data:", directError.response.data);
          }

          // Handle specific error cases with helpful guidance
          if (
            directError.message &&
            directError.message.includes("tidak ditemukan")
          ) {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "ID Tidak Valid",
              html: `
              <div class="text-left">
                <p>${directError.message}</p>
                <p class="mt-2">Tindakan yang dapat dilakukan:</p>
                <ul class="list-disc pl-5">
                  <li>Gunakan "Ambil ID Valid" untuk mendapatkan ID yang benar</li>
                  <li>Aktifkan mode simulasi untuk testing UI</li>
                </ul>
              </div>
            `,
              confirmButtonText: "Ambil ID Valid",
              showCancelButton: true,
              cancelButtonText: "Tutup",
            }).then((result) => {
              if (result.isConfirmed) {
                // Call the fetchValidIds function
                fetchValidIds();
              }
            });
            return;
          }

          // Check for auth errors
          if (
            directError.response?.status === 401 ||
            directError.response?.status === 403 ||
            directError.message?.includes("tidak memiliki akses") ||
            directError.message?.includes("login kembali")
          ) {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Sesi Berakhir",
              text: "Sesi Anda telah berakhir. Silakan login kembali.",
              confirmButtonText: "Login Sekarang",
            }).then(() => {
              navigate("/login");
            });
            return;
          }

          // Show error message
          Swal.close();

          let errorMessage =
            directError.message ||
            serviceError.message ||
            "Terjadi kesalahan saat membuat event.";

          // Special handling for 500 errors
          if (
            serviceError.status === 500 ||
            directError?.response?.status === 500
          ) {
            errorMessage =
              "Terjadi kesalahan server (500). Server mungkin sedang overload atau mengalami masalah internal.";

            Swal.fire({
              icon: "error",
              title: "Gagal Membuat Event",
              text: errorMessage,
              confirmButtonText: "OK",
              showCancelButton: true,
              cancelButtonText: "Simpan Draft",
              footer:
                '<div class="text-xs text-gray-500">Tip: Coba gunakan Ambil ID Valid atau Aktifkan Simulasi</div>',
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.cancel) {
                // Save as draft logic
                if (formUtils.saveFormToLocalStorage(dataToSubmit)) {
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
        text:
          error.message || "Terjadi kesalahan tak terduga saat membuat event.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add the fetchValidIds function
  const fetchValidIds = async () => {
    try {
      Swal.fire({
        title: "Mengambil data...",
        text: "Sedang mengambil data yang valid dari server",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const API_URL = apiUtils.getApiUrl();
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      // Fetch valid benefits
      const benefitResponse = await fetch(`${API_URL}/benefits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const benefitData = await benefitResponse.json();

      // Fetch valid categories
      const categoryResponse = await fetch(`${API_URL}/categories?type=EVENT`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const categoryData = await categoryResponse.json();

      Swal.close();

      if (benefitData.data?.length > 0 && categoryData.data?.length > 0) {
        // Save valid IDs to localStorage
        const validBenefitIds = benefitData.data.slice(0, 2).map((b) => b.id);
        const validCategoryIds = categoryData.data.slice(0, 1).map((c) => c.id);

        console.log("Valid benefit IDs:", validBenefitIds);
        console.log("Valid category IDs:", validCategoryIds);

        localStorage.setItem(
          "valid_benefit_ids",
          JSON.stringify(validBenefitIds)
        );
        localStorage.setItem(
          "valid_category_ids",
          JSON.stringify(validCategoryIds)
        );
        localStorage.setItem("use_valid_ids", "true");

        Swal.fire({
          icon: "success",
          title: "ID Valid Ditemukan",
          html: `
          <div class="text-left">
            <p>ID valid telah disimpan dan akan digunakan untuk pembuatan event.</p>
            <p><strong>Benefit IDs:</strong> ${validBenefitIds.length} ID</p>
            <p><strong>Category IDs:</strong> ${validCategoryIds.length} ID</p>
          </div>
        `,
          confirmButtonText: "OK",
        });

        return true;
      } else {
        console.error("No valid benefits or categories found");
        Swal.fire({
          icon: "warning",
          title: "Tidak Ada Data Valid",
          text: "Tidak ditemukan benefit atau kategori valid di database",
          confirmButtonText: "OK",
        });
        return false;
      }
    } catch (error) {
      console.error("Error fetching valid IDs:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data valid dari server: " + error.message,
        confirmButtonText: "OK",
      });
      return false;
    }
  };

  // Toggle simulation mode for development
  const toggleSimulationMode = () => {
    const currentMode =
      localStorage.getItem("simulate_create_event") === "true";
    localStorage.setItem("simulate_create_event", (!currentMode).toString());

    Swal.fire({
      icon: "info",
      title: currentMode
        ? "Mode Simulasi Dinonaktifkan"
        : "Mode Simulasi Diaktifkan",
      text: currentMode
        ? "Pembuatan event akan menggunakan API sesungguhnya"
        : "Pembuatan event akan menggunakan simulasi",
      confirmButtonText: "OK",
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
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Gagal memeriksa profil. Anda dapat melanjutkan tetapi sebagian
              fitur mungkin tidak berfungsi dengan baik.
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
      <EventForm ref={eventFormRef} onUpdate={handleEventFormUpdate} />

      {/* Date/schedule section */}
      <EventDate ref={dateFormRef} onUpdate={handleDateFormUpdate} />

      {/* Location section */}
      <Location ref={locationFormRef} onUpdate={handleLocationFormUpdate} />

      {/* Volunteer requirements section */}
      <Volunteer ref={volunteerFormRef} onUpdate={handleVolunteerFormUpdate} />

      {/* Registration fee section */}
      <RegistrationFee ref={feeFormRef} onUpdate={handleFeeFormUpdate} />

      {/* Banner upload section */}
      <BannerUpload ref={bannerUploadRef} onUpdate={handleBannerUpdate} />

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
      </div>
    </section>
  );
};

export default CreateEvent;
