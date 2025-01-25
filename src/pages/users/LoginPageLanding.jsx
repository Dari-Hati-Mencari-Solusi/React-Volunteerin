import React from "react";
import logo from "../../assets/images/Logo-Volunteerin.jpg";
import BtnSignIn from "../../components/buttons/BtnSignIn";
import BtnSignUp from "../../components/buttons/BtnSignUp";
import { Handshake, Mail } from "lucide-react";
import IconGoogle from "../../assets/images/icon-google.svg";
import BannerLogin from "../../assets/images/Banner-Login.png"; 
import { Link } from "react-router-dom";

const LoginPageLanding = () => {
  return (
    <section className="h-screen flex justify-between flex-row lg:flex-row">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-4 lg:p-8 md:space-y-7 md:content-between">
        <div className="mx-auto flex items-center text-center">
          <img src={logo} alt="Volunteerin" className="w-[50px] h-[42px]" />
          <h1 className="text-xl font-bold text-[#0A3E54]">Volunteerin.</h1>
        </div>
        <div className="flex flex-col justify-center p-4 lg:p-8 space-y-4">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-center md:text-4xl text-2xl font-bold text-black text-[33px]">
              Selamat Datang Kembali
            </h1>
            <p className="mx-auto mt-4 text-center text-[#BCBCBC] font-medium">
              Event Seru, Kesempatan Berarti. Yuk, Volunteerin!
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 bg-[#F0EFF2] rounded-[12px] px-4 py-2 mt-8 mx-auto w-full md:w-[402px] md:flex-row">
            <BtnSignIn />
            <BtnSignUp />
          </div>
          <button className="flex flex-col border-2 boirder-[#A1A1A1] items-center gap-4 rounded-[12px] px-4 py-4 mt-8 mx-auto w-full md:w-[402px] md:flex-row justify-center">
            <img src={IconGoogle} alt="icon google" />
            <h1 className="font-medium">Masuk Dengan Google</h1>
          </button>
          <Link to='/login' className="flex flex-col border-2 boirder-[#A1A1A1] items-center gap-4 rounded-[12px] px-4 py-4 mt-8 mx-auto w-full md:w-[402px] md:flex-row justify-center">
            <Mail className="h-5 w-5 text-black" />
            <h1 className="font-medium">Masuk Dengan Email</h1>
          </Link>
          <div className="flex items-center my-8 justify-center mx-auto w-full max-w-[380px]">
            <div className="flex-grow border-t border-[1.2px] border-[#A1A1A1]"></div>
            <span className="flex-shrink mx-4 text-[#A1A1A1] font-medium">
              Atau Lanjutkan Dengan
            </span>
            <div className="flex-grow border-t border-[1.2px] border-[#A1A1A1]"></div>
          </div>
          <button className="flex flex-col border-2 boirder-[#A1A1A1] items-center gap-4 rounded-[12px] px-4 py-4 mt-8 mx-auto w-full md:w-[402px] md:flex-row justify-center">
            <Handshake className="h-5 w-5 text-black" />
            <h1 className="font-medium">Masuk Sebagai Partner</h1>
          </button>
        </div>
        <h1 className="text-md text-center font-bold text-[#BCBCBC]">
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

export default LoginPageLanding;
