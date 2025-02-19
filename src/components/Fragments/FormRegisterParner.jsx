import React, { useState } from "react";
import { Icon } from "@iconify/react";

const RegisterForm = ({
  onSubmit,
  isSubmitting,
  error,
  formData,
  onFormChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-gray-700">
          Nama Penyelenggara
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Masukkan nama penyelenggara"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-gray-700">
          Alamat Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Contoh: johndoe@gmail.com"
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]`}
          value={formData.email}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-gray-700">
            Kata Sandi
          </label>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Masukkan kata sandi"
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]`}
            value={formData.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <Icon icon="mdi:eye-off" className="w-5 h-5" />
            ) : (
              <Icon icon="solar:eye-outline" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-gray-700">
          Konfirmasi Kata Sandi
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Konfirmasi kata sandi"
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? (
              <Icon icon="mdi:eye-off" className="w-5 h-5" />
            ) : (
              <Icon icon="solar:eye-outline" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-gray-700">
          No. Handphone
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="Masukkan nomor handphone"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full md:w-[150px] lg:w-[150px] flex justify-center items-center gap-2 bg-[#0A3E54] text-white py-2 rounded-xl font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memproses..." : "Selanjutnya"}
          <Icon
            icon="weui:arrow-filled"
            width="12"
            height="24"
            className="pt-1"
          />
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
