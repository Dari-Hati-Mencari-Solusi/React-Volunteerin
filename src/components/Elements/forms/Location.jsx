import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const Location = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
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

  // Create debounced version of onUpdate that doesn't change on re-render
  const debouncedUpdate = useRef(
    debounce((data) => {
      if (onUpdate) {
        onUpdate(data);
      }
    }, 500)
  ).current;

  // Make methods available to parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = [];
      if (!selectedProvince) errors.push("Provinsi harus dipilih");
      if (!selectedCity) errors.push("Kota/kabupaten harus dipilih");
      return errors;
    },
    validateForPublish: () => {
      const errors = [];
      if (!selectedProvince) errors.push("Provinsi harus dipilih untuk publikasi");
      if (!selectedCity) errors.push("Kota/kabupaten harus dipilih untuk publikasi");
      if (!address || address.trim().length < 10) errors.push("Alamat detail minimal 10 karakter untuk publikasi");
      if (!latitude || !longitude) errors.push("Koordinat lokasi (latitude & longitude) wajib diisi untuk publikasi");
      return errors;
    },
    getData: () => {
      const validatedData = {
        province: selectedProvince || "",
        regency: selectedCity || "",
        address: address || "",
        gmaps: googleMapsUrl || "",
        latitude: latitude ? String(latitude).trim() : "",
        longitude: longitude ? String(longitude).trim() : ""
      };
      
      console.log("Location.getData() returning:", validatedData);
      return validatedData;
    }
  }));

  // Update parent component when data changes
  useEffect(() => {
    const data = {
      province: selectedProvince || "",
      regency: selectedCity || "",
      address: address || "",
      gmaps: googleMapsUrl || "",
      latitude: latitude || "",
      longitude: longitude || ""
    };
    
    console.log("Location data yang akan diupdate:", data);
    debouncedUpdate(data);
    
  }, [selectedProvince, selectedCity, address, googleMapsUrl, latitude, longitude, debouncedUpdate]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  // Extract coordinates from Google Maps URL
  useEffect(() => {
    if (googleMapsUrl) {
      try {
        let matches = googleMapsUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        
        if (!matches) {
          matches = googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        }
        
        if (matches && matches.length === 3) {
          const lat = matches[1];
          const lng = matches[2];
          console.log(`Extracted coordinates from URL: ${lat}, ${lng}`);
          setLatitude(lat);
          setLongitude(lng);
        } else {
          console.log("Could not extract coordinates from URL:", googleMapsUrl);
        }
      } catch (error) {
        console.error("Error processing Google Maps URL:", error);
      }
    }
  }, [googleMapsUrl]);

  // Fetch provinces on mount
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
        setProvinces([
          { id: "11", nama: "ACEH" },
          { id: "12", nama: "SUMATERA UTARA" },
          { id: "13", nama: "SUMATERA BARAT" },
          { id: "14", nama: "RIAU" },
          { id: "31", nama: "DKI JAKARTA" },
          { id: "32", nama: "JAWA BARAT" },
          { id: "33", nama: "JAWA TENGAH" },
          { id: "34", nama: "DAERAH ISTIMEWA YOGYAKARTA" },
          { id: "35", nama: "JAWA TIMUR" },
          { id: "36", nama: "BANTEN" }
        ]);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedProvince) return;
      setLoading((prev) => ({ ...prev, cities: true }));
      setCities([]);
      
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
        if (selectedProvince === "DKI JAKARTA") {
          setCities([
            { id: "3171", nama: "KOTA JAKARTA PUSAT" },
            { id: "3172", nama: "KOTA JAKARTA UTARA" },
            { id: "3173", nama: "KOTA JAKARTA BARAT" },
            { id: "3174", nama: "KOTA JAKARTA SELATAN" },
            { id: "3175", nama: "KOTA JAKARTA TIMUR" }
          ]);
        } else if (selectedProvince === "JAWA BARAT") {
          setCities([
            { id: "3201", nama: "KAB. BOGOR" },
            { id: "3202", nama: "KAB. SUKABUMI" },
            { id: "3273", nama: "KOTA BANDUNG" },
            { id: "3274", nama: "KOTA CIREBON" }
          ]);
        } else if (selectedProvince === "DAERAH ISTIMEWA YOGYAKARTA") {
          setCities([
            { id: "3401", nama: "KAB. KULON PROGO" },
            { id: "3402", nama: "KAB. BANTUL" },
            { id: "3403", nama: "KAB. GUNUNG KIDUL" },
            { id: "3404", nama: "KAB. SLEMAN" },
            { id: "3471", nama: "KOTA YOGYAKARTA" }
          ]);
        } else {
          setCities([
            { id: "9999", nama: "KOTA/KABUPATEN" }
          ]);
        }
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [selectedProvince, provinces]);

  // Close dropdowns when clicking outside
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
          <button type="button" className="text-white focus:outline-none">
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-3xl"
            />
          </button>
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden transition-all duration-300 w-full rounded-b-xl ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Province Selection */}
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
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white cursor-pointer ${
                    !selectedProvince ? "border-red-300" : ""
                  }`}
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
                          setSelectedCity("");
                          setSearchCity("");
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
              
              {!selectedProvince && (
                <p className="text-red-500 text-xs mt-1">
                  Provinsi harus dipilih
                </p>
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
                  } ${
                    selectedProvince && !selectedCity ? "border-red-300" : ""
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
              
              {selectedProvince && !selectedCity && (
                <p className="text-red-500 text-xs mt-1">
                  Kota/kabupaten harus dipilih
                </p>
              )}
            </div>

            {/* Address Detail - Updated with Required for Publish */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Alamat Detail <span className="text-red-500">* (Wajib untuk Publish)</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan detail alamat event (wajib untuk publikasi)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                  !address || address.length < 10 ? "border-red-300" : ""
                }`}
              />
              {(!address || address.length < 10) && (
                <p className="text-xs text-red-500 mt-1">
                  Alamat detail minimal 10 karakter wajib diisi untuk publikasi event
                </p>
              )}
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                URL Google Maps <span className="text-orange-500">(Opsional tapi disarankan)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: https://maps.google.com/?q=-6.914744,107.609810"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Koordinat akan otomatis diekstrak dari URL Google Maps
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setLatitude("-6.200000");
                  setLongitude("106.816666");
                  setGoogleMapsUrl("https://maps.google.com/?q=-6.200000,106.816666");
                }}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                Gunakan Koordinat Jakarta
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const lat = position.coords.latitude.toFixed(6);
                        const lng = position.coords.longitude.toFixed(6);
                        setLatitude(lat);
                        setLongitude(lng);
                        setGoogleMapsUrl(`https://maps.google.com/?q=${lat},${lng}`);
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                        alert("Tidak dapat mengakses lokasi Anda. Pastikan Anda mengizinkan akses lokasi.");
                      }
                    );
                  } else {
                    alert("Geolocation tidak didukung oleh browser Anda.");
                  }
                }}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
              >
                Gunakan Lokasi Saat Ini
              </button>
            </div>

            {/* Coordinates - Updated with Required for Publish */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitude <span className="text-red-500">* (Wajib untuk Publish)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: -6.914744"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !latitude ? "border-red-300" : ""
                  }`}
                />
                {!latitude && (
                  <p className="text-xs text-red-500 mt-1">
                    Latitude wajib diisi untuk publikasi
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitude <span className="text-red-500">* (Wajib untuk Publish)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 107.609810"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !longitude ? "border-red-300" : ""
                  }`}
                />
                {!longitude && (
                  <p className="text-xs text-red-500 mt-1">
                    Longitude wajib diisi untuk publikasi
                  </p>
                )}
              </div>
            </div>

            {/* Coordinates Status Indicator */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status Koordinat untuk Publikasi:</h4>
              <div className="flex items-center space-x-4 text-sm">
                <div className={`flex items-center ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={latitude && longitude ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {latitude && longitude ? "Koordinat lengkap" : "Koordinat belum lengkap"}
                </div>
                <div className={`flex items-center ${address && address.length >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={address && address.length >= 10 ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {address && address.length >= 10 ? "Alamat detail lengkap" : "Alamat detail kurang"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Location.displayName = "Location";

export default Location;