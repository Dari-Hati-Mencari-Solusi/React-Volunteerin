import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo_volunteerin.jpg';
import ErrorAlert from '../components/Elements/Alert/ErrorAlert';
import SuccessAlert from '../components/Elements/Alert/SuccesAlert';
import WhatsAppButton from "../components/Elements/buttons/BtnWhatsapp";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Link reset password telah dikirim ke email Anda');
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
            Lupa Kata Sandi
          </h1>
          <p className="text-[#0a3e54] text-lg">Masukkan email Anda untuk reset kata sandi</p>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[469px]">
          <div className="space-y-2">
            <label className="text-gray-700 block">Alamat Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54]`}
              placeholder="Contoh: johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0a3e54] text-white py-3 rounded-lg font-medium hover:bg-[#0a3e54]/90 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Kirim Link Reset"}
          </button>

          <div className="text-center text-gray-600">
            Kembali ke{" "}
            <Link to="/login" className="text-[#0a3e54] font-medium hover:underline">
              Halaman Login
            </Link>
          </div>
        </form>
      </div>
      <WhatsAppButton phoneNumber="+6285343037191" />
    </div>
  );
};

export default ForgotPassword;