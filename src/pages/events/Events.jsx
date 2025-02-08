import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const dummyData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1604998103924-89e012e5265a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Pembersihan Pohon",
    location: "Pantai Kuta, Bali Mataram",
    startDate: "2023-11-12",
    endDate: "2023-11-12",
    maxVolunteers: 100,
    registeredVolunteers: 80,
    category: "Lingkungan",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Pembersihan Pantai",
    location: "Pantai Kuta, Bali",
    startDate: "2023-11-12",
    endDate: "2023-11-12",
    maxVolunteers: 100,
    registeredVolunteers: 80,
    category: "Lingkungan",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Edukasi Lingkungan untuk Anak",
    location: "Sekolah Dasar Negeri 01, Jakarta",
    startDate: "2023-11-18",
    endDate: "2023-11-18",
    maxVolunteers: 20,
    registeredVolunteers: 15,
    category: "Pendidikan",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Pemeliharaan Taman Kota",
    location: "Taman Suropati, Jakarta Pusat",
    startDate: "2023-11-25",
    endDate: "2023-11-25",
    maxVolunteers: 30,
    registeredVolunteers: 25,
    category: "Lingkungan",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Bantuan Korban Bencana",
    location: "Palu, Sulawesi Tengah",
    startDate: "2023-12-01",
    endDate: "2023-12-01",
    maxVolunteers: 200,
    registeredVolunteers: 150,
    category: "Sosial",
  },
];

const Events = ({ selectedCategory }) => {
  const filteredEvents = selectedCategory
    ? dummyData.filter((event) => event.category === selectedCategory)
    : dummyData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
      {filteredEvents.map((item) => (
        <Link
          to="/event-detail"
          key={item.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            alt={item.title}
            src={item.image}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col gap-3">
            <h2 className="text-[18px] font-bold text-[#0A3E54] truncate">
              {item.title}
            </h2>
            <div className="space-y-3 text-sm font-normal text-[#0A3E54]">
              <div className="flex items-center gap-2">
                <Icon icon="tdesign:location" width="18" height="18" />
                <span className="truncate text-[14px]">{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="lets-icons:date-today-light"
                  width="18"
                  height="18"
                />
                <span className="truncate text-[14px]">
                  {item.startDate} - {item.endDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="fa6-solid:user-group" width="16" height="16" />
                <span className="truncate text-[14px]">
                  {item.registeredVolunteers}/{item.maxVolunteers} Terdaftar
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[#0A3E54] bg-[#22D0EE] p-1 rounded-full px-3 text-[12px] font-semibold">
                    <h1 className="">Event Berjalan</h1>
                </div>
                <div>
                <Icon icon="bi:three-dots" width="18" height="18" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Events;
