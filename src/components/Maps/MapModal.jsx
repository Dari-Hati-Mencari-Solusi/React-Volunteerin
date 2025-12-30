import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Icon } from '@iconify/react';
import MapSkeleton from '../Skeleton/MapSkeleton';

// Lazy load komponen map
const MapComponent = lazy(() => import('./MapComponent'));

/**
 * Modal Map Component
 * Modal putih bersih yang muncul saat user klik lokasi
 * Map di-lazy load hanya saat modal dibuka
 */
const MapModal = ({ isOpen, onClose, address, latitude, longitude, eventName }) => {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    if (isOpen && !shouldLoadMap) {
      // Trigger lazy load map saat modal dibuka pertama kali
      setShouldLoadMap(true);
    }
  }, [isOpen, shouldLoadMap]);

  useEffect(() => {
    // Prevent body scroll saat modal terbuka
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key untuk close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Blur & Dark */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - Putih Bersih */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header - Putih */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Tutup modal"
            >
              <Icon 
                icon="mdi:close" 
                className="w-6 h-6 text-gray-600" 
              />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {shouldLoadMap ? (
              <Suspense fallback={<MapSkeleton />}>
                <MapComponent
                  address={address}
                  latitude={latitude}
                  longitude={longitude}
                  eventName={eventName}
                />
              </Suspense>
            ) : (
              <MapSkeleton />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-modalSlideUp {
          animation: modalSlideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MapModal;
