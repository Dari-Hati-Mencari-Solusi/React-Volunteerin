import React from "react";
import logo from "../../assets/images/logo_volunteerin.jpg";
import BtnSignIn from "../../components/Elements/buttons/BtnSignIn";
import BtnSignUp from "../../components/Elements/buttons/BtnSignUp";
import { Handshake, Mail } from "lucide-react";
import IconGoogle from "../../assets/images/icon-google.svg";
import BannerLogin from "../../assets/images/Banner-Login.png";
import { Link } from "react-router-dom";

// Reusable button component for authentication options
const AuthButton = ({ icon, text, as = "button", to = "", onClick = () => {} }) => {
  const buttonClasses = "flex items-center justify-center gap-4 border-2 border-[#A1A1A1] rounded-[12px] px-4 py-4 w-full md:w-[402px] mx-auto";
  
  if (as === "link" && to) {
    return (
      <Link to={to} className={buttonClasses}>
        {icon}
        <span className="font-medium">{text}</span>
      </Link>
    );
  }
  
  return (
    <button className={buttonClasses} onClick={onClick}>
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
};

// Divider component with text
const Divider = ({ text }) => (
  <div className="flex items-center justify-center mx-auto w-full max-w-[380px] my-8">
    <div className="flex-grow border-t border-[1.2px] border-[#A1A1A1]"></div>
    <span className="flex-shrink mx-4 text-[#A1A1A1] font-medium">
      {text}
    </span>
    <div className="flex-grow border-t border-[1.2px] border-[#A1A1A1]"></div>
  </div>
);

const LoginPageLanding = () => {
  return (
    <section className="h-screen flex justify-between flex-row lg:flex-row">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-4 lg:p-8 md:space-y-7 md:content-between">
        {/* Logo */}
        <div className="mx-auto flex items-center text-center">
          <img src={logo} alt="Volunteerin" className="w-[50px] h-[42px]" />
          <h1 className="text-xl font-bold text-[#0A3E54]">Volunteerin.</h1>
        </div>
        
        <div className="flex flex-col justify-center p-4 lg:p-8 space-y-4">
          {/* Header */}
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-center md:text-4xl text-2xl font-bold text-black text-[33px]">
              Selamat Datang Kembali
            </h2>
            <p className="mx-auto mt-4 text-center text-[#BCBCBC] font-medium">
              Event Seru, Kesempatan Berarti. Yuk, Volunteerin!
            </p>
          </div>
          
          {/* Sign In/Up Buttons */}
          <div className="flex flex-col items-center gap-4 bg-[#F0EFF2] rounded-[12px] px-4 py-2 mt-8 mx-auto w-full md:w-[402px] md:flex-row">
            <BtnSignIn />
            <BtnSignUp />
          </div>
          
          {/* Authentication Options */}
          <AuthButton 
            icon={<img src={IconGoogle} alt="Google" />}
            text="Masuk Dengan Google"
          />
          
          <AuthButton 
            as="link"
            to="/login"
            icon={<Mail className="h-5 w-5 text-black" />}
            text="Masuk Dengan Email"
          />
          
          <Divider text="Atau Lanjutkan Dengan" />
          
          <AuthButton 
            icon={<Handshake className="h-5 w-5 text-black" />}
            text="Masuk Sebagai Partner"
          />
        </div>
        
        {/* Footer Text */}
        <p className="text-md text-center font-bold text-[#BCBCBC]">
          Bergabunglah dengan ribuan orang yang mempercayai Volunteerin untuk
          menemukan peluang volunteer. Daftar sekarang, temukan event menarik,
          dan buat perubahan nyata.
        </p>
      </div>
      
      {/* Banner Image */}
      <div className="w-1/2 h-full bg-gradient-to-b from-[#D1F8FF] to-[#22D0EE] hidden lg:flex justify-center items-center">
        <img src={BannerLogin} alt="Banner Login" />
      </div>
    </section>
  );
};

export default LoginPageLanding;
