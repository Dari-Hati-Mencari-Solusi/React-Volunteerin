import React from 'react';

/**
 * Skeleton UI untuk section Deskripsi Kegiatan
 * Pattern sederhana seperti di LandingPage
 */
const DescriptionSkeleton = () => {
  return (
    <div className="bg-[#FBFBFB] border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
      </div>
      
      <div className="h-[1px] bg-gray-200 w-full"></div>

      {/* Content Lines Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

export default DescriptionSkeleton;
