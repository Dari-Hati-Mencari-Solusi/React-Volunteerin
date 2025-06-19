import React from "react";
import IconMarket from "../../assets/images/icon.png";
import { Icon } from "@iconify/react";

const Marketing = () => {
  return (
    <section className="w-full">
      <div className="py-5 px-4 md:px-0">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="bg-[#FBFBFB] border border-gray-200 rounded-[12px] p-5 sm:p-6 w-full md:w-1/2 text-[#0A3E54] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-grow">
                <h1 className="font-semibold text-lg sm:text-xl mb-2">
                  Masih Bingung Daftar Volunteer?
                </h1>
                <p className="text-sm sm:text-base">
                  Dengan platform volunteer kami, kamu bisa menemukan berbagai
                  peluang relawan sesuai minat dan keahlianmu.
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 mt-4 text-sm font-medium hover:text-[#16A1CB] transition-colors"
                >
                  Gabung Volunteerin
                  <span className="bg-[#0A3E54] p-[4px] text-white rounded-full transition-colors">
                    <Icon icon="ph:handshake-fill" width="20" height="20" className="sm:w-[22px] sm:h-[22px]" />
                  </span>
                </a>
              </div>
              <div className="hidden sm:block sm:w-24 md:w-28 lg:w-32 flex-shrink-0">
                <img 
                  src={IconMarket} 
                  alt="Volunteer opportunities" 
                  className="w-full h-auto object-contain" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#FBFBFB] border border-gray-200 rounded-[12px] p-5 sm:p-6 w-full md:w-1/2 text-[#0A3E54] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-grow">
                <h1 className="font-semibold text-lg sm:text-xl mb-2">
                  Baru Memulai? Pengalamanmu Bukan Jadi Masalah!
                </h1>
                <p className="text-sm sm:text-base">
                  Kami menyediakan pelatihan khusus dan pendampingan untuk
                  membantu kamu menjadi relawan yang percaya diri dan berdampak.
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 mt-4 text-sm font-medium hover:text-[#16A1CB] transition-colors"
                >
                  Ikuti Program Mentoring
                  <span className="bg-[#0A3E54] p-[4px] text-white rounded-full transition-colors">
                    <Icon icon="mdi:human-greeting-variant" width="20" height="20" className="sm:w-[22px] sm:h-[22px]" />
                  </span>
                </a>
              </div>
              <div className="hidden sm:block sm:w-24 md:w-28 lg:w-32 flex-shrink-0">
                <img
                  src={IconMarket}
                  alt="Volunteer training"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FBFBFB] border border-gray-200 mt-4 rounded-[12px] p-5 sm:p-6 w-full text-[#0A3E54] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="text-center">
            <p className="text-sm sm:text-base">
              Bergabunglah dengan Volunteerin dan temukan kesempatan relawan yang berdampak.
              <span className="hidden sm:inline"><br /></span>
              <span className="sm:hidden"> </span>
              Mulai aksi kecilmu hari ini, untuk perubahan besar esok hari.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketing;