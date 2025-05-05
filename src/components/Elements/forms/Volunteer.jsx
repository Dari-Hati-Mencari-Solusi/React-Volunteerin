import React, { useState } from "react";
import { Icon } from "@iconify/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Volunteer = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [quota, setQuota] = useState("");
  const [maxRegistrants, setMaxRegistrants] = useState("");
  const [contactPerson, setContactPerson] = useState("088725328329");
  const [requirements, setRequirements] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 cursor-pointer rounded-t-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Volunteer</h2>
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
                Kuota Diterima <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Masukkan dalam format angka"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maksimal Pendaftar <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Masukkan dalam format angka"
                value={maxRegistrants}
                onChange={(e) => setMaxRegistrants(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Persyaratan Pendaftar <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={requirements}
                onChange={setRequirements}
                modules={modules}
                formats={formats}
                placeholder="Tulis persyaratan pendaftar di sini..."
                className="bg-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
