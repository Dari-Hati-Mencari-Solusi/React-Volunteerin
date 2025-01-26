import React from "react";
import { Link } from "react-router-dom";

const BtnSignUp = () => {
  return (
    <Link
      to="/register"
      className="bg-[#F0EFF2] hover:bg-white text-[#A1A1A1] hover:text-black font-semibold text-md rounded-[12px] h-[50px] w-full md:w-[189px] text-center flex justify-center items-center transition duration-300"
    >
      <h1>Daftar</h1>
    </Link>
  );
};

export default BtnSignUp;
