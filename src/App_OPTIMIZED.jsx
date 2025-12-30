import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, lazy, Suspense } from "react";
import "./App.css";

// ============================================
// CRITICAL PAGES - IMMEDIATE LOAD (NO LAZY)
// ============================================
// Halaman ini sering dikunjungi dan penting untuk FCP/LCP
import LandingPage from "./pages/LandingPage";
import Login from "./pages/users/Login";
import NotFoundPage from "./pages/NotFoundPage";
import VolunteerinAuth from "./components/Fragments/VolunteerinAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// ============================================
// LAZY LOAD - NON-CRITICAL PAGES
// ============================================
// Halaman ini di-lazy load untuk reduce initial bundle

// User pages (tidak critical untuk first load)
const RegisterPage = lazy(() => import("./pages/users/RegisterPage"));
const RegisterPartner = lazy(() => import("./pages/partners/RegisterPartner"));
const FormRegisterUser = lazy(() => import("./pages/users/FormRegisterUser"));
const ProfileUser = lazy(() => import("./pages/users/ProfileUser"));
const NotificationUser = lazy(() => import("./pages/users/NotificationUser"));

// Event pages
const EventPage = lazy(() => import("./pages/events/EventPage"));
const SaveEvent = lazy(() => import("./pages/events/SaveEvent"));
const RegisteredEvent = lazy(() => import("./pages/events/RegisteredEvent"));

// Service & Gamification
const Service = lazy(() => import("./pages/Service"));
const Gamification = lazy(() => import("./components/Fragments/Gamification"));

// Partner pages (heavy - definitely lazy)
const LoginPartner = lazy(() => import("./pages/partners/LoginPartner"));
const LayoutPartner = lazy(() => import("./pages/partners/Layout"));

// Admin pages (tidak dioptimasi - lazy load juga)
const LayoutAdmin = lazy(() => import("./pages/admin/LayoutAdmin"));
const LoginPageAdmin = lazy(() => import("./pages/admin/LoginPageAdmin"));

import { ThemeProvider } from "./context/ThemeContext";
import ReactGA from "react-ga4";

// ============================================
// OPTIMASI CLS: Skeleton dengan Fixed Dimensions
// ============================================
const LoadingFallback = () => (
  <div className="flex items-center justify-center" style={{ height: '100vh', width: '100vw' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3E54]"></div>
      <p className="text-sm text-gray-600">Memuat halaman...</p>
    </div>
  </div>
);

// ============================================
// OPTIMASI CLS: Page-specific Skeletons
// ============================================
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6" style={{ height: '100vh' }}>
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
      
      {/* Chart skeleton */}
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
  </div>
);

const EventPageSkeleton = () => (
  <div className="min-h-screen bg-white">
    {/* Navbar height */}
    <div className="h-16 bg-gray-100"></div>
    
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8 space-y-4">
          {/* Banner - Fixed aspect ratio 16:9 */}
          <div className="w-full bg-gray-200 animate-pulse rounded-lg" style={{ aspectRatio: '16/9' }}></div>
          
          {/* Title */}
          <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          
          {/* Info */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    // ============================================
    // OPTIMASI TBT: Defer GA tracking
    // ============================================
    // Use requestIdleCallback untuk tracking tidak block main thread
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        ReactGA.send({
          hitType: "pageview",
          title: document.title,
        });
      });
    } else {
      // Fallback untuk browser yang tidak support requestIdleCallback
      setTimeout(() => {
        ReactGA.send({
          hitType: "pageview",
          title: document.title,
        });
      }, 100);
    }
  }, [location]);

  return (
    <ThemeProvider storageKey="theme">
      <Routes>
        {/* ============================================ */}
        {/* ADMIN ROUTES - LAZY LOAD */}
        {/* ============================================ */}
        <Route 
          path="/admin/dashboard" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutAdmin />
            </Suspense>
          } 
        />
        <Route 
          path="/admin/data-user" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutAdmin />
            </Suspense>
          } 
        />
        <Route 
          path="/admin/data-partner" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutAdmin />
            </Suspense>
          } 
        />
        <Route 
          path="/login-admin" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LoginPageAdmin />
            </Suspense>
          } 
        />

        {/* ============================================ */}
        {/* PARTNER DASHBOARD - LAZY LOAD with Smart Skeleton */}
        {/* ============================================ */}
        <Route 
          path="/partner/dashboard" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/analytics" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/buat-event" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/create-event" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/create-formulir" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/pendaftar" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/pencairan-dana" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/profile-partner" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/penanggung-jawab" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/legalitas" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/media-sosial" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/faq" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/cs-partner" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/panduan" 
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <LayoutPartner />
            </Suspense>
          } 
        />

        {/* ============================================ */}
        {/* CRITICAL USER ROUTES - IMMEDIATE LOAD */}
        {/* ============================================ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<VolunteerinAuth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-pw" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* ============================================ */}
        {/* NON-CRITICAL USER ROUTES - LAZY LOAD */}
        {/* ============================================ */}
        <Route 
          path="/register" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RegisterPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/event/:id" 
          element={
            <Suspense fallback={<EventPageSkeleton />}>
              <EventPage />
            </Suspense>
          } 
        />

        <Route 
          path="/events/:eventId/register-user" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FormRegisterUser />
            </Suspense>
          } 
        />
        
        <Route 
          path="/profile-user" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProfileUser />
            </Suspense>
          } 
        />
        
        <Route 
          path="/save-event" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SaveEvent />
            </Suspense>
          } 
        />
        
        <Route 
          path="/regis-event" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RegisteredEvent />
            </Suspense>
          } 
        />
        
        <Route 
          path="/notification" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotificationUser />
            </Suspense>
          } 
        />
        
        <Route 
          path="/layanan" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Service />
            </Suspense>
          } 
        />
        
        <Route 
          path="/misi-kamu" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Gamification />
            </Suspense>
          } 
        />

        {/* ============================================ */}
        {/* PARTNER AUTH - LAZY LOAD */}
        {/* ============================================ */}
        <Route 
          path="/login-partner" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LoginPartner />
            </Suspense>
          } 
        />
        
        <Route 
          path="/register-partner" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RegisterPartner />
            </Suspense>
          } 
        />

        {/* ============================================ */}
        {/* 404 - IMMEDIATE LOAD */}
        {/* ============================================ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
