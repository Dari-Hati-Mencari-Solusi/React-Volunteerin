import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UploadKTP from "../Elements/forms/UploadKTP";
import { partnerService } from "../../services/partnerService";

const ResponsiblePartner = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    namaPenanggungJawab: "",
    nomorKTP: "",
    noTelephone: "",
    posisiPenanggungJawab: "",
    ktpUrl: "",
    ktpImageId: ""
  });

  const posisiOptions = [
    { value: "CEO", label: "CEO" },
    { value: "Director", label: "Direktur" },
    { value: "Executive Director", label: "Direktur Eksekutif" },
    { value: "Manager", label: "Manajer" },
    { value: "Coordinator", label: "Koordinator" },
    { value: "Head of Department", label: "Kepala Departemen" },
    { value: "Team Leader", label: "Ketua Tim" },
    { value: "Admin", label: "Admin" },
    { value: "Event Organizer", label: "Event Organizer" },
    { value: "Other", label: "Lainnya" },
  ];

  // Fetch responsible person data on component mount
  useEffect(() => {
    const fetchResponsiblePerson = async () => {
      try {
        setLoading(true);
        const response = await partnerService.getResponsiblePerson();
        
        console.log("Responsible person data:", response);
        
        if (response && response.data) {
          const respData = response.data;
          setFormData({
            namaPenanggungJawab: respData.fullName || "",
            nomorKTP: respData.nik || "",
            noTelephone: respData.phoneNumber || "",
            posisiPenanggungJawab: respData.position || "",
            ktpUrl: respData.ktpUrl || "",
            ktpImageId: respData.ktpImageId || ""
          });
        }
      } catch (error) {
        console.error("Error fetching responsible person:", error);
        toast.error("Gagal memuat data penanggung jawab");
      } finally {
        setLoading(false);
      }
    };

    fetchResponsiblePerson();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleKtpUpload = async (file, url, imageId) => {
    setFormData({
      ...formData,
      ktpUrl: url,
      ktpImageId: imageId
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.namaPenanggungJawab) {
        toast.error("Nama Penanggung Jawab tidak boleh kosong");
        return;
      }
      
      if (!formData.nomorKTP) {
        toast.error("Nomor KTP tidak boleh kosong");
        return;
      }
      
      if (!formData.noTelephone) {
        toast.error("Nomor Telepon tidak boleh kosong");
        return;
      }
      
      if (!formData.posisiPenanggungJawab) {
        toast.error("Posisi Penanggung Jawab harus dipilih");
        return;
      }
      
      if (!formData.ktpUrl) {
        toast.error("Foto KTP wajib diunggah");
        return;
      }

      setSaving(true);
      
      // Prepare data for API
      const responsiblePersonData = {
        fullName: formData.namaPenanggungJawab,
        nik: formData.nomorKTP,
        phoneNumber: formData.noTelephone,
        position: formData.posisiPenanggungJawab,
        ktpImageId: formData.ktpImageId
      };
      
      console.log("Submitting data:", responsiblePersonData);
      
      // Check if we're updating or creating
      let response;
      if (formData.ktpImageId) {
        response = await partnerService.updateResponsiblePerson(responsiblePersonData);
      } else {
        response = await partnerService.createResponsiblePerson(responsiblePersonData);
      }
      
      console.log("API response:", response);
      
      toast.success("Data penanggung jawab berhasil disimpan");
      
      // Refresh data
      if (response && response.data) {
        const respData = response.data;
        setFormData({
          namaPenanggungJawab: respData.fullName || "",
          nomorKTP: respData.nik || "",
          noTelephone: respData.phoneNumber || "",
          posisiPenanggungJawab: respData.position || "",
          ktpUrl: respData.ktpUrl || "",
          ktpImageId: respData.ktpImageId || ""
        });
      }
      
    } catch (error) {
      console.error("Error saving responsible person:", error);
      toast.error(error.message || "Gagal menyimpan data penanggung jawab");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full mx-auto space-y-6 flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      <h1 className="title">Penanggung Jawab</h1>
      <div className="w-full">
        <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
          <h2 className="text-lg font-semibold">Data Penanggung Jawab</h2>
        </div>
        <div className="bg-[#F7F7F7] p-6 rounded-b">
          <div className="space-y-6">
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
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">NIK terdiri dari 16 digit angka</p>
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
              <p className="text-xs text-gray-500 mt-1">Gunakan format 62XXXXXXXXXX (tanpa tanda + atau awalan 0)</p>
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
            </div>

            <UploadKTP 
              onUploadSuccess={handleKtpUpload}
              initialImageUrl={formData.ktpUrl}
            />

            <div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`px-8 py-3 bg-[#0A3E54] text-white rounded-lg font-medium hover:bg-[#0a2e3e] transition-colors ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  "Simpan"
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