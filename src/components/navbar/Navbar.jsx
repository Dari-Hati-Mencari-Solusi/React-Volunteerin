import React, { useState } from "react";
import { Icon } from '@iconify/react';
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo_volunteerin.jpg";
import { Link } from "react-router-dom";
import { AlignRight } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth(); // Get user from AuthContext
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Function to get only the first name from the user's full name
  const getFirstName = () => {
    if (user && user.name) {
      // Split the name by spaces and return the first part
      const nameParts = user.name.split(' ');
      return nameParts[0]; // Return just the first name
    }
    return 'User'; // Fallback if no user name is available
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  return (
    <nav className="bg-white fixed w-full z-50 border-b border-gray-200">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="block text-teal-600">
              <span className="sr-only">Home</span>
              <img src={logo} alt="logo volunteerin" className="w-48" />
            </Link>
          </div>

          {/* Desktop Navigation - Only visible on large screens */}
          <div className="hidden lg:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-12 text-md">
                <li>
                  <Link
                    to="/"
                    className="text-black transition text-md hover:text-[#0A3E54] font-normal"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("event")}
                      className="text-black transition hover:text-[#0A3E54] flex items-center gap-1 text-md font-normal"
                    >
                      Aktivitas
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          openDropdown === "event" ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {openDropdown === "event" && (
                      <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                        <Link
                          to="/event"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Semua Event
                        </Link>
                        <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Lingkungan
                        </Link>
                        <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Sosial
                        </Link>
                        <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Pendidikan
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
                <li>
                  <Link
                    to="/hubungi-kami"
                    className="text-black transition text-md hover:text-[#0A3E54] font-normal"
                  >
                    Hubungi Kami
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Login/Register and Hamburger Button */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-4 items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/notifications" className="text-gray-600 hover:text-[#0A3E54]">
                    <Icon icon="mdi:bell-outline" className="w-6 h-6" />
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2">
                    <div className="flex items-center bg-[#0A3E54] text-white rounded-full px-4 py-2">
                      <Icon icon="mdi:account" className="w-6 h-6 mr-2" />
                      <span className="font-medium">{getFirstName()}</span>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/auth"
                    className="rounded-xl bg-white border-[1.5px] border-[#0A3E54] px-6 py-2.5 text-md font-normal text-[#0A3E54] hover:text-white transition ease-in-out duration-300 hover:bg-[#0A3E54]"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/auth"
                    className="rounded-xl bg-[#0A3E54] px-6 py-2.5 text-md font-normal text-white hover:bg-[#0A3E54]/90"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger Button - Visible on mobile and tablet */}
            <div className="block lg:hidden">
              <button
                className="p-0 text-gray-600 transition hover:text-gray-600/75"
                onClick={toggleMenu}
              >
                <AlignRight size={32} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 left-0 w-full bg-white shadow-lg transform transition-transform duration-700 ease-in-out overflow-y-auto ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <Link to="/" className="block">
              <img src={logo} alt="logo volunteerin" className="w-48" />
            </Link>
            
            <button
              className="p-2 text-gray-600 transition hover:text-gray-600/75"
              onClick={toggleMenu}
            >
              <AlignRight size={32} strokeWidth={3} />
            </button>
          </div>

          <nav aria-label="Global" className="p-4">
            <ul className="flex flex-col gap-6">
              <li>
                <Link
                  to="/"
                  className="transition text-black hover:text-[#0A3E54] duration-200 ease-in-out text-md md:text-xl font-normal"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("event")}
                    className="w-full transition text-black hover:text-[#0A3E54] duration-200 text-md md:text-xl ease-in-out flex items-center justify-between"
                  >
                    <span>Aktivitas</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${
                        openDropdown === "event" ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {openDropdown === "event" && (
                    <div className="mt-2 bg-white rounded-lg py-2 z-50 text-md md:text-xl">
                      <Link
                        to="/event"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Semua Event
                      </Link>
                      <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Lingkungan
                      </Link>
                      <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Sosial
                      </Link>
                      <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Pendidikan
                      </Link>
                    </div>
                  )}
                </div>
              </li>
              <li>
                <Link
                  to="/hubungi-kami"
                  className="transition text-black hover:text-[#0A3E54] duration-200 ease-in-out text-md md:text-xl font-normal"
                >
                  Hubungi Kami
                </Link>
              </li>
              {!isAuthenticated ? (
                <li className="flex gap-4 mt-4">
                  <Link
                    to="/auth"
                    className="flex-1 rounded-xl text-center bg-white border-2 border-[#0A3E54] px-5 py-2.5 text-md md:text-xl font-medium text-[#0A3E54] hover:text-white transition ease-in-out duration-300 shadow hover:bg-[#0A3E54]"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/auth"
                    className="flex-1 rounded-md bg-[#0A3E54] px-5 py-2.5 text-md md:text-xl font-medium text-white hover:bg-[#0A3E54]/90 text-center"
                  >
                    Daftar
                  </Link>
                </li>
              ) : (
                <li className="mt-4">
                  <div className="flex items-center justify-between">
                    <Link to="/notifications" className="text-gray-600 hover:text-[#0A3E54]">
                      <Icon icon="mdi:bell-outline" className="w-6 h-6" />
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2">
                      <div className="flex items-center bg-[#0A3E54] text-white rounded-full px-4 py-2">
                        <Icon icon="mdi:account" className="w-6 h-6 mr-2" />
                        <span className="font-medium">{getFirstName()}</span>
                      </div>
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;