import React from "react";
import logo from "../../assets/images/logo_remove.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0A3E54]">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-start text-teal-600">
              <img src={logo} alt="gambar logo" className="w-48" />
            </div>

            <p className="mt-6 max-w-md text-start leading-relaxed text-white sm:max-w-xs sm:text-left">
              Temukan Peluangmu, Tunjukan Aksimu
            </p>

            <ul className="mt-8 flex justify-start gap-6 md:gap-8">
              <li>
                <a
                  href="https://www.instagram.com/volunteerin.id/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://www.youtube.com/@Volunteerin"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Youtube</span>
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-start sm:text-left">
              <p className="text-lg font-medium text-white">Tentang Kami</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="/"
                  >
                    Beranda
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="/login"
                  >
                    Aktivitas
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="/layanan"
                  >
                    Layanan
                  </Link>
                </li>

                <li>
                  <a
                    className="text-white transition hover:text-white/75"
                    href="#"
                  >
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-start sm:text-left">
              <p className="text-lg font-medium text-white">Our Services</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="https://api.whatsapp.com/send/?phone=6285343037191&text&type=phone_number&app_absent=0"
                  >
                    Customer Support
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="https://api.whatsapp.com/send/?phone=6285343037191&text&type=phone_number&app_absent=0"
                  >
                    Panduan Partner
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-start sm:text-left">
              <p className="text-lg font-medium text-white">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="/login"
                  >
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="/register"
                  >
                    Buat Akun
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white transition hover:text-white/75"
                    to="/register-partner"
                  >
                    Gabung Partnership
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-start sm:text-left">
              <p className="text-lg font-medium text-white">Hubungi Kami</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="flex items-center flex-wrap gap-1.5 justify-center sm:justify-start"
                    href="mailto:volunteerinbusiness@gmail.com"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>

                    <span className="flex-1 text-white text-xs sm:text-sm break-all">
                      volunteerinbusiness@gmail.com
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 sm:justify-start"
                    href="tel:+6285343037191"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>

                    <span className="flex-1 text-white">085343037191</span>
                  </a>
                </li>

                <li className="flex items-start justify-center gap-1.5 sm:justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 shrink-0 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <address className="-mt-0.5 flex-1 not-italic text-white">
                    Daerah Istimewa Yogyakarta, Indonesia
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-start sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-white">
              <span className="block sm:inline">All rights reserved.</span>

              <a
                className="inline-block text-white underline transition hover:text-white/75"
                href="#"
              >
                Terms & Conditions
              </a>

              <span>&middot;</span>

              <a
                className="inline-block text-white underline transition hover:text-white/75"
                href="#"
              >
                Privacy Policy
              </a>
            </p>

            <p className="mt-4 text-sm text-white sm:order-first sm:mt-0">
              &copy; Volunteerin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;