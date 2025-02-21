import React, { useState } from "react";
import Logo from "../../assets/images/logo_volunteerin.jpg";
import { Icon } from "@iconify/react";

const VolunteerinAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <section className="min-h-screen bg-white p-2">
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="text-center space-y-3 py-4 flex justify-center flex-col items-center">
          <img
            src={Logo}
            alt="logo volunteerin"
            className="lg:w-[350px] lg:h-[77px] md:w-[350px] md:h-[77px] w-[250px] h-[50px]"
          />
          <p className="text-gray-400 text-md">Slogan</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden max-w-[709px] mx-auto p-4">
          {/* Tombol Masuk dan Daftar */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsLogin(true)}
              className={`${
                isLogin
                  ? "bg-[#0A3E54] text-white"
                  : "bg-white text-[#0A3E54]"
              } font-medium text-md px-10 py-2 rounded-tl-md rounded-bl-md shadow-md transition-colors`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`${
                !isLogin
                  ? "bg-[#0A3E54] text-white"
                  : "bg-white text-[#0A3E54]"
              } font-medium text-md px-10 py-2 rounded-tr-md rounded-br-md shadow-md transition-colors`}
            >
              Daftar
            </button>
          </div>

          {/* Konten Kartu */}
          <div className="p-6">
            <div className="flex justify-center gap-4 flex-wrap">
              {/* Volunteer Card */}
              <div className="bg-white rounded-lg border p-6 space-y-6 max-w-[280px] h-[289px]">
                <div>
                  <div className="flex justify-center">
                    <div className="w-16 h-14 flex items-center text-[#0A3E54] justify-center">
                      <Icon icon="bxs:user" width="96" height="96" />
                    </div>
                  </div>
                  <p className="text-center text-lg text-gray-800 font-medium">
                    {isLogin ? "Masuk sebagai" : "Daftar sebagai"} <br />{" "}
                    Volunteer
                  </p>
                </div>
                <div className="space-y-2">
                  <button className="w-full py-2.5 px-4 border rounded-lg text-[#14464B] text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                    <Icon icon="tabler:mail" width="24" height="24" />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Email</span>
                  </button>
                  <button className="w-full py-2.5 px-4 border rounded-lg text-gray-600 text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                    <Icon
                      icon="flat-color-icons:google"
                      width="24"
                      height="24"
                    />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Google</span>
                  </button>
                </div>
              </div>

              {/* Partner Card */}
              <div className="bg-white rounded-lg border p-6 space-y-6 max-w-[280px] h-[289px]">
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
                    {isLogin ? "Masuk sebagai" : "Daftar sebagai"} <br />{" "}
                    Partner
                  </p>
                </div>
                <div className="space-y-2">
                  <button className="w-full py-2.5 px-4 border rounded-lg text-[#14464B] text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                    <Icon icon="tabler:mail" width="24" height="24" />
                    <span>{isLogin ? "Masuk" : "Daftar"} Dengan Email</span>
                  </button>
                  <button className="w-full py-2.5 px-4 border rounded-lg text-gray-600 text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
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
    </section>
  );
};

export default VolunteerinAuth;