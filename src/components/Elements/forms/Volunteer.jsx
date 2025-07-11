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
    validateForPublish: () => {
      const errors = [];
      if (!requirement || requirement.trim().length < 10) errors.push("Persyaratan volunteer minimal 10 karakter untuk publikasi");
      if (!contactPerson || contactPerson.trim().length < 5) errors.push("Kontak person minimal 5 karakter untuk publikasi");
      if (!maxApplicant || parseInt(maxApplicant) < 1) errors.push("Batas maksimal volunteer wajib diisi minimal 1 orang untuk publikasi");
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
    const formattedAcceptedQuota = acceptedQuota.trim() !== "" ? parseInt(acceptedQuota, 10) : "";
    const formattedMaxApplicant = maxApplicant.trim() !== "" ? parseInt(maxApplicant, 10) : "";
    
    const data = {
      requirement: requirement || "",
      contactPerson: contactPerson || "",
      maxApplicant: formattedMaxApplicant || "",
      acceptedQuota: formattedAcceptedQuota || ""
    };
    
    debouncedUpdate(data);
  }, [requirement, contactPerson, maxApplicant, acceptedQuota, debouncedUpdate]);

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
            {/* Requirements - Updated with Publish Indicator */}
            <div>
              <label
                htmlFor="requirement"
                className="block text-sm font-medium mb-2"
              >
                Persyaratan Pendaftar <span className="text-red-500">* (Min 10 karakter untuk Publish)</span>
              </label>
              <textarea
                id="requirement"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows="4"
                placeholder="Jelaskan persyaratan yang harus dipenuhi oleh volunteer yang akan mendaftar (minimal 10 karakter untuk publikasi)"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                  !requirement || requirement.length < 10 ? "border-red-300" : ""
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {!requirement ? (
                  <p className="text-xs text-red-500">
                    Persyaratan pendaftar harus diisi
                  </p>
                ) : requirement.length < 10 ? (
                  <p className="text-xs text-red-500">
                    Persyaratan minimal 10 karakter untuk publikasi
                  </p>
                ) : (
                  <p className="text-xs text-green-600">
                    ✓ Persyaratan sudah cukup untuk publikasi
                  </p>
                )}
                <span className={`text-xs ${requirement.length < 10 ? 'text-red-500' : 'text-green-600'}`}>
                  {requirement.length}/10
                </span>
              </div>
            </div>

            {/* Contact Person - Updated with Publish Indicator */}
            <div>
              <label
                htmlFor="contact-person"
                className="block text-sm font-medium mb-2"
              >
                Contact Person <span className="text-red-500">* (Min 5 karakter untuk Publish)</span>
              </label>
              <input
                type="text"
                id="contact-person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Nomor telepon yang dapat dihubungi (WhatsApp) - minimal 5 karakter"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                  !contactPerson || contactPerson.length < 5 ? "border-red-300" : ""
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {!contactPerson ? (
                  <p className="text-xs text-red-500">
                    Contact person harus diisi
                  </p>
                ) : contactPerson.length < 5 ? (
                  <p className="text-xs text-red-500">
                    Contact person minimal 5 karakter untuk publikasi
                  </p>
                ) : (
                  <p className="text-xs text-green-600">
                    ✓ Contact person sudah cukup untuk publikasi
                  </p>
                )}
                <span className={`text-xs ${contactPerson.length < 5 ? 'text-red-500' : 'text-green-600'}`}>
                  {contactPerson.length}/5
                </span>
              </div>
            </div>

            {/* Quota Section - Updated with Publish Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="max-applicant"
                  className="block text-sm font-medium mb-2"
                >
                  Jumlah Pendaftar Maksimal <span className="text-red-500">* (Wajib untuk Publish)</span>
                </label>
                <input
                  type="number"
                  id="max-applicant"
                  value={maxApplicant}
                  onChange={(e) => setMaxApplicant(e.target.value)}
                  min="1"
                  placeholder="Contoh: 100"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white ${
                    !maxApplicant || parseInt(maxApplicant) < 1 ? "border-red-300" : ""
                  }`}
                />
                {!maxApplicant ? (
                  <p className="text-xs text-red-500 mt-1">
                    Jumlah maksimal pendaftar wajib diisi untuk publikasi
                  </p>
                ) : parseInt(maxApplicant) < 1 ? (
                  <p className="text-xs text-red-500 mt-1">
                    Minimal 1 pendaftar untuk publikasi
                  </p>
                ) : (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Jumlah maksimal pendaftar sudah sesuai
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="accepted-quota"
                  className="block text-sm font-medium mb-2"
                >
                  Kuota Volunteer yang Diterima <span className="text-gray-500">(Opsional)</span>
                </label>
                <input
                  type="number"
                  id="accepted-quota"
                  value={acceptedQuota}
                  onChange={(e) => setAcceptedQuota(e.target.value)}
                  min="0"
                  max={maxApplicant}
                  placeholder="Contoh: 50"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan jika sama dengan jumlah pendaftar maksimal
                </p>
                {acceptedQuota && maxApplicant && parseInt(acceptedQuota) > parseInt(maxApplicant) && (
                  <p className="text-xs text-red-500 mt-1">
                    Kuota diterima tidak boleh lebih dari jumlah pendaftar maksimal
                  </p>
                )}
              </div>
            </div>

            {/* Publish Status Indicator */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status Volunteer untuk Publikasi:</h4>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center ${requirement && requirement.length >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={requirement && requirement.length >= 10 ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {requirement && requirement.length >= 10 ? "Persyaratan sudah lengkap" : "Persyaratan belum lengkap (min 10 karakter)"}
                </div>
                <div className={`flex items-center ${contactPerson && contactPerson.length >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={contactPerson && contactPerson.length >= 5 ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {contactPerson && contactPerson.length >= 5 ? "Contact person sudah lengkap" : "Contact person belum lengkap (min 5 karakter)"}
                </div>
                <div className={`flex items-center ${maxApplicant && parseInt(maxApplicant) >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon 
                    icon={maxApplicant && parseInt(maxApplicant) >= 1 ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className="mr-1" 
                  />
                  {maxApplicant && parseInt(maxApplicant) >= 1 ? "Jumlah pendaftar sudah diset" : "Jumlah pendaftar belum diset (min 1)"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Volunteer.displayName = "Volunteer";

export default Volunteer;