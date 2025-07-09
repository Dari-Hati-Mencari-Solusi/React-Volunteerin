import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const Volunteer = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [requirement, setRequirement] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [maxApplicant, setMaxApplicant] = useState("");
  const [acceptedQuota, setAcceptedQuota] = useState("");

  // Create a debounced version of onUpdate that doesn't change on each render
  const debouncedUpdate = useRef(
    debounce((data) => {
      if (onUpdate) {
        onUpdate(data);
      }
    }, 500)
  ).current;

  // Expose validation and data access methods to parent component
  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = [];
      if (!requirement) errors.push("Persyaratan pendaftar harus diisi");
      if (!contactPerson) errors.push("Contact person harus diisi");
      return errors;
    },
    getData: () => {
      return {
        requirement,
        contactPerson,
        maxApplicant,
        acceptedQuota
      };
    }
  }));

  useEffect(() => {
    // Convert string values to numbers if they exist
    const formattedAcceptedQuota = acceptedQuota.trim() !== "" ? parseInt(acceptedQuota, 10) : "";
    const formattedMaxApplicant = maxApplicant.trim() !== "" ? parseInt(maxApplicant, 10) : "";
    
    // Send updated data to parent component
    const data = {
      requirement: requirement || "",
      contactPerson: contactPerson || "",
      maxApplicant: formattedMaxApplicant || "",
      acceptedQuota: formattedAcceptedQuota || ""
    };
    
    debouncedUpdate(data);
  }, [requirement, contactPerson, maxApplicant, acceptedQuota]);

  // Cleanup debounce on component unmount
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
          <h2 className="text-lg font-semibold">Volunteer</h2>
          <button type="button" className="text-white focus:outline-none">
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-3xl"
            />
          </button>
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden rounded-b-xl transition-all duration-300 w-full ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Requirements */}
            <div>
              <label
                htmlFor="requirement"
                className="block text-sm font-medium mb-2"
              >
                Persyaratan Pendaftar <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requirement"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows="4"
                placeholder="Jelaskan persyaratan yang harus dipenuhi oleh volunteer yang akan mendaftar"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              ></textarea>
              {!requirement && (
                <p className="text-xs text-red-500 mt-1">
                  Persyaratan pendaftar harus diisi
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label
                htmlFor="contact-person"
                className="block text-sm font-medium mb-2"
              >
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact-person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Nomor telepon yang dapat dihubungi (WhatsApp)"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
              {!contactPerson && (
                <p className="text-xs text-red-500 mt-1">
                  Contact person harus diisi
                </p>
              )}
            </div>

            {/* Quota Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="max-applicant"
                  className="block text-sm font-medium mb-2"
                >
                  Jumlah Pendaftar Maksimal
                </label>
                <input
                  type="number"
                  id="max-applicant"
                  value={maxApplicant}
                  onChange={(e) => setMaxApplicant(e.target.value)}
                  min="0"
                  placeholder="Contoh: 100"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="accepted-quota"
                  className="block text-sm font-medium mb-2"
                >
                  Kuota Volunteer yang Diterima
                </label>
                <input
                  type="number"
                  id="accepted-quota"
                  value={acceptedQuota}
                  onChange={(e) => setAcceptedQuota(e.target.value)}
                  min="0"
                  placeholder="Contoh: 50"
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

export default Volunteer;