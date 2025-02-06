import React from "react";
import { Link } from "react-router-dom";

const dummyData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1604998103924-89e012e5265a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Penanaman Pohon",
    // description:
    //   "Ayo tanam pohon bersama untuk mengurangi dampak pemanasan global dan menjaga kelestarian hutan.",
    location: "Taman Nasional Gunung Gede Pangrango, Jawa Barat",
    startDate: "2023-11-05",
    endDate: "2023-11-05",
    maxVolunteers: 50,
    registeredVolunteers: 35,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Pembersihan Pantai",
    // description:
    //   "Bergabunglah dengan kami untuk membersihkan pantai dari sampah plastik dan menjaga ekosistem laut.",
    location: "Pantai Kuta, Bali",
    startDate: "2023-11-12",
    endDate: "2023-11-12",
    maxVolunteers: 100,
    registeredVolunteers: 80,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80",
    title: "Edukasi Lingkungan untuk Anak",
    // description:
    //   "Mengajar anak-anak tentang pentingnya menjaga lingkungan dan praktik daur ulang.",
    location: "Sekolah Dasar Negeri 01, Jakarta",
    startDate: "2023-11-18",
    endDate: "2023-11-18",
    maxVolunteers: 20,
    registeredVolunteers: 15,
  },
  {
    id: 4,
    image:
      "https://www.hondapowerproducts.co.id/cfind/source/images/article/manfaat%20taman%20kota.jpg",
    title: "Pemeliharaan Taman Kota",
    // description:
    //   "Bantu merawat taman kota dengan membersihkan dan menanam bunga untuk keindahan lingkungan.",
    location: "Taman Suropati, Jakarta Pusat",
    startDate: "2023-11-25",
    endDate: "2023-11-25",
    maxVolunteers: 30,
    registeredVolunteers: 25,
  },
];

const Lingkungan = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {dummyData.map((item) => (
        <Link to='/event-detail'
          key={item.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            alt={item.title}
            src={item.image}
            className="w-full h-48 object-cover"
          />

          <div className="p-4 flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#0A3E54] truncate">
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 line-clamp-3">
              {item.description}
            </p>

            <div className="space-y-3 text-sm font-normal text-[#0A3E54]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate text-[17px]">{item.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate text-[17px]">
                  {item.startDate} - {item.endDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="truncate text-[17px]">
                  {item.registeredVolunteers}/{item.maxVolunteers} Terdaftar
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Lingkungan;
