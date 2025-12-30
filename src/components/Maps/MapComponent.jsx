import React, { useState } from 'react';
import { Icon } from '@iconify/react';

/**
 * Komponen Map menggunakan Google Maps Embed API
 * TANPA library eksternal, TANPA API key
 * 
 * Props:
 * @param {string} address - Alamat lengkap event (data dinamis)
 * @param {number} latitude - Koordinat latitude (data dinamis)
 * @param {number} longitude - Koordinat longitude (data dinamis)
 * @param {string} eventName - Nama event (data dinamis)
 */
const MapComponent = ({ address, latitude, longitude, eventName }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Prioritas: gunakan koordinat jika ada, fallback ke geocoding address
  const mapSrc = latitude && longitude
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const openInGoogleMaps = () => {
    const url = latitude && longitude
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full space-y-4">
      {/* Header dengan tombol petunjuk arah */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon 
            icon="mdi:map-marker" 
            className="w-7 h-7 text-[#0A3E54]" 
          />
          <h2 className="text-xl font-semibold text-[#0A3E54]">
            Lokasi Event
          </h2>
        </div>
        <button
          onClick={openInGoogleMaps}
          className="flex items-center gap-2 bg-[#22D0EE] hover:bg-[#1bb8d4] text-[#0A3E54] px-4 py-2 rounded-lg transition-colors font-medium"
          aria-label="Buka petunjuk arah di Google Maps"
        >
          <Icon icon="mdi:directions" className="w-5 h-5" />
          <span className="hidden sm:inline">Petunjuk Arah</span>
          <span className="sm:hidden">Arah</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md border border-gray-200">
        {/* Loading placeholder saat iframe belum loaded */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-[#0A3E54]"></div>
              <p className="text-sm text-gray-600">Memuat peta...</p>
            </div>
          </div>
        )}
        
        {/* Google Maps Embed iframe */}
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Lokasi ${eventName}`}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full"
        />
      </div>

      {/* Address Info Card */}
      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Icon 
          icon="mdi:map-marker-outline" 
          className="w-6 h-6 text-[#0A3E54] flex-shrink-0 mt-0.5" 
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-900 mb-1">
            Alamat Lengkap
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {address || 'Alamat tidak tersedia'}
          </p>
          {latitude && longitude && (
            <p className="text-xs text-gray-500 mt-2">
              Koordinat: {latitude}, {longitude}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
