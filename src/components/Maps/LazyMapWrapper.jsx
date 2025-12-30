import React, { Suspense, lazy } from 'react';
import { useInView } from '../../hooks/useInView';
import MapSkeleton from '../Skeleton/MapSkeleton';

/**
 * Lazy load komponen peta
 * Hanya dimuat saat user scroll ke section ini (interaction-based loading)
 */
const MapComponent = lazy(() => 
  import('./MapComponent').then(module => ({
    default: module.default
  }))
);

/**
 * Wrapper untuk lazy loading Map component
 * Menggunakan Intersection Observer untuk trigger loading
 * 
 * Props:
 * @param {string} address - Alamat lengkap event
 * @param {number} latitude - Koordinat latitude
 * @param {number} longitude - Koordinat longitude
 * @param {string} eventName - Nama event
 */
const LazyMapWrapper = ({ address, latitude, longitude, eventName }) => {
  const { elementRef, hasBeenInView } = useInView({
    threshold: 0.1, // Trigger ketika 10% elemen terlihat
    rootMargin: '150px', // Mulai load 150px sebelum terlihat di viewport
  });

  return (
    <div ref={elementRef} className="w-full min-h-[500px]">
      {hasBeenInView ? (
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
  );
};

export default LazyMapWrapper;
