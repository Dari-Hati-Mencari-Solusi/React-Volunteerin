import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/users/RegisterPage";
import LoginPageLanding from "./pages/users/LoginPageLanding";
import Login from "./pages/users/Login";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login-landing" element={<LoginPageLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
