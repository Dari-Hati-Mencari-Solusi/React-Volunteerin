import React from 'react';

/**
 * Skeleton UI untuk komponen Map
 * Pattern sederhana seperti di LandingPage
 */
const MapSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-36 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      {/* Map Skeleton */}
      <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>

      {/* Address Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

export default MapSkeleton;
