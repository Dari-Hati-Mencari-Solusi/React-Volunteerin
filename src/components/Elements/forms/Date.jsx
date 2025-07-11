import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const DateForm = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const debouncedUpdate = useRef(
    debounce((data) => {
      if (onUpdate) {
        console.log("Sending date data to parent:", data);
        onUpdate(data);
      }
    }, 500)
  ).current;

  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = [];
      if (!startDate) errors.push("Tanggal pembukaan harus diisi");
      if (!startTime) errors.push("Waktu pembukaan harus diisi");
      return errors;
    },
    validateForPublish: () => {
      const errors = [];
      if (!startDate) errors.push("Tanggal mulai event wajib diisi untuk publikasi");
      if (!startTime) errors.push("Waktu mulai event wajib diisi untuk publikasi");
      if (!endDate) errors.push("Tanggal selesai event wajib diisi untuk publikasi");
      return errors;
    },
    getData: () => {
      const startAt = startDate && startTime ? `${startDate}T${startTime}:00Z` : null;
      const endAt = endDate && endTime ? `${endDate}T${endTime}:00Z` : null;
      
      console.log("Returning date data:", { startAt, endAt });
      return { startAt, endAt };
    }
  }));

  useEffect(() => {
    if (startDate && startTime) {
      const startAt = `${startDate}T${startTime}:00Z`;
      const endAt = endDate && endTime ? `${endDate}T${endTime}:00Z` : null;
      
      debouncedUpdate({ startAt, endAt });
    }
  }, [startDate, startTime, endDate, endTime, debouncedUpdate]);
  
  useEffect(() => {
    return () => {
      if (debouncedUpdate && debouncedUpdate.cancel) {
        debouncedUpdate.cancel();
      }
    };
  }, [debouncedUpdate]);

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
            {/* Start Date and Time */}
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
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !startDate ? "border-red-300" : ""
                  }`}
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
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !startTime ? "border-red-300" : ""
                  }`}
                />
                {!startTime && (
                  <p className="text-xs text-red-500 mt-1">
                    Waktu pembukaan harus diisi
                  </p>
                )}
              </div>
            </div>

            {/* End Date and Time - Updated with Publish Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium mb-2"
                >
                  Tanggal Penutupan <span className="text-red-500">* (Wajib untuk Publish)</span>
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !endDate ? "border-red-300" : ""
                  }`}
                />
                {!endDate && (
                  <p className="text-xs text-red-500 mt-1">
                    Tanggal penutupan wajib diisi untuk publikasi event
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="end-time"
                  className="block text-sm font-medium mb-2"
                >
                  Waktu Penutupan <span className="text-orange-500">(Opsional)</span>
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
                {endDate && !endTime && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Waktu penutupan disarankan diisi jika ada tanggal penutupan
                  </p>
                )}
              </div>
            </div>

            {/* Event Schedule Preview */}
            <div className="text-sm mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Preview Jadwal Event:</h4>
              <div className="space-y-1">
                <p className="text-gray-600">
                  {startDate && startTime ? (
                    <>
                      <span className="font-medium">Pembukaan: </span>
                      {new Date(`${startDate}T${startTime}:00`).toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  ) : (
                    <span className="text-gray-400">Silakan isi tanggal dan waktu pembukaan</span>
                  )}
                </p>
                
                {endDate && (
                  <p className="text-gray-600">
                    <span className="font-medium">Penutupan: </span>
                    {new Date(`${endDate}T${endTime || '23:59'}:00`).toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Publish Status Indicator */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status Jadwal untuk Publikasi:</h4>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center ${startDate && startTime ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={startDate && startTime ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {startDate && startTime ? "Jadwal pembukaan sudah lengkap" : "Jadwal pembukaan belum lengkap"}
                </div>
                <div className={`flex items-center ${endDate ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={endDate ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {endDate ? "Tanggal penutupan sudah diset" : "Tanggal penutupan wajib untuk publikasi"}
                </div>
                <div className={`flex items-center ${endTime ? 'text-green-600' : 'text-yellow-600'}`}>
                  <Icon 
                    icon={endTime ? "mdi:check-circle" : "mdi:information"} 
                    className="mr-1" 
                  />
                  {endTime ? "Waktu penutupan sudah diset" : "Waktu penutupan opsional (default: 23:59)"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DateForm.displayName = "DateForm";

export default DateForm;