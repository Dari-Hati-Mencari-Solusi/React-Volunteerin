import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import ErrorAlert from '../components/Elements/Alert/ErrorAlert';
import SuccessAlert from '../components/Elements/Alert/SuccesAlert';
import logo from '../assets/images/logo_volunteerin.jpg';
import WhatsAppButton from "../components/Elements/buttons/BtnWhatsapp";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({ loading: true, success: false, message: '' });
  
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('t');
      
      if (!token) {
        setStatus({ 
          loading: false, 
          success: false, 
          message: 'Token verifikasi tidak ditemukan. Pastikan Anda menggunakan link yang benar.' 
        });
        return;
      }
      
      try {
        console.log("Attempting to verify email with token:", token);
        const response = await authService.verifyEmail(token);
        console.log("Verification response:", response);
        
        setStatus({ 
          loading: false, 
          success: true, 
          message: 'Email berhasil diverifikasi! Sekarang Anda dapat masuk ke akun Anda.' 
        });
      } catch (error) {
        console.error("Verification error:", error);
        setStatus({ 
          loading: false, 
          success: false, 
          message: error.message || 'Gagal memverifikasi email. Token mungkin tidak valid atau sudah kadaluarsa.' 
        });
      }
    };
    
    verifyEmail();
  }, [searchParams]);
  
  // Add a manual verification option if automatic verification fails
  const handleManualVerification = async () => {
    const token = searchParams.get('t');
    if (!token) {
      setStatus({ 
        loading: false, 
        success: false, 
        message: 'Token verifikasi tidak ditemukan.' 
      });
      return;
    }
    
    setStatus({ loading: true, success: false, message: '' });
    
    try {
      await authService.verifyEmail(token);
      setStatus({ 
        loading: false, 
        success: true, 
        message: 'Email berhasil diverifikasi! Sekarang Anda dapat masuk ke akun Anda.' 
      });
    } catch (error) {
      setStatus({ 
        loading: false, 
        success: false, 
        message: error.message || 'Gagal memverifikasi email. Token mungkin tidak valid atau sudah kadaluarsa.' 
      });
    }
  };
  
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
      
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0a3e54] mb-2">
            Verifikasi Email
          </h1>
        </div>
        
        {status.loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a3e54]"></div>
            <p className="mt-4 text-gray-600">Memverifikasi email Anda...</p>
          </div>
        ) : (
          <>
            {status.success ? (
              <SuccessAlert message={status.message} />
            ) : (
              <>
                <ErrorAlert message={status.message} />
                {/* Add manual verification button */}
                <div className="mt-4 text-center">
                  <button 
                    onClick={handleManualVerification}
                    className="bg-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Coba Verifikasi Ulang
                  </button>
                </div>
              </>
            )}
            
            <div className="mt-8 text-center">
              <Link 
                to="/login" 
                className="bg-[#0a3e54] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#0a3e54]/90 transition-colors"
              >
                {status.success ? 'Masuk ke Akun' : 'Kembali ke Halaman Login'}
              </Link>
            </div>
          </>
        )}
      </div>
      <WhatsAppButton phoneNumber="+6285343037191" />
    </div>
  );
};

export default VerifyEmailPage;