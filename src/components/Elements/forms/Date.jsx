import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Date = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [registrationOpenDate, setRegistrationOpenDate] = useState("");
  const [registrationOpenTime, setRegistrationOpenTime] = useState("");
  const [registrationCloseDate, setRegistrationCloseDate] = useState("");
  const [registrationCloseTime, setRegistrationCloseTime] = useState("");

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Waktu Pelaksanaan</h2>
          <button className="text-white focus:outline-none">
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-3xl"
            />
          </button>
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden transition-all duration-300 w-full rounded-b-xl ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal & Jam Pembukaan Pendaftaran{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={registrationOpenDate}
                  onChange={(e) => setRegistrationOpenDate(e.target.value)}
                  className="w-1/2 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
                <input
                  type="time"
                  value={registrationOpenTime}
                  onChange={(e) => setRegistrationOpenTime(e.target.value)}
                  className="w-1/2 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal & Jam Penutupan Pendaftaran{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={registrationCloseDate}
                  onChange={(e) => setRegistrationCloseDate(e.target.value)}
                  className="w-1/2 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
                <input
                  type="time"
                  value={registrationCloseTime}
                  onChange={(e) => setRegistrationCloseTime(e.target.value)}
                  className="w-1/2 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Date;