import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Banner from "../../assets/images/banner2.jpg";
import { Footer } from "../../pages/partners/layouts/Footer";
import BtnWhatsapp from "../Elements/buttons/BtnWhatsapp";
import CreateEvent from "../../pages/partners/CreateEvent";

const initialEvents = [
  {
    banner: Banner,
    name: "Lingkungan Sehat",
    startDate: "Jan 20, 2025",
    endDate: "Jan 22, 2025",
    publish: "Checklist",
  },
  {
    banner: Banner,
    name: "Jalan Santai",
    startDate: "Feb 20, 2025",
    endDate: "Feb 22, 2025",
    publish: "Pending",
  },
  {
    banner: Banner,
    name: "Tanam Ubi",
    startDate: "Agi 20, 2025",
    endDate: "Agi 22, 2025",
    publish: "Checklist",
  },
  {
    banner: Banner,
    name: "Lingkungan Sehat",
    startDate: "Jan 20, 2025",
    endDate: "Jan 22, 2025",
    publish: "Checklist",
  },
  {
    banner: Banner,
    name: "Jalan Santai",
    startDate: "Feb 20, 2025",
    endDate: "Feb 22, 2025",
    publish: "Pending",
  },
  {
    banner: Banner,
    name: "Tanam Ubi",
    startDate: "Agi 20, 2025",
    endDate: "Agi 22, 2025",
    publish: "Checklist",
  },
];

const ListEvents = () => {
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
    <div className="flex flex-col gap-y-7">
      {showReportPage ? (
        <CreateEvent onBack={handleBack} />
      ) : (
        <>
          <h1 className="title">Events</h1>

          <div className="flex justify-end">
            <button
              onClick={handleCreateEvent}
              className="bg-[#0A3E54] py-3 px-4 flex items-center gap-x-2 text-white rounded-xl"
            >
              <span>
                <Icon
                  icon="material-symbols:event-note-rounded"
                  width="24"
                  height="24"
                />
              </span>
              Buat Event
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-t-xl px-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg text-white font-medium">
                  Daftar Relawan
                </h2>
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
                  placeholder="Cari event kamu..."
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
                        Banner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Mulai
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Selesai
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Publish
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
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
                          <div className="h-16 w-36 flex items-center justify-center overflow-hidden rounded-lg">
                            <img
                              src={event.banner}
                              alt={`Banner for ${event.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-md font-medium text-gray-900">
                            {event.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {event.startDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {event.endDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {event.publish === "Checklist" ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <Icon
                                icon="mdi:check-circle"
                                width="16"
                                height="16"
                                className="mr-1"
                              />
                              Published
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
                              Lihat Event
                            </button>
                            <button className="inline-flex items-center px-2 py-1 text-[#0A3E54]">
                              <Icon
                                icon="mdi:pencil"
                                width="20"
                                height="20"
                                className="mr-1"
                              />
                              Ubah Event
                            </button>
                          </div>
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
                              Lihat Formulir
                            </button>
                            <button className="inline-flex items-center px-2 py-1 text-[#0A3E54]">
                              <Icon
                                icon="mdi:pencil"
                                width="20"
                                height="20"
                                className="mr-1"
                              />
                              Ubah Formulir
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
          <BtnWhatsapp />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ListEvents;
