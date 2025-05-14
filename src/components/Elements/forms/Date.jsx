import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const DateForm = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Buat versi debounced dari onUpdate yang TIDAK berubah pada setiap render
  const debouncedUpdate = debounce((data) => {
    if (onUpdate) {
      onUpdate(data);
    }
  }, 500);

  // Validasi dan ambil data
  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = [];
      if (!startDate) errors.push("Tanggal pembukaan harus diisi");
      if (!startTime) errors.push("Waktu pembukaan harus diisi");
      // endDate dan endTime bisa opsional
      return errors;
    },
    getData: () => {
      const startAt = startDate && startTime ? `${startDate}T${startTime}:00Z` : "";
      const endAt = endDate && endTime ? `${endDate}T${endTime}:00Z` : "";
      
      return {
        startAt,
        endAt
      };
    }
  }));

  // useEffect dengan dependency array yang benar
  useEffect(() => {
    // Hanya jalankan jika startDate dan startTime ada
    if (startDate && startTime) {
      const startAt = `${startDate}T${startTime}:00Z`;
      const endAt = endDate && endTime ? `${endDate}T${endTime}:00Z` : "";
      
      // Gunakan versi debounced yang disimpan di ref
      debouncedUpdate({ startAt, endAt });

      return () => {
        return debouncedUpdate.cancel();
      }
    }
  }, [startDate, startTime, endDate, endTime, debouncedUpdate]);
  
  // Clean up effect saat komponen unmount
  useEffect(() => {
    return () => {
      // Cancel debounced function saat unmount
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Jadwal</h2>
          <button type="button" className="text-white focus:outline-none">
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-3xl"
            />
          </button>
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden rounded-b-xl transition-all duration-300 w-full ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium mb-2"
                >
                  Tanggal Pembukaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
                {!startDate && (
                  <p className="text-xs text-red-500 mt-1">
                    Tanggal pembukaan harus diisi
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="start-time"
                  className="block text-sm font-medium mb-2"
                >
                  Waktu Pembukaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
                {!startTime && (
                  <p className="text-xs text-red-500 mt-1">
                    Waktu pembukaan harus diisi
                  </p>
                )}
              </div>
            </div>

            {/* End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium mb-2"
                >
                  Tanggal Penutupan
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="end-time"
                  className="block text-sm font-medium mb-2"
                >
                  Waktu Penutupan
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DateForm;