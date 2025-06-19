import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useBenefits, getBenefitIcon } from "../../../hooks/useBenefits";

const API_URL = import.meta.env.VITE_BE_BASE_URL;

const EventForm = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState({
    categories: false,
    benefits: false,
  });

  const {
    benefits,
    loading: benefitsLoading,
    error: benefitsError,
    STATIC_BENEFIT_IDS,
  } = useBenefits();

  useEffect(() => {
    setLoading((prev) => ({ ...prev, benefits: benefitsLoading }));
  }, [benefitsLoading]);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "OPEN",
    description: "",
    slug: "",
  });

  // Tambahkan state untuk modal dan custom benefit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customBenefit, setCustomBenefit] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Referensi untuk mencegah pemanggilan onUpdate berulang kali
  const updateParentRef = useRef(
    debounce((data) => {
      if (onUpdate) {
        onUpdate(data);
      }
    }, 500)
  );

  // Tambahkan fungsi error boundary di useImperativeHandle
  useImperativeHandle(ref, () => ({
    validate: () => {
      try {
        const errors = [];
        if (!formData.title) errors.push("Judul event harus diisi");
        if (!formData.description) errors.push("Deskripsi event harus diisi");
        if (selectedCategories.length === 0)
          errors.push("Minimal pilih satu kategori event");
        if (selectedBenefits.length === 0)
          errors.push("Minimal pilih satu manfaat event");

        console.log("EventForm validation:", {
          hasTitle: !!formData.title,
          hasDescription: !!formData.description,
          categoryCount: selectedCategories.length,
          benefitCount: selectedBenefits.length,
          errors,
        });

        return errors;
      } catch (error) {
        console.error("Error during validation:", error);
        return ["Terjadi kesalahan pada validasi form"];
      }
    },
    getData: () => {
      try {
        // CRITICAL: Pastikan benefitIds adalah array string dari ID benefit yang valid
        const benefitIds = selectedBenefits.map(
          (benefit) => benefit.id || STATIC_BENEFIT_IDS.sertifikat
        );

        const data = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          categoryIds: selectedCategories.map((cat) => cat.id),
          benefitIds: benefitIds,
        };

        console.log("getData called from EventForm, returning:", data);
        return data;
      } catch (error) {
        console.error("Error getting form data:", error);
        // Return fallback data in case of error
        return {
          title: formData.title || "Default Title",
          description: formData.description || "Default Description",
          type: formData.type || "OPEN",
          categoryIds: [STATIC_BENEFIT_IDS.sertifikat],
          benefitIds: [STATIC_BENEFIT_IDS.sertifikat],
        };
      }
    },
  }));

  // Fetch categories on mount - HANYA SEKALI
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading((prev) => ({ ...prev, categories: true }));

        // HARDCODED CATEGORIES untuk fallback
        const hardcodedCategories = [
          { id: uuidv4(), name: "Pendidikan" },
          { id: uuidv4(), name: "Lingkungan" },
          { id: uuidv4(), name: "Sosial" },
          { id: uuidv4(), name: "Kesehatan" },
          { id: uuidv4(), name: "Teknologi" },
          { id: uuidv4(), name: "Seni & Budaya" },
        ];

        try {
          const response = await axios.get(`${API_URL}/categories?type=EVENT`);

          if (
            response.data &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            setCategories(response.data.data);
          } else {
            console.warn(
              "API categories tidak mengembalikan data yang valid, menggunakan hardcoded"
            );
            setCategories(hardcodedCategories);
          }
        } catch (apiError) {
          console.error("API categories gagal:", apiError.message);
          setCategories(hardcodedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);

        // Fallback kategori jika ada error
        const fallbackCategories = [
          { id: uuidv4(), name: "Pendidikan" },
          { id: uuidv4(), name: "Lingkungan" },
          { id: uuidv4(), name: "Sosial" },
          { id: uuidv4(), name: "Kesehatan" },
          { id: uuidv4(), name: "Teknologi" },
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    fetchCategories();
  }, []); // Dependency array kosong - hanya dijalankan sekali

  // Update parent component when form data or selections change dengan debounce
  useEffect(() => {
    // Persiapkan data untuk parent
    const benefitIds = selectedBenefits.map((benefit) => benefit.id);

    const data = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      categoryIds: selectedCategories.map((cat) => cat.id),
      benefitIds: benefitIds,
    };

    // Gunakan fungsi debounce yang disimpan di ref
    updateParentRef.current(data);
  }, [formData, selectedCategories, selectedBenefits]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      // Generate slug from title
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_");

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.some((c) => c.id === category.id)) {
        return prev.filter((c) => c.id !== category.id);
      } else {
        return [...prev, category];
      }
    });
  };

  // Fungsi untuk toggle benefit
  const toggleBenefit = (benefit) => {
    setSelectedBenefits((prev) => {
      const isSelected = prev.some((b) => b.id === benefit.id);

      if (isSelected) {
        return prev.filter((b) => b.id !== benefit.id);
      } else {
        if (prev.length < 4) {
          return [...prev, benefit];
        } else {
          // Show notification
          setNotification("Anda hanya dapat memilih maksimal 4 manfaat.");
          setTimeout(() => {
            setNotification("");
          }, 3000);
          return prev; // Return unchanged
        }
      }
    });
  };

  // Fungsi untuk menangani custom benefit
  const handleCreateBenefit = async () => {
    if (customBenefit && selectedIcon) {
      if (selectedBenefits.length < 4) {
        // Buat benefit baru dengan UUID valid
        const newBenefit = {
          id: uuidv4(), // Generate UUID valid
          name: customBenefit,
          icon: selectedIcon,
        };

        // Tambahkan ke state selectedBenefits
        setSelectedBenefits((prev) => [...prev, newBenefit]);

        // Reset form
        setCustomBenefit("");
        setSelectedIcon(null);
        setSearchTerm("");
        setSearchResults([]);
        setNotification("");

        // Opsional: Coba tambahkan benefit ke API (jika tersedia)
        try {
          // Kode ini akan mencoba POST benefit baru ke API
          // Namun tetap menggunakan benefit baru meski API gagal
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${API_URL}/benefits`,
            {
              name: customBenefit,
              icon: selectedIcon,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log(
            "Benefit baru hanya ditambahkan secara lokal:",
            newBenefit
          );
        }
      } else {
        setNotification("Anda hanya dapat membuat maksimal 4 manfaat.");
        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    }
  };

  // Fungsi untuk mencari icon dari Iconify API
  const searchIcons = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      // Mencari icon dari Iconify API
      const response = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(
          query
        )}&limit=20`
      );
      const data = await response.json();
      setSearchResults(data.icons || []);
    } catch (error) {
      console.error("Error fetching icons:", error);

      // Fallback icons jika API Iconify gagal
      setSearchResults([
        "mdi:certificate",
        "mdi:cash",
        "mdi:star",
        "mdi:account-group",
        "mdi:food",
        "mdi:tshirt-crew",
      ]);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Menggunakan debounce untuk mencegah terlalu banyak request
    const delaySearch = setTimeout(() => {
      searchIcons(term);
    }, 300);

    return () => clearTimeout(delaySearch);
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Event</h2>
          <button type="button" className="text-white focus:outline-none">
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
            {/* Title field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul event"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
              {!formData.title && (
                <p className="text-xs text-red-500 mt-1">
                  Judul event harus diisi
                </p>
              )}
            </div>

            {/* Event type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipe Event
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="OPEN"
                    checked={formData.type === "OPEN"}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Open (Terbuka)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="LIMITED"
                    checked={formData.type === "LIMITED"}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Limited (Terbatas)
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Open: Siapa saja dapat mendaftar. Limited: Anda dapat mengatur
                pembatasan pendaftar.
              </p>
            </div>

            {/* Categories */}
            <div>
              <label
                htmlFor="categories"
                className="block text-sm font-medium mb-2"
              >
                Kategori <span className="text-red-500">*</span>
              </label>

              {loading.categories ? (
                <div className="w-full px-4 py-2 rounded-lg border bg-gray-100 flex items-center">
                  <span className="text-gray-500">Memuat kategori...</span>
                  <div className="ml-2 w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 w-full p-2 border rounded-lg bg-white">
                  {categories.length === 0 ? (
                    <p className="text-gray-500 p-2">
                      Tidak ada kategori tersedia
                    </p>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                          selectedCategories.some((c) => c.id === category.id)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {category.name}
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedCategories.length === 0 && !loading.categories && (
                <p className="text-xs text-red-500 mt-1">
                  Pilih minimal satu kategori
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="benefits"
                className="block text-sm font-medium mb-2"
              >
                Manfaat <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">(max 4)</span>
              </label>

              {loading.benefits ? (
                <div className="w-full px-4 py-2 rounded-lg border bg-gray-100 flex items-center">
                  <span className="text-gray-500">Memuat manfaat...</span>
                  <div className="ml-2 w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex items-center w-full px-4 py-2 rounded-lg border bg-white">
                  <div className="flex flex-wrap gap-2 flex-1">
                    {selectedBenefits.length > 0 ? (
                      selectedBenefits.map((benefit) => (
                        <span
                          key={benefit.id}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                        >
                          <Icon
                            icon={benefit.icon || getBenefitIcon(benefit.name)}
                            className="text-lg"
                          />
                          {benefit.name}
                          <button
                            type="button"
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
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <Icon icon="mdi:plus-circle" className="text-2xl" />
                  </button>
                </div>
              )}

              {selectedBenefits.length === 0 && !loading.benefits && (
                <p className="text-xs text-red-500 mt-1">
                  Pilih minimal satu manfaat
                </p>
              )}

              {notification && (
                <p className="text-red-500 text-sm mt-2">{notification}</p>
              )}

              <div className="mt-2 text-xs text-gray-500">
                Manfaat yang dipilih: {selectedBenefits.length}/4
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Jelaskan secara detail tentang event Anda"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              ></textarea>
              {!formData.description && (
                <p className="text-xs text-red-500 mt-1">
                  Deskripsi event harus diisi
                </p>
              )}
            </div>

            {/* URL Event */}
            <div>
              <label
                htmlFor="urlEvent"
                className="block text-sm font-medium mb-2"
              >
                URL Event
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                  volunteerin.id/event/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1 w-full px-4 py-2 rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                  placeholder="nama_event"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL akan otomatis dibuat dari judul event, namun dapat diubah
                secara manual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk Benefit Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Pilih Manfaat
            </h3>
            <div className="space-y-2">
              {benefits.map((benefit) => (
                <label
                  key={benefit.id}
                  className="flex items-center space-x-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedBenefits.some((b) => b.id === benefit.id)}
                    onChange={() => toggleBenefit(benefit)}
                    disabled={
                      selectedBenefits.length >= 4 &&
                      !selectedBenefits.some((b) => b.id === benefit.id)
                    }
                    className="accent-blue-500"
                  />
                  <Icon
                    icon={benefit.icon || getBenefitIcon(benefit.name)}
                    className="text-xl text-blue-500"
                  />
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
                  placeholder="Cari ikon (contoh: certificate, money, food)..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {searchResults.map((icon, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg text-center cursor-pointer hover:bg-gray-200 ${
                          selectedIcon === icon
                            ? "bg-blue-100 border-2 border-blue-500"
                            : "bg-gray-100"
                        }`}
                        onClick={() => setSelectedIcon(icon)}
                      >
                        <Icon icon={icon} className="w-6 h-6 mx-auto" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleCreateBenefit}
                disabled={
                  !customBenefit ||
                  !selectedIcon ||
                  selectedBenefits.length >= 4
                }
                className={`mt-2 w-full text-white py-2 rounded-lg transition-colors duration-300 ${
                  customBenefit && selectedIcon && selectedBenefits.length < 4
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Tambahkan
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
});

export default EventForm;
