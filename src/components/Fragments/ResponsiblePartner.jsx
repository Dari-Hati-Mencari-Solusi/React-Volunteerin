import { Upload } from "lucide-react";
import React, { useState } from "react";
import UploadKTP from "../Elements/forms/UploadKTP";

const ResponsiblePartner = () => {
  const [formData, setFormData] = useState({
    namaPenanggungJawab: "",
    nomorKTP: "",
    noTelephone: "628726237192",
    posisiPenanggungJawab: "",
    banner: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

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
                Nama Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaPenanggungJawab"
                value={formData.namaPenanggungJawab}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nik / Nomor induk kependudukan{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomorKTP"
                value={formData.nomorKTP}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                No. Telephone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="noTelephone"
                value={formData.noTelephone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-gray-100"
              />
            </div>

            {/* <BannerProfilePartner /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="komunitas">Mahasiswa</option>
                    <option value="pemerintah">Pegawai Negeri</option>
                    <option value="perusahaan">Dosen</option>
                    <option value="individu">Karyawan</option>
                    <option value="individu">Event Organizer</option>
                    <option value="individu">Lainya</option>
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
            </div>

            <UploadKTP />

            <div>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#0A3E54] text-white rounded-lg font-medium hover:bg-[#0a2e3e] transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiblePartner;
