import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UploadKTP from "../Elements/forms/UploadKTP";
import { partnerService } from "../../services/partnerService";

// Icon untuk alert/info
const AlertIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="0.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ResponsiblePartner = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [ktpFile, setKtpFile] = useState(null); // STATE UNTUK FILE KTP
  const [formData, setFormData] = useState({
    namaPenanggungJawab: "",
    nomorKTP: "",
    noTelephone: "",
    posisiPenanggungJawab: "",
    ktpUrl: "",
    ktpImageId: ""
  });

  // Pastikan nilai position LOWERCASE sesuai BE
  const posisiOptions = [
    { value: "ceo", label: "CEO" },
    { value: "director", label: "Direktur" }, 
    { value: "manager", label: "Manajer" },
    { value: "coordinator", label: "Koordinator" },
    { value: "leader", label: "Leader" }, 
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
    { value: "other", label: "Lainnya" },
  ];

  // Fetch responsible person data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await partnerService.getResponsiblePerson();
        
        console.log("Fetched responsible person data:", response);
        
        if (response && response.data) {
          setExistingData(response.data);
          setFormData({
            namaPenanggungJawab: response.data.fullName || "",
            nomorKTP: response.data.nik || "",
            noTelephone: response.data.phoneNumber || "",
            posisiPenanggungJawab: response.data.position || "",
            ktpUrl: response.data.ktpUrl || "",
            ktpImageId: response.data.ktpImageId || ""
          });
        }
      } catch (error) {
        console.error("Error fetching responsible person:", error);
        // Jika belum ada data, tidak perlu menampilkan error
        if (error.response?.status !== 404) {
          toast.error("Gagal memuat data penanggung jawab");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Input changed: ${name} = ${value}`);
    
    // Untuk debug: log update form state setelah perubahan
    const updatedState = { ...formData, [name]: value };
    console.log("Updated formData:", updatedState);
  };

  // Handle KTP upload success
  const handleKtpUpload = (file, previewUrl, imageId) => {
    console.log("=== KTP UPLOAD CALLBACK ===");
    console.log("KTP file received:", file);
    console.log("Preview URL:", previewUrl);
    console.log("Image ID:", imageId);
    
    if (file) {
      setKtpFile(file);
      setFormData((prev) => ({
        ...prev,
        ktpUrl: previewUrl,
        ktpImageId: imageId,
      }));
      console.log("KTP file state updated:", file.name);
    } else {
      setKtpFile(null);
      setFormData((prev) => ({
        ...prev,
        ktpUrl: "",
        ktpImageId: "",
      }));
      console.log("KTP file cleared");
    }
    
    // Debug: log updated form state
    console.log("Updated formData:", {
      ...formData,
      ktpUrl: previewUrl,
      ktpImageId: imageId,
    });
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      console.log("=== SUBMIT FORM ===");
      console.log("Current formData:", formData);
      console.log("Current ktpFile:", ktpFile);
      
      // Basic validation for required fields
      if (!formData.namaPenanggungJawab.trim()) {
        toast.error("Nama penanggung jawab wajib diisi");
        return;
      }
      
      if (!formData.nomorKTP.trim()) {
        toast.error("Nomor KTP wajib diisi");
        return;
      } else if (formData.nomorKTP.trim().length !== 16) {
        toast.error("Nomor KTP harus terdiri dari 16 digit");
        return;
      }
      
      if (!formData.noTelephone.trim()) {
        toast.error("Nomor telepon wajib diisi");
        return;
      } else if (!formData.noTelephone.trim().startsWith('62')) {
        toast.error("Nomor telepon harus dimulai dengan kode negara 62");
        return;
      }
      
      if (!formData.posisiPenanggungJawab) {
        toast.error("Posisi penanggung jawab wajib dipilih");
        return;
      }
      
      // Validasi KTP: Harus ada file KTP baru atau URL KTP yang sudah ada
      if (!ktpFile && !formData.ktpUrl) {
        toast.error("Foto KTP wajib diunggah");
        return;
      }
      
      setSaving(true);
      
      // Prepare data for API sesuai dokumentasi BE
      const responsiblePersonData = {
        fullName: formData.namaPenanggungJawab.trim(),
        nik: formData.nomorKTP.trim(),
        phoneNumber: formData.noTelephone.trim(),
        position: formData.posisiPenanggungJawab,
        // Add existing data to preserve if needed
        id: existingData?.id,
        ktpImageId: formData.ktpImageId,
        ktpUrl: formData.ktpUrl
      };
      
      console.log("Submitting data:", responsiblePersonData);
      console.log("KTP file to upload:", ktpFile);
      
      try {
        // First try: standard upload with KTP file
        const response = await partnerService.updateResponsiblePerson(responsiblePersonData, ktpFile);
        
        console.log("API response:", response);
        
        // Verify the response has required KTP data
        if (response.data && (!response.data.ktpUrl || !response.data.ktpImageId)) {
          console.warn("Warning: Response doesn't contain ktpUrl or ktpImageId");
          toast.warning("Data berhasil disimpan, tetapi KTP mungkin belum terupload dengan benar");
        } else {
          toast.success("Data penanggung jawab berhasil disimpan");
        }
        
        // Refresh data after successful save
        try {
          // Direct update from response data is more reliable than refetching
          setExistingData(response.data);
          setFormData({
            namaPenanggungJawab: response.data.fullName || "",
            nomorKTP: response.data.nik || "",
            noTelephone: response.data.phoneNumber || "",
            posisiPenanggungJawab: response.data.position || "",
            ktpUrl: response.data.ktpUrl || "",
            ktpImageId: response.data.ktpImageId || ""
          });
          setKtpFile(null); // Clear file after success
        } catch (refreshError) {
          console.error("Failed to update UI with response data:", refreshError);
        }
      } catch (error) {
        console.error("Error saving responsible person:", error);
        
        // Handle server-side validation errors
        if (error.response?.status === 400) {
          toast.error(error.message || "Validasi gagal. Periksa kembali data Anda.");
          return;
        }
        
        // Handle ImageKit-specific errors (server 500)
        if (error.response?.status === 500) {
          // If ImageKit error but we have existing data, try to preserve it
          if (existingData && existingData.ktpUrl && existingData.ktpImageId) {
            toast.warn("Server mengalami masalah dengan upload KTP. Mencoba menyimpan data tanpa mengubah KTP...");
            
            try {
              // Try without updating KTP
              const fallbackResponse = await partnerService.updateResponsiblePerson({
                ...responsiblePersonData,
                ktpImageId: existingData.ktpImageId, // Use existing KTP ID
                ktpUrl: existingData.ktpUrl // Use existing KTP URL
              }, null); // No KTP file
              
              console.log("Fallback response (preserving KTP):", fallbackResponse);
              
              if (fallbackResponse.data) {
                toast.success("Data berhasil disimpan dengan KTP yang sudah ada");
                
                // Update UI with fallback response
                setExistingData(fallbackResponse.data);
                setFormData({
                  namaPenanggungJawab: fallbackResponse.data.fullName || "",
                  nomorKTP: fallbackResponse.data.nik || "",
                  noTelephone: fallbackResponse.data.phoneNumber || "",
                  posisiPenanggungJawab: fallbackResponse.data.position || "",
                  ktpUrl: fallbackResponse.data.ktpUrl || existingData.ktpUrl,
                  ktpImageId: fallbackResponse.data.ktpImageId || existingData.ktpImageId
                });
                return; // Exit early after successful fallback
              }
            } catch (fallbackError) {
              console.error("Fallback approach failed:", fallbackError);
            }
          }
          
          // If fallback failed or we have no existing KTP data
          toast.error("Server mengalami masalah dengan layanan ImageKit. Coba lagi nanti atau gunakan gambar KTP dengan format/ukuran berbeda.");
        } else {
          toast.error(error.message || "Gagal menyimpan data penanggung jawab");
        }
      }
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      toast.error("Terjadi kesalahan tak terduga. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      <h1 className="title">Penanggung Jawab</h1>
      <div className="w-full">
        <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
          <h2 className="text-lg font-semibold">Data Penanggung Jawab</h2>
          {existingData && (
            <p className="text-sm text-blue-200 mt-1">
              Data terakhir diperbarui: {new Date(existingData.updatedAt).toLocaleDateString('id-ID')}
            </p>
          )}
        </div>
        <div className="bg-[#F7F7F7] p-6 rounded-b">
          <div className="space-y-6">
            {/* Alert jika masalah dengan ImageKit */}
            {existingData && !existingData.ktpUrl && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertIcon size={20} className="text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">Perhatian: Data KTP tidak lengkap</p>
                    <p className="text-sm text-yellow-600">
                      KTP tidak terdeteksi di server. Silakan upload ulang foto KTP Anda.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Penanggung Jawab <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaPenanggungJawab"
                value={formData.namaPenanggungJawab}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap sesuai KTP"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                NIK / Nomor Induk Kependudukan{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomorKTP"
                value={formData.nomorKTP}
                onChange={handleInputChange}
                placeholder="Contoh: 3173031234567890"
                maxLength="16"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">NIK terdiri dari 16 digit angka sesuai KTP</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="noTelephone"
                value={formData.noTelephone}
                onChange={handleInputChange}
                placeholder="Contoh: 6281234567890"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gunakan format 62XXXXXXXXXX (tanpa tanda + atau awalan 0)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Posisi Penanggung Jawab{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="posisiPenanggungJawab"
                  value={formData.posisiPenanggungJawab}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white appearance-none"
                >
                  <option value="" disabled>
                    Pilih salah satu posisi
                  </option>
                  {posisiOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Posisi terpilih: {formData.posisiPenanggungJawab 
                  ? posisiOptions.find(opt => opt.value === formData.posisiPenanggungJawab)?.label || formData.posisiPenanggungJawab
                  : 'Belum dipilih'}
              </p>
            </div>

            <UploadKTP 
              onUploadSuccess={handleKtpUpload}
              initialImageUrl={formData.ktpUrl}
            />

            <div>
              <button
                onClick={handleSubmit}
                disabled={saving || loading}
                className={`px-8 py-3 bg-[#0A3E54] text-white rounded-lg font-medium hover:bg-[#0a2e3e] transition-colors ${
                  (saving || loading) ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Memuat data...</span>
                  </div>
                ) : existingData ? (
                  "Perbarui Data"
                ) : (
                  "Simpan Data"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiblePartner;