import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo_volunteerin.jpg';
import SuccessAlert from '../components/Elements/Alert/SuccesAlert';
import ErrorAlert from '../components/Elements/Alert/ErrorAlert';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // Get the token from the URL

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setError('');
    setSuccess('');

    if (!formData.password || !formData.confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi harus diisi!');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi tidak sama!');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter!');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('YOUR_RESET_PASSWORD_API_ENDPOINT', {
        ...formData,
        token: token, // Include the token in the request
      });

      if (!response.data.success) {
        setError(response.data.message || 'Terjadi kesalahan saat mereset kata sandi!');
      } else {
        setSuccess('Kata sandi berhasil direset!');
        setIsSubmitting(false);
        navigate('/login'); // Redirect to login page after successful password reset
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mereset kata sandi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8 md:gap-0">
        {/* Left Column (Logo and Description) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-12">
          <img src={logo} alt="Volunteerin Logo" className="w-48 md:w-64 mb-4 md:mb-8" />
          <h2 className="text-lg md:text-xl font-semibold text-[#0a3e54] mb-3 md:mb-4">
            Slogan Volunteerin
          </h2>
          <p className="text-sm md:text-base text-[#0a3e54] text-center leading-relaxed max-w-sm">
            Dengan platform volunteer kami, kamu bisa menemukan berbagai peluang relawan sesuai minat dan keahlianmu.
          </p>
        </div>

        {/* Right Column (Reset Password Form) */}
        <div className="w-full md:w-5/6 lg:w-3/4 bg-white p-6 md:p-12 rounded-xl relative shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-[#0a3e54] mb-6 md:mb-8">
           Reset Kata Sandi
          </h2>
          <ErrorAlert message={error} />
          <SuccessAlert message={success} />
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0a3e54] mb-1.5 md:mb-2">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a3e54] focus:border-transparent text-sm md:text-base shadow-[0_2px_4px_0_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_0_rgba(0,0,0,0,0.04)] transition-shadow duration-300"
                placeholder="Masukkan kata sandi baru"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0a3e54] mb-1.5 md:mb-2">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a3e54] focus:border-transparent text-sm md:text-base shadow-[0_2px_4px_0_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] transition-shadow duration-300"
                placeholder="Konfirmasi kata sandi baru"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0a3e54] text-white py-2.5 md:py-3 rounded-lg hover:bg-[#0a3e54]/90 text-sm md:text-base font-medium shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Reset Kata Sandi
            </button>
          </form>
          <div className="mt-4 md:mt-6 text-xs md:text-sm text-center">
            <span className="text-[#0a3e54]">Sudah punya akun? </span>
            <a href="/login" className="text-[#0a3e54] font-semibold hover:underline hover:text-[#0a3e54]/80 transition-colors">
              Masuk di sini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;