import React, { useState } from 'react';
import logo from '../../assets/images/logo_volunteerin.jpg';
import { EyeIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorAlert from '../../components/Elements/Alert/ErrorAlert';
import SuccessAlert from '../../components/Elements/Alert/SuccesAlert';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'user@gmail.com',
    password: 'user123',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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

    if (!formData.email || !formData.password) {
      setError('Maaf, Email atau kata sandi anda salah!');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Maaf, Email atau kata sandi anda salah!');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('YOUR_LOGIN_API_ENDPOINT', formData);

      if (!response.data.success) {
        setError('Maaf, Email atau kata sandi anda salah!');
      } else {
        setSuccess('Anda berhasil masuk!');
        setIsSubmitting(false);
        navigate('/profile'); // Redirect to ProfileUser.jsx after successful login
      }
    } catch (err) {
      setError('Maaf, Email atau kata sandi anda salah!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8 md:gap-0">
        {/* Left Column (Logo and Description) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-12">
          <img 
            src={logo} 
            alt="Volunteerin Logo" 
            className="w-48 md:w-64 mb-4 md:mb-8 " 
          />
          <h2 className="text-lg md:text-xl font-semibold text-[#0a3e54] mb-3 md:mb-4">
            Slogan Volunteerin
          </h2>
          <p className="text-sm md:text-base text-[#0a3e54] text-center leading-relaxed max-w-sm">
            Dengan platform volunteer kami, kamu bisa menemukan berbagai peluang relawan sesuai minat dan keahlianmu.
          </p>
        </div>

        {/* Right Column (Login Form) */}
        <div className="w-full md:w-5/6 lg:w-3/4 bg-white p-6 md:p-12 rounded-xl relative shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-[#0a3e54] mb-6 md:mb-8">
            Masuk
          </h2>
          <ErrorAlert message={error} />
          <SuccessAlert message={success} />
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#0a3e54] mb-1.5 md:mb-2"
              >
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#0a3e54] focus:border-transparent
                text-sm md:text-base shadow-[0_2px_4px_0_rgba(0,0,0,0.02)] 
                hover:shadow-[0_2px_8px_0_rgba(0,0,0,0,0.04)] transition-shadow duration-300"
                placeholder="Contoh: johndoe@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5 md:mb-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-[#0a3e54]"
                >
                  Kata Sandi
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs md:text-sm text-[#0a3e54] hover:underline hover:text-[#0a3e54]/80 transition-colors"
                >
                  Lupa Kata Sandi
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#0a3e54] focus:border-transparent
                  text-sm md:text-base shadow-[0_2px_4px_0_rgba(0,0,0,0.02)] 
                  hover:shadow-[0_2px_8px_0_rgba(0,0,0,0,0.04)] transition-shadow duration-300"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 
                  hover:text-[#0a3e54]/80 transition-colors p-1 rounded-full
                  hover:bg-gray-100/80"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0a3e54]" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#0a3e54] text-white py-2.5 md:py-3 rounded-lg 
              hover:bg-[#0a3e54]/90 transition-all text-sm md:text-base font-medium
              shadow-[0_2px_4px_0_rgba(0,0,0,0,0.05)] 
              hover:shadow-[0_4px_12px_0_rgba(0,0,0,0,0.1)] 
              active:shadow-[0_2px_4px_0_rgba(0,0,0,0,0.1)]
              transform hover:-translate-y-0.5 active:translate-y-0 
              transition-all duration-300"
            >
              Masuk
            </button>
          </form>
          <div className="mt-4 md:mt-6 text-xs md:text-sm text-center">
            <span className="text-[#0a3e54]">Belum punya akun? </span>
            <Link to="/register" className="text-[#0a3e54] font-semibold hover:underline hover:text-[#0a3e54]/80 transition-colors">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;