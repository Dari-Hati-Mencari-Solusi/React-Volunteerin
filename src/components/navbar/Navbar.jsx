import React, { useState } from "react";
import logo from "../../assets/images/Logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isKategoriDropdownOpen, setIsKategoriDropdownOpen] = useState(false);
  const [isHubungiKamiDropdownOpen, setIsHubungiKamiDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleKategoriDropdown = () => {
    setIsKategoriDropdownOpen(!isKategoriDropdownOpen);
  };

  const toggleHubungiKamiDropdown = () => {
    setIsHubungiKamiDropdownOpen(!isHubungiKamiDropdownOpen);
  };

  return (
    <nav className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <img src={logo} alt="logo volunteerin" className="w-48" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a
                    className="text-black transition hover:text-gray-500/75"
                    href="#"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    className="text-black transition hover:text-gray-500/75"
                    href="#"
                  >
                    Event
                  </a>
                </li>
                <li>
                  <div className="relative">
                    <button
                      onClick={toggleKategoriDropdown}
                      className="text-black transition hover:text-gray-500/75 flex items-center gap-1"
                    >
                      Kategori
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform ${
                          isKategoriDropdownOpen ? "rotate-180" : ""
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
                    {isKategoriDropdownOpen && (
                      <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Web Development
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Mobile Development
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          SEO
                        </a>
                      </div>
                    )}
                  </div>
                </li>
                <li>
                  <div className="relative">
                    <button
                      onClick={toggleHubungiKamiDropdown}
                      className="text-black transition hover:text-gray-500/75 flex items-center gap-1"
                    >
                      Hubungi Kami
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform ${
                          isHubungiKamiDropdownOpen ? "rotate-180" : ""
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
                    {isHubungiKamiDropdownOpen && (
                      <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Email
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Telepon
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          {/* Login/Register and Hamburger Button */}
          <div className="flex items-center gap-4">
            {/* Tombol Masuk dan Daftar hanya untuk desktop */}
            <div className="hidden md:flex gap-4">
              <a
                className="rounded-md bg-white border-[1.5px] border-[#0A3E54] px-5 py-2.5 text-sm font-medium text-[#0A3E54] hover:text-white transition ease-in-out duration-300 shadow hover:bg-[#0A3E54]"
                href="#"
              >
                Masuk
              </a>
              <a
                className="rounded-md bg-[#0A3E54] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0A3E54]/90"
                href="#"
              >
                Daftar
              </a>
            </div>

            {/* Hamburger Button */}
            <div className="block md:hidden">
              <button
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                onClick={toggleMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
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
              className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav aria-label="Global" className="p-4">
            <ul className="flex flex-col gap-6 text-sm">
              <li>
                <a
                  className="transition text-black hover:text-gray-500 duration-200 ease-in-out"
                  href="#"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  className="transition text-black hover:text-gray-500 duration-200 ease-in-out"
                  href="#"
                >
                  Event
                </a>
              </li>
              <li>
                <div className="relative">
                  <button
                    onClick={toggleKategoriDropdown}
                    className="w-full transition text-black hover:text-gray-500 duration-200 ease-in-out flex items-center justify-between"
                  >
                    <span>Kategori</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${
                        isKategoriDropdownOpen ? "rotate-180" : ""
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
                  {isKategoriDropdownOpen && (
                    <div className="mt-2 bg-white rounded-lg py-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Web Development
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Mobile Development
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        SEO
                      </a>
                    </div>
                  )}
                </div>
              </li>
              <li>
                <div className="relative">
                  <button
                    onClick={toggleHubungiKamiDropdown}
                    className="w-full transition text-black hover:text-gray-500 duration-200 ease-in-out flex items-center justify-between"
                  >
                    <span>Hubungi Kami</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${
                        isHubungiKamiDropdownOpen ? "rotate-180" : ""
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
                  {isHubungiKamiDropdownOpen && (
                    <div className="mt-2 bg-white rounded-lg py-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Email
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Telepon
                      </a>
                    </div>
                  )}
                </div>
              </li>
              <li className="flex gap-4 mt-4">
                <a
                  className="flex-1 rounded-md text-center bg-white border-2 border-[#0A3E54] px-5 py-2.5 text-sm font-medium text-[#0A3E54] hover:text-white transition ease-in-out duration-300 shadow hover:bg-[#0A3E54]"
                  href="#"
                >
                  Masuk
                </a>
                <a
                  className="flex-1 rounded-md bg-[#0A3E54] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0A3E54]/90 text-center"
                  href="#"
                >
                  Daftar
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;