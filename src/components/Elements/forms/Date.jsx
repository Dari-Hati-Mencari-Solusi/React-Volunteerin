import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const DateForm = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Buat versi debounced dari onUpdate dengan useRef agar tidak berubah setiap render
  const debouncedUpdate = useRef(
    debounce((data) => {
      if (onUpdate) {
        console.log("Sending date data to parent:", data);
        onUpdate(data);
      }
    }, 500)
  ).current;

  // Validasi dan ambil data
  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = [];
      if (!startDate) errors.push("Tanggal pembukaan harus diisi");
      if (!startTime) errors.push("Waktu pembukaan harus diisi");
      return errors;
    },
    getData: () => {
      const startAt = startDate && startTime ? `${startDate}T${startTime}:00Z` : null;
      const endAt = endDate && endTime ? `${endDate}T${endTime}:00Z` : null;
      
      console.log("Returning date data:", { startAt, endAt });
      return { startAt, endAt };
    }
  }));

  // useEffect untuk mengirim data ke parent component
  useEffect(() => {
    if (startDate && startTime) {
      const startAt = `${startDate}T${startTime}:00Z`;
      const endAt = endDate && endTime ? `${endDate}T${endTime}:00Z` : null;
      
      debouncedUpdate({ startAt, endAt });
    }
  }, [startDate, startTime, endDate, endTime, debouncedUpdate]);
  
  // Clean up effect saat komponen unmount
  useEffect(() => {
    return () => {
      if (debouncedUpdate && debouncedUpdate.cancel) {
        debouncedUpdate.cancel();
      }
    };
  }, [debouncedUpdate]);

  // Handler untuk tanggal end date minimal sama dengan start date
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && endDate < newStartDate) {
      setEndDate(newStartDate);
    }
  };

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
                  onChange={handleStartDateChange}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium mb-2 md:flex justify-between"
                >
                  <span>Tanggal Penutupan</span>
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    endDate && !endTime ? "border-yellow-300" : ""
                  }`}
                />
                {endDate && !endTime && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Jangan lupa isi waktu penutupan juga
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="end-time"
                  className="block text-sm font-medium mb-2 md:flex justify-between"
                >
                  <span>Waktu Penutupan</span>
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    endDate && !endTime ? "border-yellow-300" : ""
                  }`}
                />
                {endTime && !endDate && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Jangan lupa isi tanggal penutupan juga
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm mt-2">
              <p className="text-gray-600">
                {startDate && startTime ? (
                  <>
                    <span className="font-medium">Event akan dimulai pada: </span>
                    {new Date(`${startDate}T${startTime}:00`).toLocaleString('id-ID')}
                  </>
                ) : (
                  <span className="text-gray-400">Silakan isi tanggal dan waktu pembukaan</span>
                )}
              </p>
              
              {endDate && endTime && (
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Event akan berakhir pada: </span>
                  {new Date(`${endDate}T${endTime}:00`).toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DateForm.displayName = "DateForm";

export default DateForm;