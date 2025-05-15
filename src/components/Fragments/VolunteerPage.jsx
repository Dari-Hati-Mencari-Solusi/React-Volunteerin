import React, { useState } from "react"; // Hapus useEffect
import { Icon } from "@iconify/react";
import ListVolunteer from "./ListVolunteer";
// Import masih dipertahankan untuk penggunaan di masa depan
import { userRegistrationService } from "../../services/userResgistrationService";
import { formatCurrency } from "../../utils/formatters";

const VolunteerPage = () => {
  // Tetap menyediakan statistik default
  const [statistics, setStatistics] = useState({
    totalRegistrations: 0,
    totalRevenue: 0,
    approvedRegistrations: 0,
    pendingRegistrations: 0,
    rejectedRegistrations: 0
  });
  // Set loading ke false karena kita tidak mengambil data
  const [loading, setLoading] = useState(false);

  // Nonaktifkan useEffect untuk fetchStatistics
  // useEffect(() => {
  //   const fetchStatistics = async () => {
  //     try {
  //       setLoading(true);
  //       // Perbaiki penggunaan userService menjadi userRegistrationService
  //       const response = await userRegistrationService.getVolunteerRegistrations();
        
  //       if (response && response.data) {
  //         // Calculate statistics
  //         const registrations = response.data;
  //         const approved = registrations.filter(r => r.status === 'APPROVED').length;
  //         const pending = registrations.filter(r => r.status === 'PENDING').length;
  //         const rejected = registrations.filter(r => r.status === 'REJECTED').length;
          
  //         // Calculate total revenue (assume each registration has a fee property)
  //         const revenue = registrations.reduce((sum, r) => {
  //           return sum + (r.fee || 0);
  //         }, 0);
          
  //         setStatistics({
  //           totalRegistrations: registrations.length,
  //           totalRevenue: revenue,
  //           approvedRegistrations: approved,
  //           pendingRegistrations: pending,
  //           rejectedRegistrations: rejected
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching statistics:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchStatistics();
  // }, []);

  return (
    <section className="flex flex-col gap-y-4">
      <h1 className="title">Rincian Pendaftar</h1>
      
      {/* Notifikasi untuk pengguna bahwa statistik sedang dalam pengembangan */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
        <div className="flex items-start">
          <Icon icon="mdi:information" className="text-blue-600 h-6 w-6 mr-2 mt-0.5" />
          <div>
            <h3 className="text-blue-700 font-medium">Statistik dalam Pengembangan</h3>
            <p className="text-blue-600">
              Fitur statistik pendaftar sedang dalam pengembangan. Data aktual akan ditampilkan segera setelah integrasi API selesai.
            </p>
          </div>
        </div>
      </div>
      
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
              {/* Tampilkan placeholder daripada nilai sebenarnya */}
              <span className="opacity-50">- Orang</span>
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-gray-500">
              Menunggu data
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
              {/* Tampilkan placeholder daripada nilai sebenarnya */}
              <span className="opacity-50">Rp -</span>
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-gray-500">
              Menunggu data
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
              {/* Tampilkan placeholder daripada nilai sebenarnya */}
              <span className="opacity-50">- Orang</span>
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-gray-500">
              Menunggu data
            </span>
          </div>
        </div>
      </div>
      
      <ListVolunteer />
    </section>
  );
};

export default VolunteerPage;