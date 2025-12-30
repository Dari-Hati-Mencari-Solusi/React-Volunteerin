import React from 'react';

/**
 * ============================================
 * OPTIMASI CLS: Skeleton dengan Fixed Dimensions
 * ============================================
 * 
 * Skeleton untuk halaman Event Detail
 * Semua elemen memiliki ukuran tetap untuk prevent layout shift
 */
const EventDetailSkeleton = () => {
  return (
    <div className="w-full lg:w-8/12 space-y-4">
      {/* ============================================ */}
      {/* OPTIMASI CLS: Banner dengan Aspect Ratio Tetap */}
      {/* ============================================ */}
      <div 
        className="w-full bg-gray-200 animate-pulse rounded-t-[12px]"
        style={{
          aspectRatio: '16/9',
          height: 'auto'
        }}
      ></div>

      {/* ============================================ */}
      {/* Event Info Card Skeleton dengan Fixed Heights */}
      {/* ============================================ */}
      <div className="bg-[#FBFBFB] border border-gray-200 rounded-b-xl p-6 space-y-4">
        {/* Title & Quota - Fixed heights */}
        <div className="flex justify-between items-start gap-4">
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '32px', width: '75%' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded-full"
            style={{ height: '48px', width: '128px' }}
          ></div>
        </div>

        {/* Date - Fixed height */}
        <div 
          className="bg-gray-200 animate-pulse rounded"
          style={{ height: '20px', width: '66%' }}
        ></div>

        {/* Categories - Fixed heights */}
        <div className="flex gap-2">
          <div 
            className="bg-gray-200 animate-pulse rounded-full"
            style={{ height: '32px', width: '96px' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded-full"
            style={{ height: '32px', width: '112px' }}
          ></div>
        </div>

        {/* Location - Fixed height */}
        <div className="flex items-center gap-2">
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ width: '48px', height: '48px' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '20px', width: '50%' }}
          ></div>
        </div>

        {/* Organizer - Fixed heights */}
        <div className="flex items-center gap-4">
          <div 
            className="bg-gray-200 animate-pulse rounded-full"
            style={{ width: '48px', height: '48px' }}
          ></div>
          <div className="space-y-2 flex-1">
            <div 
              className="bg-gray-200 animate-pulse rounded"
              style={{ height: '16px', width: '128px' }}
            ></div>
            <div 
              className="bg-gray-200 animate-pulse rounded"
              style={{ height: '20px', width: '160px' }}
            ></div>
          </div>
        </div>

        {/* Description - Fixed heights */}
        <div className="space-y-2">
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '20px', width: '192px' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '100%' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '100%' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '75%' }}
          ></div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Deskripsi Kegiatan Skeleton - Fixed Heights */}
      {/* ============================================ */}
      <div className="bg-[#FBFBFB] border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ width: '28px', height: '28px' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '24px', width: '192px' }}
          ></div>
        </div>
        <div 
          className="bg-gray-200 w-full"
          style={{ height: '1px' }}
        ></div>
        <div className="space-y-3">
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '100%' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '83%' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '100%' }}
          ></div>
          <div 
            className="bg-gray-200 animate-pulse rounded"
            style={{ height: '16px', width: '67%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
