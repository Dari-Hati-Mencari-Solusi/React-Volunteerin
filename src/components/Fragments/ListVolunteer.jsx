import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const initialEvents = [
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
  {
    NamaPendaftar: "John Doe",
    WaktuPendaftaran: "Feb 1, 2025",
    EventDipilih: "Jalan Santai",
    StatusBayar: "Sudah Bayar",
    StatusReview: "Checklist",
  },
];

const ListVolunteer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState(initialEvents);
  const [showReportPage, setShowReportPage] = useState(false);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = initialEvents.filter((event) =>
      event.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setEvents(filtered);
  };

  const handleCreateEvent = () => {
    setShowReportPage(true);
  };

  const handleBack = () => {
    setShowReportPage(false);
  };

  return (
    <section className="py-10">
      <div className="border border-gray-200 rounded-lg">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-t-xl px-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg text-white font-medium">Daftar Relawan</h2>
          </div>
          <div className="relative w-full md:w-72 flex items-center gap-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon
                icon="flowbite:search-outline"
                width="24"
                height="24"
                className="text-[#667085]"
              />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Cari nama relawan..."
            />
            <Icon
              icon="line-md:filter"
              width="38"
              height="38"
              className="text-white"
            />
          </div>
        </div>

        <div>
          <div className="relative h-[500px] w-full overflow-auto rounded-none scrollbar-thin">
            <table className="w-full min-w-full table-auto">
              <thead className="bg-[#F2F2F2] text-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pendaftar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Pendaftaran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Dipilih
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Bayar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Review
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formulir
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-md font-medium text-gray-900">
                        {event.NamaPendaftar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.WaktuPendaftaran}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.EventDipilih}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.StatusBayar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.StatusReview === "Checklist" ? (
                        <span className="px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full bg-red-500 text-white">
                          <Icon
                            icon="mdi:check-circle"
                            width="16"
                            height="16"
                            className="mr-1"
                          />
                          Belum dikoreksi
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Icon
                            icon="mdi:clock-outline"
                            width="16"
                            height="16"
                            className="mr-1"
                          />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-x-2">
                        <button className="inline-flex items-center px-2 py-1 text-[#0A3E54]">
                          <Icon
                            icon="mdi:eye"
                            width="20"
                            height="20"
                            className="mr-1"
                          />
                          Review Formulir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Menampilkan {events.length} dari {initialEvents.length} event
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50">
                <Icon icon="mdi:chevron-left" width="16" height="16" />
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-500 text-white border border-blue-500 hover:bg-blue-600">
                1
              </button>
              <button className="px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50">
                <Icon icon="mdi:chevron-right" width="16" height="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListVolunteer;
