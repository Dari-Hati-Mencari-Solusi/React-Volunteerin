import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const initialEvents = [
  {
    NamaPendaftar: "John Doe",
    Email: "Kangrantau02@gmail.com",
    NomorHandphone: "089083287462",
    Role: "User",
  },
  {
    NamaPendaftar: "John Doe",
    Email: "Kangrantau02@gmail.com",
    NomorHandphone: "089083287462",
    Role: "User",
  },
  {
    NamaPendaftar: "John Doe",
    Email: "Kangrantau02@gmail.com",
    NomorHandphone: "089083287462",
    Role: "User",
  },
];

const UserRole = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState(initialEvents);
  const [showReportPage, setShowReportPage] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = initialEvents.filter((event) =>
      event.NamaPendaftar.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setEvents(filtered);
  };

  const handleCreateEvent = () => {
    setShowReportPage(true);
  };

  const handleBack = () => {
    setShowReportPage(false);
  };

  const handleRoleChange = (id, newRole) => {
    const updatedEvents = events.map((event, index) => {
      if (index === id) {
        return { ...event, Role: newRole };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  return (
    <section>
      <div>
        <h1 className="title text-[#0A3E54]">Review User</h1>
      </div>
      <div className="py-10">
        <div className="border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center bg-[#0A3E54] rounded-t-lg">
            <div className="px-4">
              <h1 className="text-lg text-white font-medium">
                Pendaftar Event
              </h1>
            </div>
            <div className="p-4 flex flex-wrap items-center justify-end gap-4 border-b ">
              <div className="relative w-full md:w-64">
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
                  placeholder="Cari nama pendaftar..."
                />
              </div>
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
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      nomor Handphone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
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
                          {event.Email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {event.NomorHandphone}
                        </div>
                      </td>
                      <td className=" py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <select
                            value={event.Role}
                            onChange={(e) =>
                              handleRoleChange(index, e.target.value)
                            }
                            className="bg-[#22D0EE] text-black text-xs sm:text-sm rounded-lg block w-full p-1 border-none focus:ring-0 focus:outline-none cursor-pointer"
                          >
                            <option value="User">User</option>
                            <option value="Partner">Partner</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-x-2">
                          <button className="inline-flex items-center px-2 py-1 text-[#0A3E54] underline">
                            <Icon
                              icon="mdi:eye"
                              width="20"
                              height="20"
                              className="mr-1"
                            />
                            Lihat Detail
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
      </div>
    </section>
  );
};

export default UserRole;
