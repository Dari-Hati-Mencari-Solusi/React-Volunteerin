import React from "react";
import { Icon } from "@iconify/react";
import ListVolunteer from "./ListVolunteer";

const VolunteerPage = () => {
  return (
    <section className="flex flex-col gap-y-4">
      <h1 className="title">Rincian Pendaftar</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-3">
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon icon="mdi:users" width="32" height="32" />
            </div>
            <p className="card-title">Total Pendaftar</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              0 Orang
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-[#1BD113]">
              Pendaftar Sementara
              <Icon icon="mdi:trending-up" width="18" height="18" />
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon icon="ph:money-wavy-bold" width="32" height="32" />
            </div>
            <p className="card-title">Dana yang Masuk</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              Rp.0.000,00
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-[#1BD113]">
              Pendapatan hari ini
              <Icon icon="mdi:trending-up" width="18" height="18" />
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon
                icon="fluent:notepad-edit-20-filled"
                width="32"
                height="32"
              />
            </div>
            <p className="card-title">Status Pendaftar</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              0 Orang
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-red-500">
              Direview/ditolak/lolos
              {/* <Icon icon="mdi:trending-up" width="18" height="18" /> */}
            </span>
          </div>
        </div>
      </div>
      <ListVolunteer />
    </section>
  );
};

export default VolunteerPage;
