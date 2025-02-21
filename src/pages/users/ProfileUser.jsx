import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";

const ProfileUser = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] text-xl font-medium">
            Pengaturan Akun
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>
        <div className="mx-auto space-y-6">
          <div className="space-y-4">
            <div className="bg-[#FBFBFB] p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="bxs:user"
                  width="24"
                  height="24"
                  className="text-[#0A3E54]"
                />
                <h2 className="text-xl font-medium text-[#0A3E54]">
                  Akun Saya
                </h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>
              <h3 className="text-lg mb-2 font-medium">
                Informasi Profil Anda
              </h3>
              <p className="text-md text-[#A1A1A1] mb-4">
                Lengkapi data diri anda, yuk.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Nama Lengkap</label>
                  <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]" />
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                    placeholder="Alamat telah terdaftar"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Bio Anda</label>
                  <textarea className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]" rows={4} />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    No. Handphone (WhatsApp)
                  </label>
                  <input type="tel" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]" />
                  <button className="mt-6 px-12 py-3 bg-[#0A3E54] text-white rounded-[12px]">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <div className="bg-[#FBFBFB] p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-[#0A3E54]">
                <Icon icon="si:lock-fill" width="24" height="24" />
                <h2 className="text-xl font-medium text-[#0A3E54]">
                  Kata Sandi
                </h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>

              <h3 className="text-lg mb-2 font-medium">Ubah Kata Sandi</h3>
              <p className="text-md text-[#A1A1A1] mb-4">
                Pastikan akun kamu menggunakan kata sandi yang kuat dan aman.
              </p>
              <div className="gap-4 md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 block">
                <div>
                  <label className="block text-sm mb-2">Kata Sandi Lama</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      className="w-full p-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                    />
                    <button
                      className="absolute right-2 top-2.5"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      <Icon
                        icon={showOldPassword ? "heroicons:eye-slash" : "heroicons:eye"}
                        className="w-5 h-5 text-gray-500"
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Kata Sandi Baru</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full p-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                    />
                    <button
                      className="absolute right-2 top-2.5"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Icon
                        icon={showNewPassword ? "heroicons:eye-slash" : "heroicons:eye"}
                        className="w-5 h-5 text-gray-500"
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full p-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                    />
                    <button
                      className="absolute right-2 top-2.5"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Icon
                        icon={showConfirmPassword ? "heroicons:eye-slash" : "heroicons:eye"}
                        className="w-5 h-5 text-gray-500"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button className="mt-6 px-10 py-3 bg-[#0A3E54] text-white rounded-xl">
                Ubah Sandi
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default ProfileUser;