import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const Location = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ provinces: false, cities: false });
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const provinceRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const response = await fetch(
          "https://ibnux.github.io/data-indonesia/provinsi.json"
        );
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedProvince) return;
      setLoading((prev) => ({ ...prev, cities: true }));
      try {
        const province = provinces.find((p) => p.nama === selectedProvince);
        if (!province) return;

        const response = await fetch(
          `https://ibnux.github.io/data-indonesia/kabupaten/${province.id}.json`
        );
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [selectedProvince, provinces]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (provinceRef.current && !provinceRef.current.contains(event.target)) {
        setIsProvinceDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProvinces = provinces.filter((province) =>
    province.nama.toLowerCase().includes(searchProvince.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.nama.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Lokasi</h2>
          <Icon
            icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="text-3xl"
          />
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden transition-all duration-300 w-full rounded-b-xl ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
            <div ref={provinceRef} className="relative">
              <label className="block text-sm font-medium mb-2">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={loading.provinces ? "Memuat data provinsi..." : "Pilih provinsi"}
                  value={searchProvince || selectedProvince}
                  onChange={(e) => {
                    setSearchProvince(e.target.value);
                    setSelectedProvince("");
                    setIsProvinceDropdownOpen(true);
                  }}
                  onFocus={() => setIsProvinceDropdownOpen(true)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white cursor-pointer"
                  disabled={loading.provinces}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                >
                  {loading.provinces ? (
                    <Icon icon="mdi:loading" className="text-gray-400 animate-spin" />
                  ) : (
                    <Icon icon="mdi:chevron-down" className="text-gray-400" />
                  )}
                </div>
              </div>

              {isProvinceDropdownOpen && !loading.provinces && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((province) => (
                      <div
                        key={province.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedProvince(province.nama);
                          setSearchProvince("");
                          setIsProvinceDropdownOpen(false);
                        }}
                      >
                        {province.nama}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">Tidak ada provinsi yang ditemukan</div>
                  )}
                </div>
              )}
            </div>

            {/* City Selection */}
            <div ref={cityRef} className="relative">
              <label className="block text-sm font-medium mb-2">
                Kota/Kabupaten <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    loading.cities
                      ? "Memuat data kota/kabupaten..."
                      : selectedProvince
                      ? "Pilih kota/kabupaten"
                      : "Pilih provinsi terlebih dahulu"
                  }
                  value={searchCity || selectedCity}
                  onChange={(e) => {
                    setSearchCity(e.target.value);
                    setSelectedCity("");
                    setIsCityDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (selectedProvince && !loading.cities) {
                      setIsCityDropdownOpen(true);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !selectedProvince || loading.cities ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={!selectedProvince || loading.cities}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => {
                    if (selectedProvince && !loading.cities) {
                      setIsCityDropdownOpen(!isCityDropdownOpen);
                    }
                  }}
                >
                  {loading.cities ? (
                    <Icon icon="mdi:loading" className="text-gray-400 animate-spin" />
                  ) : (
                    <Icon icon="mdi:chevron-down" className="text-gray-400" />
                  )}
                </div>
              </div>

              {isCityDropdownOpen && selectedProvince && !loading.cities && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <div
                        key={city.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCity(city.nama);
                          setSearchCity("");
                          setIsCityDropdownOpen(false);
                        }}
                      >
                        {city.nama}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">Tidak ada kota/kabupaten yang ditemukan</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL Google Maps <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan detail lokasi event"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;