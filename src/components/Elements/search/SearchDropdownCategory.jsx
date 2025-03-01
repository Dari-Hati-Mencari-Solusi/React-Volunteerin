import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

const SearchDropdownCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const dropdownRef = useRef(null);

  // Daftar kategori
  const categories = [
    "Semua Event",
    "Lingkungan",
    "Sosial",
    "Pendidikan",
  ];

  // Filter kategori berdasarkan input pencarian
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menutup dropdown saat klik di luar komponen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      {/* Tombol untuk membuka dropdown */}
      <button
        className="bg-white border-[1.5px] border-[#0A3E54] text-[#0A3E54] py-[10px] font-medium px-4 rounded-[12px] flex items-center gap-2 w-full md:w-[170px] justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedCategory || "Pilih Kategori"}
        </span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute mt-2 w-full md:w-[170px] right-0 bg-white border border-gray-300 rounded-[12px] shadow-lg overflow-hidden z-50">
          {/* Input pencarian */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari kategori..."
                className="bg-transparent outline-none w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Daftar kategori */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-md font-normal"
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                >
                  {category}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                Tidak ada kategori ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdownCategory;