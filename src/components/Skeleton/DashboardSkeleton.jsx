import React from 'react';

/**
 * Skeleton UI untuk Dashboard Partner
 * Pattern sederhana seperti di LandingPage
 */
const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>

      {/* First row - 2 main cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 w-36 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Second row - 4 mini cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-child">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
