import React from 'react';

/**
 * Skeleton UI untuk Chart Component
 * Pattern sederhana dengan tinggi sama dengan chart final
 */
const ChartSkeleton = () => {
  return (
    <div className="card">
      <div className="card-header mb-4">
        <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="card-body p-0">
        {/* Chart area - tinggi sama dengan ResponsiveContainer (300px) */}
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">Memuat grafik...</div>
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
