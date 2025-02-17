import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import IconVolunteer from "../../assets/images/icon.png";
import Footer from "../../components/footer/Footer";

const SaveEvent = () => {
  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] text-xl font-medium">
            Event Tersimpan
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-semibold text-[#0A3E54]">
              Volunteer yang kamu simpan
            </h1>
            <span className="bg-[#0A3E54] text-white rounded-full w-8 h-8 flex items-center justify-center">
              0
            </span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[#0A3E54]">
                Belum ada event yang kamu simpan? 🎟️ Segera temukan event yang
                sesuai dengan minatmu dan jangan lewatkan kesempatan untuk ikut
                serta!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 py-10">
            <img
              src={IconVolunteer}
              alt="Volunteer illustration"
              className="w-72 h-72 object-contain"
            />
            <h2 className="text-2xl font-semibold text-[#0A3E54] text-center">
            Daftar Volunteer & ikut berkontribusi!
            </h2>
            <Link to='/' className="bg-[#0A3E54] text-white px-8 py-3 rounded-full hover:bg-[#0A3E54]transition-colors">
             Cari Volunteer
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default SaveEvent;
