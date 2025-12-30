import React from 'react';

/**
 * Skeleton untuk Sidebar (Manfaat & Kriteria)
 * Pattern sederhana seperti di LandingPage
 */
const SidebarSkeleton = () => {
  return (
    <div className="w-full lg:w-4/12 space-y-4">
      {/* Manfaat Event Skeleton */}
      <div>
        <div className="bg-[#0A3E54] text-white py-3 rounded-t-xl">
          <div className="h-6 w-32 bg-gray-600 animate-pulse rounded mx-6"></div>
        </div>
        <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-6 rounded-b-xl">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Kriteria Skeleton */}
      <div>
        <div className="bg-[#0A3E54] text-white py-3 rounded-t-xl">
          <div className="h-6 w-24 bg-gray-600 animate-pulse rounded mx-6"></div>
        </div>
        <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 rounded-b-lg p-6 space-y-3">
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
  );
};

export default SidebarSkeleton;
