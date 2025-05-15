import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import ErrorAlert from '../components/Elements/Alert/ErrorAlert';
import SuccessAlert from '../components/Elements/Alert/SuccesAlert';
import logo from '../assets/images/logo_volunteerin.jpg';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t'); // Changed to match your token format
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        if (!token) {
          setError('Token verifikasi tidak valid!');
          setIsVerifying(false);
          return;
        }

        await authService.verifyEmail(token);
        setSuccess('Email berhasil diverifikasi! Silakan login.');
        setIsVerifying(false);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError(err.message || 'Gagal memverifikasi email');
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="lg:py-3 md:py-3 py-8">
        <Link to="/">
          <img
            src={logo}
            alt="logo volunteerin"
            className="lg:w-[295px] lg:h-[64px] md:w-[295px] md:h-[64px] w-[250px] h-[50px]"
          />
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[480px] text-center">
        <ErrorAlert message={error} />
        <SuccessAlert message={success} />
        
        {isVerifying && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3e54] mb-4"></div>
            <p className="text-gray-700 text-lg">Memverifikasi email...</p>
          </div>
        )}
        
        {!isVerifying && !error && !success && (
          <div className="text-center text-gray-600 py-8">
            Terjadi kesalahan tak terduga.
          </div>
        )}
        
        {error && (
          <div className="mt-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg bg-[#0a3e54] text-white font-medium hover:bg-[#0a3e54]/90 transition-colors inline-block"
            >
              Kembali ke Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;