import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, lazy, Suspense } from "react";
import "./App.css";

// == Static imports untuk halaman critical ==
import RegisterPage from "./pages/users/RegisterPage";
import Login from "./pages/users/Login";
import NotFoundPage from "./pages/NotFoundPage";
import SaveEvent from "./pages/events/SaveEvent";
import RegisteredEvent from "./pages/events/RegisteredEvent";
import ProfileUser from "./pages/users/ProfileUser";
import NotificationUser from "./pages/users/NotificationUser";
import LoginPartner from "./pages/partners/LoginPartner";
import RegisterPartner from "./pages/partners/RegisterPartner";
import VolunteerinAuth from "./components/Fragments/VolunteerinAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Service from "./pages/Service";
import { ThemeProvider } from "./context/ThemeContext";
import FormRegisterUser from "./pages/users/FormRegisterUser";
import Gamification from "./components/Fragments/Gamification";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import LoginPageAdmin from "./pages/admin/LoginPageAdmin";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ReactGA from "react-ga4";

// == IMPLEMENTASI ROUTE-BASED CODE SPLITTING ==
const LandingPage = lazy(() => import("./pages/LandingPage"));
const EventPage = lazy(() => import("./pages/events/EventPage"));
const LayoutPartner = lazy(() => import("./pages/partners/Layout"));

// == Minimal Loading Fallback for better perceived performance ==
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3E54]"></div>
      <p className="text-sm text-gray-600">Loading....</p>
    </div>
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      title: document.title,
    });
  }, [location]);

  return (
    <ThemeProvider storageKey="theme">
      <Routes>
        {/* == ADMIN ROUTE (TIDAK DIOPTIMASI) == */}
        <Route path="/admin/dashboard" element={<LayoutAdmin />} />
        <Route path="/admin/data-user" element={<LayoutAdmin />} />
        <Route path="/admin/data-partner" element={<LayoutAdmin />} />
        <Route path="/login-admin" element={<LoginPageAdmin />} />

        {/* == LANDING PAGE (LAZY LOAD) == */}
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LandingPage />
            </Suspense>
          } 
        />

        {/* == EVENT PAGE (LAZY LOAD) == */}
        <Route 
          path="/event/:id" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EventPage />
            </Suspense>
          } 
        />

        {/* == PARTNER DASHBOARD ROUTES (LAZY LOAD) == */}
        <Route 
          path="/partner/dashboard" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/analytics" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/buat-event" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/create-event" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/create-formulir" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/pendaftar" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/pencairan-dana" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/profile-partner" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/penanggung-jawab" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/legalitas" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/media-sosial" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/faq" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/cs-partner" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />
        <Route 
          path="/partner/dashboard/panduan" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LayoutPartner />
            </Suspense>
          } 
        />

        {/* == USER ROUTES (STATIC IMPORT) == */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events/:eventId/register-user" element={<FormRegisterUser />} />
        <Route path="/profile-user" element={<ProfileUser />} />
        <Route path="/save-event" element={<SaveEvent />} />
        <Route path="/regis-event" element={<RegisteredEvent />} />
        <Route path="/notification" element={<NotificationUser />} />
        <Route path="/auth" element={<VolunteerinAuth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-pw" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/layanan" element={<Service />} />
        <Route path="/misi-kamu" element={<Gamification />} />

        {/* == PARTNER AUTH (STATIC IMPORT) == */}
        <Route path="/login-partner" element={<LoginPartner />} />
        <Route path="/register-partner" element={<RegisterPartner />} />

        {/* == 404 PAGE == */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;