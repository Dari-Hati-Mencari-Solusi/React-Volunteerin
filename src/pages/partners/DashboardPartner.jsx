import React, { lazy, Suspense, useState, useEffect, memo, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../../hooks/UseTheme";
import { overviewData } from "../../constants/index";

// ============================================
// OPTIMASI: Lazy load non-critical components
// ============================================
const Footer = lazy(() => import("../partners/layouts/Footer").then(module => ({ default: module.Footer })));

// Lazy load Recharts - Heavy library, defer until needed
// Use dynamic imports untuk reduce initial bundle size
const LazyAreaChart = lazy(() => 
  Promise.all([
    import("recharts"),
  ]).then(([rechartsModule]) => ({
    default: memo(({ data, title, gradientId, theme }) => {
      const { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } = rechartsModule;
      
      return (
        <div className="card" style={{ minHeight: '370px' }}>
          <div className="card-header">
            <p className="card-title">{title}</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  cursor={false} 
                  formatter={(value) => `$${value}`}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff' }}
                />
                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill={`url(#${gradientId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }),
  }))
);

// ============================================
// OPTIMASI CLS: Lightweight Chart Skeleton with Fixed Dimensions
// ============================================
const ChartSkeleton = memo(() => (
  <div className="card" style={{ minHeight: '370px', willChange: 'contents' }}>
    <div className="card-header">
      <div style={{ height: '24px', width: '200px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
    </div>
    <div className="card-body p-0">
      <div style={{ width: '100%', height: '300px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
        {/* Simple placeholder - no animations to reduce TBT */}
      </div>
    </div>
  </div>
));

ChartSkeleton.displayName = 'ChartSkeleton';

// Chart Component wrapper - Memoized to prevent unnecessary re-renders
const DashboardAreaChart = memo(({ data, title, gradientId, theme }) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyAreaChart data={data} title={title} gradientId={gradientId} theme={theme} />
    </Suspense>
  );
});

DashboardAreaChart.displayName = 'DashboardAreaChart';

const DashboardPartner = () => {
  const { theme } = useTheme();
  const [showCharts, setShowCharts] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  // ============================================
  // OPTIMASI: Progressive loading strategy
  // ============================================
  useEffect(() => {
    // Prioritize above-the-fold content first
    const loadCharts = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setShowCharts(true), { timeout: 2000 });
      } else {
        setTimeout(() => setShowCharts(true), 1000);
      }
    };

    const loadFooter = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setShowFooter(true), { timeout: 3000 });
      } else {
        setTimeout(() => setShowFooter(true), 1500);
      }
    };

    loadCharts();
    loadFooter();
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title text-[#0A3E54]">Dashboard</h1>

      {/* Critical content - render immediately with fixed dimensions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card" style={{ minHeight: '140px' }}>
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon icon="mdi:users" width="32" height="32" />
            </div>
            <p className="card-title">Pendaftar Hari Ini</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              35 Orang
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-[#1BD113]">
              Pendaftar hari ini
              <Icon icon="mdi:trending-up" width="18" height="18" />
            </span>
          </div>
        </div>
        <div className="card" style={{ minHeight: '140px' }}>
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon icon="ph:money-wavy-bold" width="32" height="32" />
            </div>
            <p className="card-title">Pendapatan Hari Ini</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              Rp.160.000,00
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-[#1BD113]">
              Pendapatan hari ini
              <Icon icon="mdi:trending-up" width="18" height="18" />
            </span>
          </div>
        </div>
      </div>

      {/* Below-fold content - dengan fixed dimensions untuk prevent CLS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-child" style={{ minHeight: '130px' }}>
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon icon="tabler:calendar-time" width="24" height="24" />
            </div>
            <p className="title-child">Sisa Waktu</p>
          </div>
          <div className="py-4">
            <p className="subtitle flex items-center flex-wrap">
              <span className="mr-1">25</span>
              <span className="text-sm sm:text-lg text-[#1BD113] px-2">
                Hari lagi
              </span>
            </p>
          </div>
        </div>
        <div className="card-child" style={{ minHeight: '130px' }}>
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon icon="mdi:users" width="24" height="24" />
            </div>
            <p className="title-child">Total Pendaftar</p>
          </div>
          <div className="py-4">
            <p className="subtitle flex items-center flex-wrap">
              <span className="mr-1">25</span>
              <span className="text-sm sm:text-lg text-[#1BD113] px-2">
                Pendaftar
              </span>
            </p>
          </div>
        </div>
        <div className="card-child" style={{ minHeight: '130px' }}>
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon icon="mdi:payment-clock" width="24" height="24" />
            </div>
            <p className="title-child">Belum Bayar</p>
          </div>
          <div className="py-4">
            <p className="subtitle flex items-center flex-wrap">
              <span className="mr-1">25</span>
              <span className="text-sm sm:text-lg text-[#1BD113] px-2">
                Pendaftar
              </span>
            </p>
          </div>
        </div>
        <div className="card-child" style={{ minHeight: '130px' }}>
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon icon="fluent:payment-24-filled" width="24" height="24" />
            </div>
            <p className="title-child">Total Pendapatan</p>
          </div>
          <div className="py-4">
            <p className="subtitle">Rp.2.000.000,00</p>
          </div>
        </div>
      </div>

      {/* Charts - Lazy loaded for better LCP */}
      {showCharts ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            <DashboardAreaChart
              data={overviewData}
              title="Analisis Rentang Waktu Pendaftar"
              gradientId="colorTotal1"
              theme={theme}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <DashboardAreaChart
              data={overviewData}
              title="Analisis Pendapatan Waktu Pendaftar"
              gradientId="colorTotal2"
              theme={theme}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            <ChartSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <ChartSkeleton />
          </div>
        </>
      )}

      {/* Footer - Lazy loaded */}
      {showFooter ? (
        <Suspense fallback={<div style={{ height: '100px' }} className="bg-gray-100 rounded" />}>
          <Footer />
        </Suspense>
      ) : (
        <div style={{ height: '100px' }} className="bg-gray-100 rounded animate-pulse" />
      )}
    </div>
  );
};

export default DashboardPartner;
