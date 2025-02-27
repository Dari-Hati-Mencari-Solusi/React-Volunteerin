import React from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo_volunteerin.jpg";
import ErrorAlert from "../../components/Elements/Alert/ErrorAlert";
import SuccessAlert from "../../components/Elements/Alert/SuccesAlert";
import WhatsAppButton from "../../components/Elements/buttons/BtnWhatsapp";
import { useForm } from '../../hooks/useForm';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility';

const RegisterPartner = () => {
  const navigate = useNavigate();
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
  
  const {
    formData,
    error,
    success,
    isSubmitting,
    handleInputChange,
    setIsSubmitting,
    setStatus
  } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
      setStatus('error', 'Semua field harus diisi!');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus('error', 'Format email tidak valid!');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setStatus('error', 'Kata sandi minimal 8 karakter!');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus('error', 'Kata sandi tidak cocok!');
      setIsSubmitting(false);
      return;
    }

    // Validate phone number format
    if (!/^[0-9]+$/.test(formData.phoneNumber)) {
      setStatus('error', 'Nomor telepon hanya boleh berisi angka!');
      setIsSubmitting(false);
      return;
    }

    // Validate phone number starts with '0'
    if (!formData.phoneNumber.startsWith('0')) {
      setStatus('error', 'Nomor telepon harus diawali dengan 0!');
      setIsSubmitting(false);
      return;
    }

    // Format phone number to ensure it starts with "62"
    let formattedPhone = '62' + formData.phoneNumber.slice(1);

    try {
      await authService.registerPartner({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formattedPhone,
        role: 'PARTNER'
      });
      setStatus('success', 'Registrasi berhasil! Silakan login.');
      setTimeout(() => {
        navigate('/login-partner');
      }, 1500);
    } catch (err) {
      setStatus('error', err.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="lg:py-3 md:py-3 py-8">
        <img
          src={logo}
          alt="logo volunteerin"
          className="lg:w-[295px] lg:h-[64px] md:w-[295px] md:h-[64px] w-[250px] h-[50px]"
        />
      </div>
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0a3e54] mb-2">
            Volunteerin Partner
          </h1>
          <p className="text-[#0a3e54] text-lg">Daftar Sebagai Partner</p>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-700 block font-medium">
              Nama Penyelenggara
            </label>
            <input
              type="text"
              name="name"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
              placeholder="Masukkan nama penyelenggara"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block font-medium">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
              placeholder="Contoh: johndoe@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block font-medium">
              No. Handphone
            </label>
            <input
              type="tel"
              name="phoneNumber"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
              placeholder="Contoh: 081234567890"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block font-medium">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
                placeholder="Minimal 8 karakter"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            <label className="text-gray-700 block font-medium">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
                placeholder="Konfirmasi kata sandi"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <Icon icon="mdi:eye-off" className="w-5 h-5" />
                ) : (
                  <Icon icon="solar:eye-outline" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0a3e54] text-white py-3 rounded-lg font-medium hover:bg-[#0a3e54]/90 transition-colors disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Daftar"}
          </button>

          <div className="text-center text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login-partner"
              className="text-[#0a3e54] hover:text-[#0a3e54]/80"
            >
              Masuk sebagai Partner
            </Link>
          </div>
        </form>
      </div>
      <WhatsAppButton phoneNumber="+6285343037191" />
    </div>
  );
};

export default RegisterPartner;
