import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from 'sweetalert2';
import Logo from "../../assets/images/logowhite.svg";
import { userService } from "../../services/userService";
import { fetchEvents } from "../../services/eventService";

const FormRegisterUser = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();

  const eventIdFromState = location.state?.eventId;
const effectiveEventId = eventId || eventIdFromState;

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    institution: "",
    expectation: "",
  });

  const [formId, setFormId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  // Fungsi validasi yang baru
  const validateForm = () => {
    const requiredFields = formFields.filter(field => field.required);
    
    for (const field of requiredFields) {
      if (!formData[field.id] || formData[field.id].trim() === '') {
        Swal.fire({
          title: 'Validasi Gagal',
          text: `${field.label} wajib diisi`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0A3E54'
        });
        return false;
      }
    }
    
    return true;
  };

  // Ambil daftar event jika dibutuhkan
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents();
        if (response && response.data) {
          setAvailableEvents(response.data);
        }
      } catch (err) {
        // Error handling
      }
    };

    if (!effectiveEventId) {
      loadEvents();
      setShowEventSelector(true);
      setLoading(false);
    }
  }, [effectiveEventId]);

  // Ambil struktur form
  useEffect(() => {
    const fetchFormStructure = async () => {
      if (!effectiveEventId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get form for the specific event
        const response = await userService.getRegistrationForm(effectiveEventId);

        if (response && response.data && response.data.length > 0) {
          // Cari form yang sesuai dengan eventId
          const matchingForm = response.data.find(form => form.eventId === effectiveEventId);
          
          if (matchingForm) {
            setFormId(matchingForm.id);
            setEvent(matchingForm.event);
            
            // Handle jika content adalah array (sesuai dengan respons API Anda)
            if (Array.isArray(matchingForm.content)) {
              setFormFields(matchingForm.content);
              
              const initialFormData = {};
              matchingForm.content.forEach((field) => {
                initialFormData[field.id] = "";
              });
              setFormData(initialFormData);
            } 
            // Handle jika content adalah objek dengan fields
            else if (matchingForm.content && Array.isArray(matchingForm.content.fields)) {
              setFormFields(matchingForm.content.fields);
              
              const initialFormData = {};
              matchingForm.content.fields.forEach((field) => {
                initialFormData[field.id] = "";
              });
              setFormData(initialFormData);
            } 
            else {
              throw new Error("Format formulir tidak valid");
            }
          } else {
            // Jika tidak ada form yang sesuai, gunakan template default
            setFormId("default-form-id");
            
            // Get the event info
            try {
              const eventResponse = await fetch(`${import.meta.env.VITE_BE_BASE_URL}/events/${effectiveEventId}`);
              const eventData = await eventResponse.json();
              if (eventData && eventData.data) {
                setEvent(eventData.data);
              }
            } catch (eventErr) {
              // Error handling
            }
            
            // Default fields
            const defaultFields = [
              {
                id: "fullName",
                type: "text",
                label: "Nama Lengkap",
                required: true
              },
              {
                id: "emailAddress",
                type: "email",
                label: "Email",
                required: true
              },
              {
                id: "phoneNumber",
                type: "tel",
                label: "Nomor Telepon",
                required: true
              },
              {
                id: "institution",
                type: "text",
                label: "Institusi",
                required: true
              },
              {
                id: "expectation",
                type: "textarea",
                label: "Harapan dari Workshop",
                required: false
              }
            ];
            
            setFormFields(defaultFields);
            
            const initialFormData = {};
            defaultFields.forEach((field) => {
              initialFormData[field.id] = "";
            });
            setFormData(initialFormData);
          }
        } else {
          // Jika tidak ada formulir, gunakan template default
          // Kode default form sama seperti di atas
        }
      } catch (err) {
        setError(err.message || "Gagal memuat formulir pendaftaran");
      } finally {
        setLoading(false);
      }
    };

    fetchFormStructure();
  }, [effectiveEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

 // Mengubah hanya bagian handleSubmit pada komponen FormRegisterUser
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    if (!effectiveEventId) {
      Swal.fire({
        title: 'Peringatan',
        text: 'ID Event tidak ditemukan',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
      return;
    }
    
    if (!formId) {
      Swal.fire({
        title: 'Peringatan',
        text: 'ID Form tidak ditemukan',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
      return;
    }

    // Konfirmasi pendaftaran
    const result = await Swal.fire({
      title: 'Konfirmasi Pendaftaran',
      text: 'Pastikan data yang Anda masukkan sudah benar. Lanjutkan pendaftaran?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Daftar Sekarang',
      cancelButtonText: 'Periksa Kembali',
      confirmButtonColor: '#0A3E54',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsSubmitting(true);
    
    console.log("Sending registration data:", {
      eventId: effectiveEventId,
      formId,
      formData
    });
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found! User may need to log in again.');
        Swal.fire({
          title: 'Sesi Habis',
          text: 'Silakan login kembali untuk melanjutkan pendaftaran',
          icon: 'warning',
          confirmButtonText: 'Login',
          confirmButtonColor: '#0A3E54'
        }).then(() => {
          navigate('/auth', { state: { returnUrl: `/events/${effectiveEventId}/register` } });
        });
        return;
      }
      
      const response = await userService.submitVolunteerRegistration(
        effectiveEventId,
        formId,
        formData
      );
      
      console.log("Registration response:", response);
      
      setIsSubmitted(true);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        text: response?.message || 'Terima kasih telah mendaftar sebagai relawan',
        showConfirmButton: false,
        timer: 3000
      });

      setTimeout(() => {
        setIsSubmitted(false);
        const resetData = {};
        formFields.forEach((field) => {
          resetData[field.id] = "";
        });
        setFormData(resetData);
        setFileName("");
        setCurrentStep(1);
        
        // Redirect ke halaman registered event dengan parameter untuk refresh data
        navigate("/regis-event", { 
          replace: true,
          state: { 
            justRegistered: true, 
            eventId: effectiveEventId,
            refreshData: true
          }
        });
      }, 3000);
    } catch (apiError) {
      console.error('API error:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    Swal.fire({
      title: 'Error',
      text: error.message || "Gagal mengirim formulir. Silakan coba lagi.",
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0A3E54'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleEventSelection = () => {
    if (!selectedEventId) {
      Swal.fire({
        title: 'Informasi',
        text: 'Silakan pilih event terlebih dahulu',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
      return;
    }
    
    navigate(`/events/${selectedEventId}/register`, { replace: true });
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const nextStep = () => {
    // Validasi field di step 1 sebelum lanjut
    const step1Fields = formFields.filter((field) =>
      ["fullName", "emailAddress", "phoneNumber"].includes(field.id) && field.required
    );
    
    for (const field of step1Fields) {
      if (!formData[field.id] || formData[field.id].trim() === '') {
        Swal.fire({
          title: 'Validasi Gagal',
          text: `${field.label} wajib diisi`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0A3E54'
        });
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Tampilkan selector event jika diperlukan
  if (showEventSelector) {
    return (
      <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Event</h2>
          <p className="text-gray-600 mb-6">
            Silakan pilih event yang ingin Anda daftar sebagai relawan.
          </p>
          
          {availableEvents.length > 0 ? (
            <>
              <div className="mb-4">
                <label htmlFor="eventSelect" className="block text-sm font-medium text-gray-700 mb-2">
                  Event
                </label>
                <select
                  id="eventSelect"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3e54] focus:border-[#0a3e54]"
                >
                  <option value="">-- Pilih Event --</option>
                  {availableEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleEventSelection}
                className="w-full px-4 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Lanjutkan
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <Icon icon="mdi:calendar-blank" className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-gray-600">Tidak ada event yang tersedia saat ini</p>
              <button
                onClick={() => navigate("/events")}
                className="mt-6 px-4 py-2 bg-[#0A3E54] text-white rounded-lg"
              >
                Lihat Daftar Event
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat formulir pendaftaran...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
            <Icon icon="mdi:alert" className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Terjadi Kesalahan
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-6 px-4 py-2 bg-[#0A3E54] text-white rounded-lg"
          >
            Kembali ke Daftar Event
          </button>
        </div>
      </div>
    );
  }

  // Render form fields dinamis untuk Step 1
  const renderStep1Fields = () => {
    if (!formFields || formFields.length === 0) {
      return <p className="text-gray-600">Tidak ada field yang tersedia</p>;
    }
    
    const step1Fields = formFields.filter((field) =>
      ["fullName", "emailAddress", "phoneNumber"].includes(field.id)
    );
    
    if (step1Fields.length === 0) {
      return <p className="text-gray-600">Tidak ada field untuk langkah ini</p>;
    }

    return step1Fields.map((field) => (
      <div className="relative bg-gray-50 rounded-xl px-6 py-5" key={field.id}>
        <div className="absolute top-5 left-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
            <Icon
              icon={
                field.id === "fullName"
                  ? "mdi:user"
                  : field.id === "emailAddress"
                  ? "mdi:email"
                  : "mdi:phone"
              }
              className="h-5 w-5 text-white"
            />
          </div>
        </div>
        <div className="ml-16">
          <label
            htmlFor={field.id}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-600">*</span>}
          </label>
          <input
            type={field.type}
            name={field.id}
            id={field.id}
            required={field.required}
            value={formData[field.id] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
          />
        </div>
      </div>
    ));
  };

  // Render form fields dinamis untuk Step 2
  const renderStep2Fields = () => {
    if (!formFields || formFields.length === 0) {
      return <p className="text-gray-600">Tidak ada field yang tersedia</p>;
    }
    
    const step2Fields = formFields.filter((field) =>
      ["institution", "expectation"].includes(field.id)
    );
    
    if (step2Fields.length === 0) {
      return <p className="text-gray-600">Tidak ada field untuk langkah ini</p>;
    }

    return step2Fields.map((field) => (
      <div className="relative bg-gray-50 rounded-xl px-6 py-5" key={field.id}>
        <div className="absolute top-5 left-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
            <Icon
              icon={
                field.id === "institution"
                  ? "mdi:school"
                  : "mdi:comment-text-outline"
              }
              className="h-5 w-5 text-white"
            />
          </div>
        </div>
        <div className="ml-16">
          <label
            htmlFor={field.id}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-600">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              name={field.id}
              id={field.id}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
              placeholder={`Masukkan ${field.label.toLowerCase()}`}
            />
          ) : (
            <input
              type={field.type}
              name={field.id}
              id={field.id}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
              placeholder={`Masukkan ${field.label.toLowerCase()}`}
            />
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative overflow-hidden h-40 md:h-36 lg:h-36 bg-gradient-to-r from-[#0A3E54] to-[#116173]">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#0A3E54] to-teal-400 opacity-30"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-r from-teal-400 to-[#0A3E54] opacity-30"></div>

          <div className="relative flex flex-col items-center justify-center h-full px-8 text-center">
            <img src={Logo} alt="Logo" className="w-16 h-16" />
            <h2 className="text-2xl font-bold text-white">VOLUNTEERIN</h2>
            <p className="text-white/80 mt-1">
              Temukan Peluangmu, Wujudkan Aksimu
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg">
              <Icon icon="mdi:check" className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-800">
              Pendaftaran Sukses!
            </h3>
            <p className="mt-3 text-md text-gray-600">
              Terima kasih telah mendaftar sebagai relawan. Kami akan
              menghubungi Anda segera untuk informasi selanjutnya.
            </p>
            <div className="mt-8">
              <button
                onClick={navigateToHome}
                className="px-6 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Form Pendaftaran {event?.title ? `- ${event.title}` : ""}
              </h3>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentStep >= 1 ? "bg-[#0A3E54]" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-10 h-1 ${
                    currentStep >= 2 ? "bg-[#0A3E54]" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentStep >= 2 ? "bg-[#0A3E54]" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>

            {currentStep === 1 ? (
              <div className="space-y-6">
                <p className="text-md text-gray-600 mb-6">
                  Isi data pribadi Anda untuk mulai mendaftar sebagai relawan
                </p>

                {renderStep1Fields()}

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    Selanjutnya
                    <Icon icon="mdi:chevron-right" className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-md text-gray-600 mb-6">
                  Lengkapi informasi tambahan
                </p>

                {renderStep2Fields()}

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon
                        icon="mdi:file-document-outline"
                        className="h-5 w-5 text-white"
                      />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="dokumen"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Dokumen Pendukung
                    </label>
                    <div className="relative border-2 border-dashed border-[#0A3E54] rounded-xl bg-white transition-colors p-4">
                      <div className="flex items-center justify-center">
                        {!fileName ? (
                          <div className="text-center py-4">
                            <Icon
                              icon="mdi:upload"
                              className="mx-auto h-10 w-10 text-[#0A3E54]"
                            />
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium text-[#0A3E54] cursor-pointer">
                                Klik untuk upload
                              </span>{" "}
                              atau drag & drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC hingga 2MB
                            </p>
                          </div>
                        ) : (
                          <div className="bg-indigo-50 p-3 rounded-lg flex items-center w-full">
                            <Icon
                              icon="mdi:file-document-outline"
                              className="h-6 w-6 text-[#088FB2] mr-3"
                            />
                            <span className="text-sm text-gray-700 truncate">
                              {fileName}
                            </span>
                            <button
                              onClick={() => setFileName("")}
                              className="ml-auto text-sm text-[#0A3E54]"
                            >
                              Ganti
                            </button>
                          </div>
                        )}
                        <input
                          id="dokumen"
                          name="dokumen"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSubmitting ? "Mengirim..." : "Daftar Sekarang"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormRegisterUser;