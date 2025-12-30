import React from 'react';

/**
 * Skeleton untuk halaman Event Detail
 * Pattern sederhana seperti di LandingPage
 */
const EventDetailSkeleton = () => {
  return (
    <div className="w-full lg:w-8/12 space-y-4">
      {/* Banner Skeleton */}
      <div className="w-full h-72 bg-gray-200 animate-pulse rounded-t-[12px]"></div>

      {/* Event Info Card Skeleton */}
      <div className="bg-[#FBFBFB] border border-gray-200 rounded-b-xl p-6 space-y-4">
        {/* Title & Quota */}
        <div className="flex justify-between items-start gap-4">
          <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-full"></div>
        </div>

        {/* Date */}
        <div className="h-5 w-2/3 bg-gray-200 animate-pulse rounded"></div>

        {/* Categories */}
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="h-8 w-28 bg-gray-200 animate-pulse rounded-full"></div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-5 w-1/2 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Deskripsi Kegiatan Skeleton */}
      <div className="bg-[#FBFBFB] border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-[1px] bg-gray-200 w-full"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
