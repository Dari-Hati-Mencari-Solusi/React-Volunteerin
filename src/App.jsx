import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
// import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/users/RegisterPage";
import LoginPageLanding from "./pages/users/LoginPageLanding";
import Login from "./pages/users/Login";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import EventPage from "./pages/events/EventPage";
import EventDetail from "./pages/events/EventDetail";
import ProfileUser from "./pages/users/ProfileUser";


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login-landing" element={<LoginPageLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/event-detail" element={<EventDetail />} />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
