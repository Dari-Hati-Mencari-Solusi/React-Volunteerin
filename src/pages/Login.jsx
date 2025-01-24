import React from "react";
import logo from "../assets/images/Logo-Volunteerin.jpg";
import FormLogin from "../components/Fragments/FormLogin";
import BtnNext from "../components/buttons/BtnNext";
import BannerLogin from "../assets/images/Banner-Login.png";

const Login = () => {
  return (
    <section className="h-screen flex justify-between flex-row lg:flex-row">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-4 lg:p-8 md:space-y-7 md:content-between">
        <div className="mx-auto flex items-center text-center">
          <img src={logo} alt="Volunteerin" className="w-[50px] h-[42px]" />
          <h1 className="text-xl font-bold text-[#0A3E54]">Volunteerin.</h1>
        </div>
        <div className="flex flex-col justify-center p-4 lg:p-8 space-y-4">
          <div className="mx-auto w-full max-w-md">
            <FormLogin />
          </div>
          <div className="mx-auto w-full max-w-md">
            <BtnNext />
          </div>
        </div>
        <h1 className="text-[16px] text-center font-semibold text-[#BCBCBC]">
          Bergabunglah dengan ribuan orang yang mempercayai Volunteerin untuk
          menemukan peluang volunteer. Daftar sekarang, temukan event menarik,
          dan buat perubahan nyata.
        </h1>
      </div>
      <div className="w-1/2 h-full bg-gradient-to-b from-[#D1F8FF] to-[#22D0EE] hidden lg:flex justify-center items-center">
        <img src={BannerLogin} alt="" />
      </div>
    </section>
  );
};

export default Login;
