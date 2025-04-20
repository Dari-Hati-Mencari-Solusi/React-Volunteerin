import React from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo_volunteerin.jpg';
import ErrorAlert from '../components/Elements/Alert/ErrorAlert';
import SuccessAlert from '../components/Elements/Alert/SuccesAlert';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('t');
  
  console.log("Token from URL parameters:", token); // Logging token

  const { showPassword: showPassword1, togglePasswordVisibility: togglePasswordVisibility1 } = usePasswordVisibility();
  const { showPassword: showPassword2, togglePasswordVisibility: togglePasswordVisibility2 } = usePasswordVisibility();
  
  const {
    formData,
    error,
    success,
    isSubmitting,
    handleInputChange,
    setIsSubmitting,
    setStatus
  } = useForm({
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Form data:", formData);

    if (!formData.password || !formData.confirmPassword) {
      setStatus('error', 'Semua field harus diisi!');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus('error', 'Kata sandi tidak cocok!');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setStatus('error', 'Kata sandi minimal 6 karakter!');
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setStatus('error', 'Token reset password tidak valid atau telah kadaluarsa');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Sending request to confirmPasswordReset with token:", token);
      const response = await authService.confirmPasswordReset(token, formData.password);
      console.log("Response from confirmPasswordReset:", response);
      setStatus('success', 'Kata sandi berhasil diubah!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      setStatus('error', err.message || 'Gagal mengubah kata sandi. Token mungkin tidak valid atau telah kadaluarsa.');
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
            Reset Kata Sandi
          </h1>
          <p className="text-[#0a3e54] text-lg">Masukkan kata sandi baru Anda</p>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-700 block font-medium">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showPassword1 ? "text" : "password"}
                name="password"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
                placeholder="Masukkan kata sandi baru"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword1 ? (
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
                type={showPassword2 ? "text" : "password"}
                name="confirmPassword"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
                placeholder="Konfirmasi kata sandi baru"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility2}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword2 ? (
                  <Icon icon="mdi:eye-off" className="w-5 h-5" />
                ) : (
                  <Icon icon="solar:eye-outline" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0a3e54] text-white py-3 rounded-lg font-medium hover:bg-[#0a3e54]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Reset Kata Sandi"}
          </button>

          <div className="text-center text-gray-600">
            Kembali ke{" "}
            <Link to="/login" className="text-[#0a3e54] font-medium hover:underline">
              halaman login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;