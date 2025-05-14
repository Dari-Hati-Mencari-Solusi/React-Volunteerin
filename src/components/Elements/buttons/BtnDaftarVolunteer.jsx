import React from "react";
import { Link } from "react-router-dom";

const BtnDaftarVolunteer = () => {
  return (
    <button className="bg-[#0A3E54] rounded-[12px] text-white font-medium w-full h-[48px] text-center">
      <Link to="/form-register">
        <h1 className="text-sm md:text-xl">Daftar Volunteer</h1>
      </Link>
    </button>
  );
};

export default BtnDaftarVolunteer;
