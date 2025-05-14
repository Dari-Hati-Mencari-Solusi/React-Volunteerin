import React from "react";

const NotificationCard = ({
  title,
  location,
  status,
  isRead,
  isOpen,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 relative overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{location}</p>
          </div>
          <div
            className={`w-2 h-2 rounded-full ${
              isRead ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              status === "Acara Selesai"
                ? "bg-cyan-100 text-cyan-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {status}
          </span>
        </div>
        <button
          onClick={onClick}
          className="absolute bottom-4 right-4 transition-transform duration-300 ease-in-out"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "400px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="p-4 bg-white">
          <div className="whitespace-pre-line text-gray-700">
            <p className="mb-2">
              Jangan lupa datang tepat waktu yaa.. Acara yang kamu ikuti akan
              segera dimulai. Pastikan kamu hadir sesuai jadwal!
            </p>
            <p className="mb-2">📅 Tanggal: Senin, 20 Januari 2026</p>
            <p className="mb-2">🕒 Waktu: 07:30 WIB - 11:30 WIB</p>
            <p className="flex items-center">
              🔗 Maps:
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 ml-1 underline"
              >
                Link google maps
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
