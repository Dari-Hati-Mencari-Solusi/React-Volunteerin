import React, { useState } from "react";
import BannerProfilePartner from "../Elements/forms/BannerProfilePartner";

const ProfilePartnerPage = () => {
  const [formData, setFormData] = useState({
    namaPenyelenggara: "",
    emailPenyelenggara: "Volunteerin@gmail.com",
    noTelephone: "628726237192",
    banner: null,
    jenisPenyelenggara: "",
    usernameInstagram: "",
    urlGoogleMaps: "",
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
      <h1 className="title">Profile Penyelenggara</h1>
      <div className="w-full">
        <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
          <h2 className="text-lg font-semibold">Data Penyelenggara</h2>
        </div>
        <div className="bg-[#F7F7F7] p-6 rounded-b">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaPenyelenggara"
                value={formData.namaPenyelenggara}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="emailPenyelenggara"
                value={formData.emailPenyelenggara}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-gray-100"
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

            <BannerProfilePartner />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Jenis Penyelenggara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="jenisPenyelenggara"
                    value={formData.jenisPenyelenggara}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white appearance-none"
                  >
                    <option value="" disabled>
                      Pilih salah satu jenis event
                    </option>
                    <option value="komunitas">Komunitas</option>
                    <option value="pemerintah">Pemerintah / Instansi</option>
                    <option value="perusahaan">Perusahaan</option>
                    <option value="individu">Individu / Perseorangan</option>
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Username Instagram <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="usernameInstagram"
                  value={formData.usernameInstagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL Google Maps <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="urlGoogleMaps"
                value={formData.urlGoogleMaps}
                onChange={handleInputChange}
                placeholder="Masukan lokasi anda disini"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

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

export default ProfilePartnerPage;
