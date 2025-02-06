import React, { useState } from "react";
import logo from "../../assets/images/Logo_volun.png";
import { Link } from "react-router-dom";
import { AlignRight } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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
          <div className="flex items-center pt-2">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <img src={logo} alt="logo volunteerin" className="w-48" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-12 text-md">
                <li>
                  <Link
                    to="/"
                    className="text-black transition text-[13px] hover:text-[#0A3E54] font-medium uppercase"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("event")}
                      className="text-black transition hover:text-[#0A3E54] flex items-center gap-1 text-[13px] uppercase font-medium"
                    >
                      Event
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform ${
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
                        <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Lingkungan
                        </Link>
                        <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Sosial
                        </Link>
                        <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Pendidikan
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
                <li>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("hubungiKami")}
                      className="text-black transition hover:text-[#0A3E54] flex items-center gap-1 font-medium text-[13px] uppercase"
                    >
                      Hubungi Kami
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === "hubungiKami" ? "rotate-180" : ""
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
                    {openDropdown === "hubungiKami" && (
                      <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                        <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Cs
                        </Link>
                        <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Cs Partner
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          {/* Login/Register and Hamburger Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <Link
                to="/login-landing"
                className="rounded-[18px] bg-white px-6 py-2.5 text-sm font-medium text-[#0A3E54] hover:text-white transition ease-in-out duration-300 hover:bg-[#0A3E54]"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-[18px] bg-[#0A3E54] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0A3E54]/90"
              >
                Daftar
              </Link>
            </div>

            {/* Hamburger Button */}
            <div className="block md:hidden">
              <button
                className="p-2 text-gray-600 transition hover:text-gray-600/75"
                onClick={toggleMenu}
              >
                <AlignRight size={32} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 left-0 w-full bg-white shadow-lg transform transition-transform duration-700 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              className=" p-2 text-gray-600 transition hover:text-gray-600/75"
              onClick={toggleMenu}
            >
              <AlignRight size={32} strokeWidth={3} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav aria-label="Global" className="p-4">
            <ul className="flex flex-col gap-6 text-md">
              <li>
                <Link
                  to="/"
                  className="transition text-black hover:text-[#0A3E54] duration-200 ease-in-out"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("event")}
                    className="w-full transition text-black hover:text-[#0A3E54] duration-200 ease-in-out flex items-center justify-between"
                  >
                    <span>Event</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${
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
                    <div className="mt-2 bg-white rounded-lg py-2 z-50">
                      <Link
                        to="/event"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Semua Event
                      </Link>
                      <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Lingkungan
                      </Link>
                      <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Community
                      </Link>
                    </div>
                  )}
                </div>
              </li>
              <li>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("hubungiKami")}
                    className="w-full transition text-black hover:text-[#0A3E54] duration-200 ease-in-out flex items-center justify-between"
                  >
                    <span>Hubungi Kami</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === "hubungiKami" ? "rotate-180" : ""
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
                  {openDropdown === "hubungiKami" && (
                    <div className="mt-2 bg-white rounded-lg py-2 z-50">
                      <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Email
                      </Link>
                      <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Telepon
                      </Link>
                    </div>
                  )}
                </div>
              </li>
              <li className="flex gap-4 mt-4">
                <Link
                  to="/login-landing"
                  className="flex-1 rounded-md text-center bg-white border-2 border-[#0A3E54] px-5 py-2.5 text-sm font-medium text-[#0A3E54] hover:text-white transition ease-in-out duration-300 shadow hover:bg-[#0A3E54]"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="flex-1 rounded-md bg-[#0A3E54] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0A3E54]/90 text-center"
                >
                  Daftar
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
