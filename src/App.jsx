import { Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/users/RegisterPage";
import Login from "./pages/users/Login";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import EventPage from "./pages/events/EventPage";
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
import LayoutPartner from "./pages/partners/Layout";
import FormRegisterUser from "./pages/users/FormRegisterUser";
import Gamification from "./components/Fragments/Gamification";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import LoginPageAdmin from "./pages/admin/LoginPageAdmin";
import FormPendaftaran from "./pages/users/FormRegisterUser";
import VerifyEmailPage from "./pages/VerifyEmailPage";
// import EventDashboard from "./pages/partners/CreateEvent";

function App() {
  return (
    <ThemeProvider storageKey="theme">
      <Routes>
        {/* admin route */}
        <Route path="/admin/dashboard" element={<LayoutAdmin />} />
        <Route path="/admin/data-user" element={<LayoutAdmin />} />
        <Route path="/admin/data-partner" element={<LayoutAdmin />} />
        <Route path="/login-admin" element={<LoginPageAdmin />} />

        {/* dashboard partner route */}
        <Route path="/partner/dashboard" element={<LayoutPartner />} />
        <Route
          path="/partner/dashboard/analytics"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/buat-event"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/create-event"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/create-formulir"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/pendaftar"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/pencairan-dana"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/profile-partner"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/penanggung-jawab"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/legalitas"
          element={<LayoutPartner />}
        />
        <Route
          path="/partner/dashboard/media-sosial"
          element={<LayoutPartner />}
        />
        <Route path="/partner/dashboard/faq" element={<LayoutPartner />} />
        <Route
          path="/partner/dashboard/cs-partner"
          element={<LayoutPartner />}
        />
        <Route path="/partner/dashboard/panduan" element={<LayoutPartner />} />

        {/* user route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventPage />} />
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

        {/* partner route */}
        <Route path="/login-partner" element={<LoginPartner />} />
        <Route path="/register-partner" element={<RegisterPartner />} />

        {/* Not found route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
