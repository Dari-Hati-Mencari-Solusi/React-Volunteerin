import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const BtnDaftarVolunteer = ({ eventId }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      // Save the current event URL as return URL to redirect back after login
      localStorage.setItem("returnUrl", `/event/${eventId}`);
      
      // Redirect to auth page
      navigate("/auth", { 
        state: { 
          message: "Silakan login untuk mendaftar sebagai volunteer",
          returnUrl: `/event/${eventId}`
        } 
      });
    } else {
      // If user is authenticated, proceed to the registration form
      navigate("/form-register");
    }
  };

  return (
    <button 
      className="bg-[#1FB918] hover:bg-[#1FB918]/80 rounded-[12px] text-white font-medium w-full h-[48px] text-center transition-colors duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleClick}
    >
      <h1 className="text-sm md:text-xl">Daftar Volunteer</h1>
    </button>
  );
};

export default BtnDaftarVolunteer;