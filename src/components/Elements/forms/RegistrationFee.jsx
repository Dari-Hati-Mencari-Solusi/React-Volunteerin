import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const RegistrationFee = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("0");

  // Buat versi debounced dari onUpdate yang TIDAK berubah pada setiap render
  const debouncedUpdate = useRef(
    debounce((data) => {
      if (onUpdate) {
        onUpdate(data);
      }
    }, 500)
  ).current;

  // Validasi dan akses data untuk parent component
  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = [];
      if (isPaid && (!price || price === "0")) {
        errors.push("Jumlah biaya pendaftaran harus diisi untuk event berbayar");
      }
      return errors;
    },
    getData: () => {
      return {
        isPaid,
        price: isPaid ? price : "0"
      };
    }
  }));

  // useEffect dengan dependency array yang benar
  useEffect(() => {
    // Debounced update ke parent component
    debouncedUpdate({
      isPaid,
      price: isPaid ? price : "0"
    });
  }, [isPaid, price, debouncedUpdate]);

  // Clean up effect saat komponen unmount
  useEffect(() => {
    return () => {
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
          <h2 className="text-lg font-semibold">Biaya Pendaftaran</h2>
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
            <div>
              <div className="flex items-center space-x-2">
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="fee-toggle"
                    className="hidden"
                    checked={isPaid}
                    onChange={() => setIsPaid(!isPaid)}
                  />
                  <label
                    htmlFor="fee-toggle"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                      isPaid ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                        isPaid ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
                <span className="text-sm font-medium">
                  {isPaid ? "Berbayar" : "Gratis"}
                </span>
              </div>

              {isPaid && (
                <div className="mt-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2"
                  >
                    Biaya Pendaftaran (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">Rp</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      placeholder="Masukkan jumlah biaya pendaftaran"
                      className="w-full pl-10 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                    />
                  </div>
                  {isPaid && (!price || price === "0") && (
                    <p className="text-xs text-red-500 mt-1">
                      Jumlah biaya pendaftaran harus diisi untuk event berbayar
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RegistrationFee;