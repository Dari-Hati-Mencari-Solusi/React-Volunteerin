import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo_volunteerin.jpg";
import ErrorAlert from "../../components/Elements/Alert/ErrorAlert";
import SuccessAlert from "../../components/Elements/Alert/SuccesAlert";
import WhatsAppButton from "../../components/Elements/buttons/BtnWhatsapp";
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility';

const LoginPartner = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get state from registration page
  const { login: authLogin } = useAuth();
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
    email: '',
    password: '',
  });

  // Display registration success message if coming from registration page
  useEffect(() => {
    if (location.state?.message) {
      setStatus('success', location.state.message);
      // Remove state to prevent message showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setStatus('error', 'Email dan kata sandi harus diisi!');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus('error', 'Format email tidak valid!');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await authService.loginPartner(formData.email, formData.password);
      
      // Check for email verification status if returned by the API
      if (response.requiresVerification) {
        setStatus('error', 'Email belum diverifikasi. Silakan cek email Anda untuk link verifikasi.');
        setIsSubmitting(false);
        return;
      }
      
      authLogin(response.user);
      setStatus('success', 'Login berhasil!');
      setTimeout(() => {
        navigate('/partner/dashboard');
      }, 1500);
    } catch (err) {
      // Check error messages related to email verification
      if (err.message?.toLowerCase().includes('verifikasi') || 
          err.message?.toLowerCase().includes('verify') || 
          err.message?.toLowerCase().includes('aktif')) {
        setStatus('error', 'Email belum diverifikasi. Silakan cek email Anda untuk link verifikasi.');
        
        // Add option to resend verification email
        setTimeout(() => {
          const shouldResend = window.confirm('Apakah Anda ingin mengirim ulang email verifikasi?');
          if (shouldResend && formData.email) {
            authService.resendVerificationEmail(formData.email)
              .then(() => setStatus('success', 'Email verifikasi telah dikirim ulang.'))
              .catch(e => setStatus('error', e.message || 'Gagal mengirim ulang email verifikasi.'));
          }
        }, 1000);
      } else {
        setStatus('error', err.message || 'Email atau kata sandi salah!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="lg:py-3 md:py-3 py-8">
        <Link to="/">
        <img
          src={Logo}
          alt="logo volunteerin"
          className="lg:w-[295px] lg:h-[64px] md:w-[295px] md:h-[64px] w-[250px] h-[50px]"
        />
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0a3e54] mb-2">
            Volunteerin Partner
          </h1>
          <p className="text-[#0a3e54] text-lg">Masuk Sebagai Partner</p>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center">
              <label className="text-gray-700 block font-medium">
                Kata Sandi
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#0a3e54] hover:text-[#0a3e54]/80"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white`}
                placeholder="Masukkan kata sandi"
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

          <button
            type="submit"
            className="w-full bg-[#0A3E54] text-white py-3 rounded-lg font-medium hover:bg-[#0A3E54]/90 transition-colors disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>

          <div className="text-center text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register-partner"
              className="text-[#14464B] font-medium hover:underline"
            >
              Daftar sebagai Partner
            </Link>
          </div>
        </form>
      </div>
      <WhatsAppButton phoneNumber="+6285343037191" />
    </div>
  );
};

export default LoginPartner;