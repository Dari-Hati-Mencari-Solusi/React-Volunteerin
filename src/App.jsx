import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Profiler, useState } from "react";
import "./App.css";
// import HomePage from "./pages/HomePage";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login-landing" element={<LoginPageLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/profile-user" element={<ProfileUser />} />
        <Route path="/save-event" element={<SaveEvent />} />
        <Route path="/regis-event" element={<RegisteredEvent />} />
        <Route path="/notification" element={<NotificationUser />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
