import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Marketing from "./Marketing";

const RegistrationStatus = () => {
  // State untuk mengontrol status akhir (accepted/rejected)
  const [finalStatus, setFinalStatus] = useState("rejected"); // 'accepted' atau 'rejected'

  const StatusCard = ({ icon, title, isActive, bgColor, iconColor, textColor }) => (
    <div
      className={`${bgColor} rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] transition-all duration-300`}
    >
      <div
        className={`${iconColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3
        className={`text-lg font-semibold ${textColor || (isActive ? "text-[#15803D]" : "text-[#6B7280]")}`}
      >
        {title}
      </h3>
    </div>
  );

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <Link to="/regis-event" className="text-[#0A3E54] text-sm md:text-xl lg:text-xl font-medium hover:underline">
            Event Terdaftar
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] md:text-xl lg:text-xl text-sm font-medium">
            Status Pendaftaran
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>

        <div className="mb-12">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatusCard
              icon={<Icon icon="mdi:clock-outline" width="36" height="36" style={{ color: "#6B7280" }} />}
              title="Menunggu"
              isActive={false}
              bgColor="bg-[#F3F4F6]"
              iconColor="bg-[#D9D9D9]"
            />

            <StatusCard
              icon={<Icon icon="streamline-plump:file-search" width="36" height="36" style={{ color: "#6B7280" }} />}
              title="Sedang Diproses"
              isActive={false}
              bgColor="bg-[#F3F4F6]"
              iconColor="bg-[#D9D9D9]"
            />

            <StatusCard
              icon={
                finalStatus === "accepted" ? (
                  <Icon 
                    icon="mdi:check-circle" 
                    width="36" 
                    height="36" 
                    style={{ color: "#ffffff" }} 
                  />
                ) : (
                  <Icon 
                    icon="octicon:x-circle-16" 
                    width="36" 
                    height="36" 
                    style={{ color: "#ffffff" }} 
                  />
                )
              }
              title={finalStatus === "accepted" ? "Diterima" : "Ditolak"}
              isActive={true}
              bgColor={finalStatus === "accepted" ? "bg-green-100" : "bg-[#FFE9E9]"}
              iconColor={finalStatus === "accepted" ? "bg-green-500" : "bg-[#FF0000]"}
              textColor={finalStatus === "accepted" ? "text-[#15803D]" : "text-[#D20000]"}
            />
          </div>

          {/* Main Content */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#6B7280] mb-6">
              Hallo, Kang Rantau
            </h1>

            <p className={`text-lg leading-relaxed mb-8 md:max-w-2xl lg:max-w-4xl mx-auto ${
              finalStatus === "accepted" ? "text-green-600" : "text-[#D20000]"
            }`}>
              {finalStatus === "accepted" 
                ? "Selamat, Pendaftaran Berhasil! Anda telah diterima sebagai relawan. Silakan periksa email Anda untuk informasi lengkap mengenai langkah berikutnya dan jadwal pengarahan."
                : "Maaf, pendaftaran Anda belum dapat diterima kali ini. Jangan menyerah! Masih banyak kesempatan lain untuk berkontribusi sebagai relawan."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/regis-event"
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#0A3E54] text-[#0A3E54] font-semibold rounded-full hover:bg-[#0A3E54] hover:text-white transition-colors"
              >
                <Icon icon="mdi:arrow-left" width="24" height="24" />
                Kembali
              </Link>

              <Link
                to="/"
                className="bg-[#0A3E54] text-white px-8 py-3 rounded-full hover:bg-[#0A3E54]/90 transition-colors"
              >
                Cari Volunteer Lainnya
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default RegistrationStatus;