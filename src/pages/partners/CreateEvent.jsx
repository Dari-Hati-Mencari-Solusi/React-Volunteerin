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

// Static IDs for fallback in case API fails
const STATIC_BENEFIT_IDS = {
  sertifikat: "1f92b274-39b5-4104-af5a-831982496a9c",
  uangSaku: "d9e7c6e0-3d73-4d1c-9930-35c0855cb752",
  pengalaman: "550e8400-e29b-41d4-a716-446655440000",
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

      // Append categoryIds
      if (
        formData.categoryIds &&
        Array.isArray(formData.categoryIds) &&
        formData.categoryIds.length > 0
      ) {
        formData.categoryIds.forEach((id) => {
          if (id) {
            apiFormData.append("categoryIds[]", id);
          }
        });
      } else {
        // Use fallback if no valid categories
        apiFormData.append("categoryIds[]", STATIC_CATEGORY_IDS.pendidikan);
      }

      // Append benefitIds
      if (
        formData.benefitIds &&
        Array.isArray(formData.benefitIds) &&
        formData.benefitIds.length > 0
      ) {
        formData.benefitIds.forEach((id) => {
          if (id) {
            apiFormData.append("benefitIds[]", id.toString().trim());
          }
        });
      } else {
        // Use fallback if no valid benefits
        apiFormData.append("benefitIds[]", STATIC_BENEFIT_IDS.sertifikat);
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

const CreateEvent = ({ onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
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

  // Fetch valid IDs and apply them directly to formData
  const fetchValidIdsAndApply = async () => {
    try {
      Swal.fire({
        title: "Menyiapkan Form",
        text: "Sedang mengambil data manfaat dan kategori",
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
        // Get valid IDs
        const validBenefitIds = benefitData.data.slice(0, 2).map((b) => b.id);
        const validCategoryIds = categoryData.data.slice(0, 1).map((c) => c.id);

        // Apply directly to form data
        setFormData((prev) => ({
          ...prev,
          benefitIds: validBenefitIds,
          categoryIds: validCategoryIds,
        }));

        return true;
      } else {
        console.warn("No valid benefits or categories found");
        Swal.fire({
          icon: "warning",
          title: "Perhatian",
          text: "Tidak dapat mengambil data kategori dan manfaat. Form akan menggunakan data default.",
          confirmButtonText: "OK",
        });
        return false;
      }
    } catch (error) {
      console.error("Error fetching valid IDs:", error);
      Swal.close();
      return false;
    }
  };

  // Check auth and fetch valid IDs on load
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Check authentication
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
          // Check partner profile
          const profileData = await partnerService.getPartnerProfile();

          // Store the partner ID for event creation
          if (
            profileData?.data?.id ||
            profileData?.data?.partner?.id ||
            profileData?.partner?.id
          ) {
            const partnerId =
              profileData?.data?.id ||
              profileData?.data?.partner?.id ||
              profileData?.partner?.id;
            localStorage.setItem("partnerId", partnerId);
          }

          // Fetch valid IDs automatically and apply them directly to formData
          await fetchValidIdsAndApply();
        } catch (profileError) {
          console.warn("Failed to load partner profile:", profileError);
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
        console.error("Initialization failed:", error);
        setAuthError("check_failed");
        setAuthChecked(true);
      }
    };

    initializeComponent();
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

      // Prepare form data
      let apiFormData;
      try {
        apiFormData = formUtils.prepareFormDataForSubmit(
          formData,
          isReadyToPublish
        );

        // Add partnerId to formData after it's created
        if (partnerId) {
          apiFormData.append("partnerId", partnerId);
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
      formUtils.saveFormToLocalStorage(formData);

      // Attempt to create event using the service
      try {
        const response = await partnerService.createEvent(apiFormData);

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

          // Try fetching valid IDs again and then retry
          const success = await fetchValidIdsAndApply();

          if (success) {
            // Try again with the newly applied IDs
            try {
              Swal.fire({
                title: "Mencoba Ulang...",
                text: "Membuat event dengan ID yang valid",
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },
              });

              // Create a new form data with the updated formData
              apiFormData = formUtils.prepareFormDataForSubmit(
                formData,
                isReadyToPublish
              );

              if (partnerId) {
                apiFormData.append("partnerId", partnerId);
              }

              const response = await partnerService.createEvent(apiFormData);

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
            } catch (retryError) {
              console.error(
                "Failed to create event with fetched IDs:",
                retryError
              );
              Swal.close();
              Swal.fire({
                icon: "error",
                title: "Gagal Membuat Event",
                text:
                  retryError.message ||
                  "Gagal membuat event bahkan dengan ID yang valid.",
                confirmButtonText: "OK",
              });
              return;
            }
          }

          // If retry fails or no valid IDs, show error
          Swal.fire({
            icon: "error",
            title: "ID Tidak Valid",
            text: serviceError.message,
            confirmButtonText: "OK",
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

        // Show error message for other errors
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Event",
          text: serviceError.message || "Terjadi kesalahan saat membuat event",
          confirmButtonText: "OK",
        });
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
