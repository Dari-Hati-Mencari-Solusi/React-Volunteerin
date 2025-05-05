import React, { useState } from "react";
import { Icon } from "@iconify/react";

const EventForm = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [customBenefit, setCustomBenefit] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notification, setNotification] = useState("");

  const benefitsList = [
    { name: "Lingkungan", icon: "mdi:leaf" },
    { name: "Pendidikan", icon: "mdi:book" },
    { name: "Sosial", icon: "mdi:hand-heart" },
    { name: "Kesehatan", icon: "mdi:heart-pulse" },
    { name: "Teknologi", icon: "mdi:laptop" },
  ];

  const toggleBenefit = (benefit) => {
    if (selectedBenefits.some((b) => b.name === benefit.name)) {
      setSelectedBenefits(
        selectedBenefits.filter((b) => b.name !== benefit.name)
      );
    } else {
      if (selectedBenefits.length < 4) {
        setSelectedBenefits([...selectedBenefits, benefit]);
      } else {
        setNotification("Anda hanya dapat memilih maksimal 4 manfaat.");
      }
    }
  };

  const handleCreateBenefit = () => {
    if (customBenefit && selectedIcon) {
      if (selectedBenefits.length < 4) {
        setSelectedBenefits([
          ...selectedBenefits,
          { name: customBenefit, icon: selectedIcon },
        ]);
        setCustomBenefit("");
        setSelectedIcon(null);
        setNotification("");
      } else {
        setNotification("Anda hanya dapat membuat maksimal 4 manfaat.");
      }
    }
  };

  const searchIcons = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(
          query
        )}&limit=20`
      );
      const data = await response.json();
      setSearchResults(data.icons);
    } catch (error) {
      console.error("Error fetching icons:", error);
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchIcons(term);
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Event</h2>
          <button className="text-white focus:outline-none">
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-3xl"
            />
          </button>
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden rounded-b-xl transition-all duration-300 w-full ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
            <div>
              <label
                htmlFor="namaLengkap"
                className="block text-sm font-medium mb-2"
              >
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaLengkap"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="kategoriEvent"
                className="block text-sm font-medium mb-2"
              >
                Kategori  <span className="text-red-500">*</span>
              </label>
              <select
                id="kategoriEvent"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              >
                <option value="" disabled selected>
                  Pilih Kategori
                </option>
                <option value="seminar">Lingkungan</option>
                <option value="workshop">Pendidikan</option>
                <option value="pelatihan">Sosial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Manfaat  <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white">
                <div className="flex flex-wrap gap-2 flex-1">
                  {selectedBenefits.length > 0 ? (
                    selectedBenefits.map((benefit) => (
                      <span
                        key={benefit.name}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                      >
                        <Icon icon={benefit.icon} className="text-lg" />
                        {benefit.name}
                        <button
                          onClick={() => toggleBenefit(benefit)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Icon icon="mdi:close-circle" className="text-lg" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Pilih Manfaat</span>
                  )}
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="ml-2 text-blue-500 hover:text-blue-600"
                >
                  <Icon icon="mdi:plus-circle" className="text-2xl" />
                </button>
              </div>
              {notification && (
                <p className="text-red-500 text-sm mt-2">{notification}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="deskripsiEvent"
                className="block text-sm font-medium mb-2"
              >
                Deskripsi  <span className="text-red-500">*</span>
              </label>
              <textarea
                id="deskripsiEvent"
                rows="4"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="urlEvent"
                className="block text-sm font-medium mb-2"
              >
                URL Event <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                  volunteerin.id/event/
                </span>
                <input
                  type="text"
                  id="urlEvent"
                  className="flex-1 w-full px-4 py-2 rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                  placeholder="nama_event"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Pilih Manfaat
            </h3>
            <div className="space-y-2">
              {benefitsList.map((benefit) => (
                <label
                  key={benefit.name}
                  className="flex items-center space-x-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedBenefits.some(
                      (b) => b.name === benefit.name
                    )}
                    onChange={() => toggleBenefit(benefit)}
                    className="accent-blue-500"
                  />
                  <Icon icon={benefit.icon} className="text-xl text-blue-500" />
                  <span className="text-gray-700">{benefit.name}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="text-md font-medium text-gray-800">
                Tambah Manfaat Baru
              </h4>
              <input
                type="text"
                placeholder="Nama Manfaat"
                value={customBenefit}
                onChange={(e) => setCustomBenefit(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Cari ikon (contoh: home, search, settings)..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-2">
                    {searchResults.map((icon, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-100 rounded-lg text-center cursor-pointer hover:bg-gray-200"
                        onClick={() => setSelectedIcon(icon)}
                      >
                        <Icon icon={icon} className="w-6 h-6 mx-auto" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleCreateBenefit}
                disabled={!customBenefit || !selectedIcon}
                className={`mt-2 w-full text-white py-2 rounded-lg transition-colors duration-300 ${
                  customBenefit && selectedIcon
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Tambahkan
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;
