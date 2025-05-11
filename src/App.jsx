import { Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/users/RegisterPage";
import LoginPageLanding from "./pages/users/LoginPageLanding";
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
import Layout from "./pages/partners/Layout";
import EventDashboard from "./pages/partners/CreateEvent";
import FormRegisterUser from "./pages/users/FormRegisterUser";

function App() {
  return (
    <ThemeProvider storageKey="theme">
      <Routes>
        {/* dashboard partner route */}
        <Route path="/partner/dashboard" element={<Layout />} />
        <Route path="/partner/dashboard/analytics" element={<Layout />} />
        <Route path="/partner/dashboard/buat-event" element={<Layout />} />
        <Route path="/partner/dashboard/create-event" element={<Layout />} />
        <Route path="/partner/dashboard/create-formulir" element={<Layout />} />
        <Route path="/partner/dashboard/pendaftar" element={<Layout />} />
        <Route path="/partner/dashboard/pencairan-dana" element={<Layout />} />
        <Route path="/partner/dashboard/profile-partner" element={<Layout />} />
        <Route
          path="/partner/dashboard/penanggung-jawab"
          element={<Layout />}
        />
        <Route path="/partner/dashboard/legalitas" element={<Layout />} />
        <Route path="/partner/dashboard/media-sosial" element={<Layout />} />
        <Route path="/partner/dashboard/faq" element={<Layout />} />
        <Route path="/partner/dashboard/cs-partner" element={<Layout />} />
        <Route path="/partner/dashboard/panduan" element={<Layout />} />

        {/* user route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login-landing" element={<LoginPageLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/profile-user" element={<ProfileUser />} />
        <Route path="/save-event" element={<SaveEvent />} />
        <Route path="/regis-event" element={<RegisteredEvent />} />
        <Route path="/notification" element={<NotificationUser />} />
        <Route path="/auth" element={<VolunteerinAuth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-pw" element={<ResetPassword />} />
        <Route path="/layanan" element={<Service />} />

        {/* partner route */}
        <Route path="/login-partner" element={<LoginPartner />} />
        <Route path="/register-partner" element={<RegisterPartner />} />
        <Route path="/form-register" element={<FormRegisterUser />} />

        {/* admin route */}

        {/* Not found route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
