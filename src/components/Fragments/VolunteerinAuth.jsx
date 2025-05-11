import React, { useState } from "react";
import Logo from "../../assets/images/logo_volunteerin.jpg";
import { Icon } from "@iconify/react";
import WhatsAppButton from "../Elements/buttons/BtnWhatsapp";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService"; 

const VolunteerinAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleOAuthUrl();
  };

  return (
    <section className="min-h-screen bg-white p-2 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-3 md:py-14 lg:py-4 py-4 flex justify-center flex-col items-center">
          <Link to="/" >
          <img
            src={Logo}
            alt="logo volunteerin"
            className="lg:w-[295px] lg:h-[64px] md:w-[295px] md:h-[64px] w-[250px] h-[50px]"
          />
          </Link>
          <p className="text-[#0A3E54] text-xl font-semibold">
            Slogan Volunteerin
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl overflow-hidden max-w-[709px] mx-auto p-4">
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsLogin(true)}
              className={`${
                isLogin ? "bg-[#0A3E54] text-white" : "bg-white text-[#0A3E54]"
              } font-medium text-md px-10 py-2 rounded-tl-md rounded-bl-md shadow-md transition-colors`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`${
                !isLogin ? "bg-[#0A3E54] text-white" : "bg-white text-[#0A3E54]"
              } font-medium text-md px-10 py-2 rounded-tr-md rounded-br-md shadow-md transition-colors`}
            >
              Daftar
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white hover:shadow-lg transition duration-300 ease-in-out rounded-lg border p-6 space-y-6 max-w-[280px] h-[289px]">
                <div>
                  <div className="flex justify-center">
                    <div className="w-16 h-14 flex items-center text-[#0A3E54] justify-center">
                      <Icon icon="bxs:user" width="96" height="96" />
                    </div>
                  </div>
                  <p className="text-center text-lg text-gray-800 font-medium">
                    {isLogin ? "Masuk sebagai" : "Daftar sebagai"} <br />
                    Volunteer
                  </p>
                </div>
                <div className="space-y-2">
                  <Link
                    to={isLogin ? "/login" : "/register"}
                    className="w-full py-2.5 px-4 border bg-[#0A3E54] rounded-xl text-white text-sm font-normal flex items-center justify-center space-x-2"
                  >
                    <Icon icon="tabler:mail" width="24" height="24" />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Email</span>
                  </Link>
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 px-4 border rounded-xl text-gray-600 text-sm font-normal flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                  >
                    <Icon
                      icon="flat-color-icons:google"
                      width="24"
                      height="24"
                    />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Google</span>
                  </button>
                </div>
              </div>

              <div className="bg-white hover:shadow-lg transition duration-300 ease-in-out rounded-lg border p-6 space-y-6 max-w-[280px] h-[289px]">
                <div>
                  <div className="flex justify-center">
                    <div className="w-16 h-14 flex items-center text-[#0A3E54] justify-center">
                      <Icon
                        icon="material-symbols:partner-exchange-rounded"
                        width="96"
                        height="96"
                      />
                    </div>
                  </div>
                  <p className="text-center text-lg text-gray-800 font-medium">
                    {isLogin ? "Masuk sebagai" : "Daftar sebagai"} <br />
                    Partner
                  </p>
                </div>
                <div className="space-y-2">
                  <Link
                    to={isLogin ? "/login-partner" : "/register-partner"} 
                    className="w-full py-2.5 px-4 border bg-[#0A3E54] rounded-xl text-white text-sm font-normal flex items-center justify-center space-x-2"
                  >
                    <Icon icon="tabler:mail" width="24" height="24" />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Email</span>
                  </Link>
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 px-4 border rounded-xl text-gray-600 text-sm font-normal flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                  >
                    <Icon
                      icon="flat-color-icons:google"
                      width="24"
                      height="24"
                    />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton phoneNumber="+6285343037191" />
    </section>
  );
};

export default VolunteerinAuth;