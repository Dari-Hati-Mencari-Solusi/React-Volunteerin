import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-[#0A3E54] mb-4">
            <Icon icon="line-md:alert-circle" width="180" height="180" />
          </div>

          <h1 className="text-6xl font-bold text-[#0A3E54]">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mt-2 text-gray-600 max-w-sm">
            Maaf, halaman yang Anda cari tidak ditemukan.
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-[#0A3E54] hover:bg-[#164D63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A3E54] transition-colors"
            >
              <Icon icon="heroicons-outline:home" className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Jika Anda merasa ini kesalahan, silakan hubungi tim kami di{" "}
            <a
              href="mailto:volunteerinbusiness@gmail.com"
              className="text-[#0A3E54] hover:underline"
            >
              volunteerinbusiness@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
