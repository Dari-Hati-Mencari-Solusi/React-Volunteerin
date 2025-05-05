import React, { useState } from "react";
import { Icon } from "@iconify/react";

const RegistrationFee = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [feeType, setFeeType] = useState("Gratis");
  const [registrationFee, setRegistrationFee] = useState("");

  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const removeCommas = (value) => {
    return value.replace(/,/g, "");
  };

  const handleRegistrationFeeChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setRegistrationFee(numericValue);
  };

  const displayFee = registrationFee
    ? formatNumberWithCommas(registrationFee)
    : "";

  const placeholder =
    feeType === "Gratis" ? "Event ini gratis" : "Masukan biaya pendaftaran";

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Biaya Pendaftaran</h2>
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
                Apakah event ini ada biaya pendaftaran?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feeType"
                    value="Gratis"
                    checked={feeType === "Gratis"}
                    onChange={() => {
                      setFeeType("Gratis");
                      setRegistrationFee("");
                    }}
                    className="w-5 h-5 text-[#0A3E54] focus:ring-[#0A3E54]"
                  />
                  <span className="ml-2">Gratis</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feeType"
                    value="Berbayar"
                    checked={feeType === "Berbayar"}
                    onChange={() => {
                      setFeeType("Berbayar");
                      setRegistrationFee("");
                    }}
                    className="w-5 h-5 text-[#0A3E54] focus:ring-[#0A3E54]"
                  />
                  <span className="ml-2">Berbayar</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Masukan Jumlah Biaya Pendaftaran
              </label>
              <div className="flex">
                <div className="bg-gray-200 px-4 py-2 flex items-center rounded-l-lg">
                  <span>Rp.</span>
                </div>
                <input
                  type="text"
                  value={displayFee}
                  onChange={handleRegistrationFeeChange}
                  placeholder={placeholder}
                  disabled={feeType === "Gratis"}
                  className="w-full px-4 py-2 rounded-r-lg border border-l-0 focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFee;
