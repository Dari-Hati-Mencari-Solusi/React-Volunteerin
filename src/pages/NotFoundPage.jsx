import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0A3E54] flex flex-col justify-center items-center text-white">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl mt-4">Oops! Halaman tidak ditemukan.</p>
      <p className="text-lg mt-2">
        Sepertinya Anda tersesat. Mari kembali ke beranda.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;
