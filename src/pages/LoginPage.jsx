import React from "react";
import logo from "../assets/images/Logo-Volunteerin.jpg";
import BtnSignIn from "../components/buttons/BtnSignIn";
import BtnSignUp from "../components/buttons/BtnSignUp";
import FormLogin from "../components/Fragments/FormLogin";
import BtnNext from "../components/buttons/BtnNext";

const LoginPage = () => {
  return (
    <section className="h-screen flex justify-between flex-row lg:flex-row">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-4 lg:p-8 space-y-7 content-between">
        <div className="mx-auto flex items-center text-center">
          <img src={logo} alt="Volunteerin" className="w-[50px] h-[42px]" />
          <h1 className="text-xl font-bold text-[#0A3E54]">Volunteerin.</h1>
        </div>
        <div className="flex flex-col justify-center p-4 lg:p-8 space-y-4">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-center text-4xl font-bold text-[#0A3E54] text-[33px]">
              Selamat Datang Kembali
            </h1>
            <p className="mx-auto mt-4 text-center text-[#BCBCBC] font-medium">
              Halo, Silakan masukkan detail Anda
            </p>
          </div>
          <div className="flex gap-4 align-items-center items-center bg-[#F0EFF2] w-[402px] h-[66px] rounded-[12px] px-4 py-2 mt-8 mx-auto">
            <BtnSignIn />
            <BtnSignUp />
          </div>
          <div className="mx-auto w-full max-w-md">
            <FormLogin />
          </div>
          <div className="mx-auto w-full max-w-md">
            <BtnNext />
          </div>
          <div className="flex items-center my-8 justify-center mx-auto w-full max-w-[380px]">
            <div className="flex-grow border-t border-[1.2px] border-[#A1A1A1]"></div>
            <span className="flex-shrink mx-4 text-[#A1A1A1] font-medium">
              Atau Lanjutkan Dengan
            </span>
            <div className="flex-grow border-t border-[1.2px] border-[#A1A1A1]"></div>
          </div>
        </div>
        <h1 className="text-md text-center font-bold text-[#BCBCBC]">
          Welcome Back, Please enter Your details
        </h1>
      </div>
      <div className="w-1/2 h-full bg-gradient-to-b from-[#D1F8FF] to-[#22D0EE]">
        <img src="" alt="" />
      </div>
    </section>
  );
};

export default LoginPage;
