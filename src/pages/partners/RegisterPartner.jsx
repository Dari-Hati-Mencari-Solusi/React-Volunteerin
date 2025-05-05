import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo_volunteerin.jpg";
import ErrorAlert from "../../components/Elements/Alert/ErrorAlert";
import SuccessAlert from "../../components/Elements/Alert/SuccesAlert";
import WhatsAppButton from "../../components/Elements/buttons/BtnWhatsapp";
import RegisterForm from "../../components/Fragments/FormRegisterPartner";
import VolunteerinRequirements from "../../components/Fragments/VolunteerinRequirements";
import { useForm } from '../../hooks/useForm';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';

export const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return { showPassword, togglePasswordVisibility };
};

const RegisterPartner = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
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

  const validateForm = () => {
    if (!formData.name) {
      setStatus('error', 'Nama tidak boleh kosong');
      return false;
    }
    
    if (!formData.email) {
      setStatus('error', 'Email tidak boleh kosong');
      return false;
    }
    
    if (!validateEmail(formData.email)) {
      setStatus('error', 'Format email tidak valid');
      return false;
    }
    
    if (!formData.password) {
      setStatus('error', 'Password tidak boleh kosong');
      return false;
    }
    
    if (formData.password.length < 8) {
      setStatus('error', 'Password minimal 8 karakter');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setStatus('error', 'Konfirmasi password tidak cocok');
      return false;
    }
    
    if (!formData.phoneNumber) {
      setStatus('error', 'Nomor telepon tidak boleh kosong');
      return false;
    }
    
    if (!/^[0-9]+$/.test(formData.phoneNumber)) {
      setStatus('error', 'Nomor telepon hanya boleh berisi angka');
      return false;
    }
    
    if (!formData.phoneNumber.startsWith('0')) {
      setStatus('error', 'Nomor telepon harus diawali dengan 0');
      return false;
    }
    
    return true;
  };

  const [formIsValid, setFormIsValid] = useState(false);
  
  useEffect(() => {
    const isValid = 
      formData.name && 
      formData.email && 
      formData.password && 
      formData.confirmPassword && 
      formData.phoneNumber && 
      formData.password === formData.confirmPassword && 
      formData.password.length >= 8 &&
      validateEmail(formData.email) &&
      /^[0-9]+$/.test(formData.phoneNumber) &&
      formData.phoneNumber.startsWith('0');
    
    setFormIsValid(isValid);
  }, [formData]);

  const handleFormChange = (newFormData) => {
    Object.keys(newFormData).forEach(key => {
      const fieldName = key === 'phone' ? 'phoneNumber' : key;
      if (formData[fieldName] !== undefined) {
        handleInputChange({
          target: {
            name: fieldName,
            value: newFormData[key]
          }
        });
      }
    });
  };

  const handleNext = () => {
    if (validateForm()) {
      setIsLogin(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      let formattedPhone = '62' + formData.phoneNumber.slice(1);

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
    <section className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="lg:py-3 md:py-3 py-8">
        <img
          src={logo}
          alt="logo volunteerin"
          className="lg:w-[295px] lg:h-[64px] md:w-[295px] md:h-[64px] w-[250px] h-[50px]"
        />
      </div>
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[514px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#14464B] mb-2">
            Volunteerin Partner
          </h1>
          <p className="text-[#14464B] text-lg">
            {isLogin ? "Daftar Sebagai Partner" : "Syarat Ketentuan"}
          </p>
        </div>
        
        <div className="flex justify-center items-center pb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`${
              isLogin ? "bg-[#0A3E54] text-white" : "bg-white text-[#0A3E54]"
            } font-medium lg:text-md md:text-md px-10 py-2 rounded-tl-md rounded-bl-md shadow-md transition-colors md:flex gap-3 items-center flex justify-center`}
          >
            <Icon icon="bxs:user" width="24" height="24" />
            <span className="hidden md:inline">Data Akun</span>
          </button>

          <button
            onClick={() => formIsValid && setIsLogin(false)}
            className={`${
              !isLogin ? "bg-[#0A3E54] text-white" : "bg-white text-[#0A3E54]"
            } font-medium lg:text-md md:text-md px-10 py-2 rounded-tr-md rounded-br-md shadow-md transition-colors md:flex gap-3 items-center flex justify-center ${!formIsValid ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={!formIsValid}
          >
            <Icon icon="gg:notes" width="24" height="24" />
            <span className="hidden md:inline">Syarat Ketentuan</span>
          </button>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        {isLogin ? (
          <RegisterForm
            onSubmit={handleNext}
            isSubmitting={isSubmitting}
            error={error}
            formData={{
              name: formData.name,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              phone: formData.phoneNumber
            }}
            onFormChange={handleFormChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        ) : (
          <VolunteerinRequirements
            setIsLogin={setIsLogin}
            handleNext={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        
        <div className="text-center text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <Link
            to="/login-partner"
            className="text-[#14464B] font-medium hover:underline"
          >
            Masuk sebagai Partner
          </Link>
        </div>
      </div>
      <WhatsAppButton phoneNumber="+6285343037191" />
    </section>
  );
};

export default RegisterPartner;