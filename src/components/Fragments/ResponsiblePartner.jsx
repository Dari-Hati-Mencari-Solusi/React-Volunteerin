import React, { useState, useEffect } from 'react';
import { partnerService } from '../../services/partnerService';
import { toast } from 'react-toastify';
import UploadKTP from '../Elements/forms/UploadKTP';
import { AlertTriangle as AlertIcon } from 'lucide-react';

const ResponsiblePartner = () => {
  const [formData, setFormData] = useState({
    namaPenanggungJawab: "",
    nomorKTP: "",
    noTelephone: "",
    posisiPenanggungJawab: "",
    ktpUrl: "",
    ktpImageId: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [ktpFile, setKtpFile] = useState(null);

  // Position options for dropdown
  const posisiOptions = [
    { value: "ceo", label: "CEO / Direktur Utama" },
    { value: "leader", label: "Ketua / Pemimpin" },
    { value: "project_manager", label: "Project Manager" },
    { value: "coordinator", label: "Koordinator" },
    { value: "other", label: "Lainnya" }
  ];

  // Load existing responsible person data
  useEffect(() => {
    const fetchResponsiblePerson = async () => {
      try {
        setLoading(true);
        
        const responsiblePersonData = await partnerService.getResponsiblePerson();
        
        if (responsiblePersonData && responsiblePersonData.data) {
          setExistingData(responsiblePersonData.data);
          
          // Map backend data to form fields
          setFormData({
            namaPenanggungJawab: responsiblePersonData.data.fullName || "",
            nomorKTP: responsiblePersonData.data.nik || "",
            noTelephone: responsiblePersonData.data.phoneNumber || "",
            posisiPenanggungJawab: responsiblePersonData.data.position?.toLowerCase() || "",
            ktpUrl: responsiblePersonData.data.ktpUrl || "",
            ktpImageId: responsiblePersonData.data.ktpImageId || ""
          });
        }
      } catch (error) {
        toast.error("Failed to load responsible person data");
      } finally {
        setLoading(false);
      }
    };

    fetchResponsiblePerson();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === "noTelephone") {
      let processedValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      
      // Ensure it starts with 62
      if (processedValue && !processedValue.startsWith('62')) {
        if (processedValue.startsWith('0')) {
          processedValue = '62' + processedValue.substring(1);
        } else if (!isNaN(processedValue)) {
          processedValue = '62' + processedValue;
        }
      }
      
      setFormData({
        ...formData,
        [name]: processedValue
      });
      return;
    }
    
    // Special handling for KTP number
    if (name === "nomorKTP") {
      const processedValue = value.replace(/[^0-9]/g, '').substring(0, 16);
      setFormData({
        ...formData,
        [name]: processedValue
      });
      return;
    }
    
    // Default handling
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle KTP upload callback
  const handleKtpUpload = (file, url, imageId) => {
    setKtpFile(file);
    
    setFormData(prev => ({
      ...prev,
      ktpUrl: url || prev.ktpUrl,
      ktpImageId: imageId || prev.ktpImageId
    }));
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      // Basic validation for required fields
      if (!formData.namaPenanggungJawab.trim()) {
        toast.error("Name is required");
        return;
      }
      
      if (!formData.nomorKTP.trim()) {
        toast.error("ID number is required");
        return;
      } else if (formData.nomorKTP.trim().length !== 16) {
        toast.error("ID number must be 16 digits");
        return;
      }
      
      if (!formData.noTelephone.trim()) {
        toast.error("Phone number is required");
        return;
      } else if (!formData.noTelephone.trim().startsWith('62')) {
        toast.error("Phone number must start with country code 62");
        return;
      }
      
      if (!formData.posisiPenanggungJawab) {
        toast.error("Position is required");
        return;
      }
      
      // ID card validation: Must have either a new ID card file or existing ID card URL
      if (!ktpFile && !formData.ktpImageId) {
        toast.error("ID card image must be uploaded");
        return;
      }
      
      setSaving(true);
      
      // Prepare data for API according to BE documentation
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
      
      try {
        const API_URL = import.meta.env.VITE_BE_BASE_URL;
        
        // DIRECT FETCH APPROACH: Try POST then PUT if it fails
        toast.info("Saving responsible person data...");
        
        // Prepare FormData
        const responsibleFormData = new FormData();
        responsibleFormData.append('nik', responsiblePersonData.nik);
        responsibleFormData.append('fullName', responsiblePersonData.fullName);
        responsibleFormData.append('phoneNumber', responsiblePersonData.phoneNumber);
        responsibleFormData.append('position', responsiblePersonData.position);
        
        // Add KTP file if available
        if (ktpFile && ktpFile instanceof File) {
          responsibleFormData.append('ktp', ktpFile);
        } else if (formData.ktpImageId) {
          responsibleFormData.append('ktpImageId', formData.ktpImageId);
        }
        
        // Check token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }
        
        // TRY POST FIRST
        let success = false;
        let responseData = null;
        
        try {
          const postResponse = await fetch(`${API_URL}/partners/me/responsible-person`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: responsibleFormData
          });
          
          if (postResponse.ok) {
            responseData = await postResponse.json();
            success = true;
          } else {
            const errorData = await postResponse.json();
          }
        } catch (postError) {
          // Continue to PUT if POST fails
        }
        
        // IF POST FAILS, TRY PUT
        if (!success) {
          try {
            const putResponse = await fetch(`${API_URL}/partners/me/responsible-person`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: responsibleFormData
            });
            
            responseData = await putResponse.json();
            
            if (putResponse.ok) {
              success = true;
            } else {
              throw new Error(responseData.message || `Update failed! Status: ${putResponse.status}`);
            }
          } catch (putError) {
            throw putError;
          }
        }
        
        if (success) {
          // Success! Toast and update UI
          toast.success("Responsible person data saved successfully");
          
          // Re-fetch to get updated data
          const refreshedData = await partnerService.getResponsiblePerson();
          if (refreshedData && refreshedData.data) {
            setExistingData(refreshedData.data);
            setFormData({
              namaPenanggungJawab: refreshedData.data.fullName || "",
              nomorKTP: refreshedData.data.nik || "",
              noTelephone: refreshedData.data.phoneNumber || "",
              posisiPenanggungJawab: refreshedData.data.position || "",
              ktpUrl: refreshedData.data.ktpUrl || "",
              ktpImageId: refreshedData.data.ktpImageId || ""
            });
            setKtpFile(null);
          }
        } else {
          throw new Error("Both POST and PUT methods failed. Please try again.");
        }
      } catch (error) {
        toast.error(error.message || "Failed to save responsible person data");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
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