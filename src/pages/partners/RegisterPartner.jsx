import React, { useState } from "react";
import WhatsAppButton from "../../components/Elements/buttons/BtnWhatsapp";
import ErrorAlert from "../../components/Elements/Alert/ErrorAlert";
import { Link } from "react-router-dom";
import RegisterForm from "../../components/Fragments/FormRegisterParner";
import VolunteerinRequirements from "../../components/Fragments/VolunteerinRequirements";
import { Icon } from "@iconify/react";

const RegisterPartner = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isFormComplete, setIsFormComplete] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
    const isComplete =
      newFormData.name &&
      newFormData.email &&
      newFormData.password &&
      newFormData.confirmPassword &&
      newFormData.phone &&
      newFormData.password === newFormData.confirmPassword &&
      validateEmail(newFormData.email);
    setIsFormComplete(isComplete);
  };

  const handleNext = () => {
    if (isFormComplete) {
      setIsLogin(false);
    } else {
      setError("Harap lengkapi form terlebih dahulu!");
    }
  };

  return (
    <section className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[514px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#14464B] mb-2">
            Volunteerin Partner
          </h1>
          <p className="text-[#14464B] text-lg">Masuk Sebagai Partner</p>
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
            onClick={() => setIsLogin(false)}
            className={`${
              !isLogin ? "bg-[#0A3E54] text-white" : "bg-white text-[#0A3E54]"
            } font-medium lg:text-md md:text-md px-10 py-2 rounded-tr-md rounded-br-md shadow-md transition-colors md:flex gap-3 items-center flex justify-center`}
            disabled={!isFormComplete}
          >
            <Icon icon="gg:notes" width="24" height="24" />
            <span className="hidden md:inline">Syarat Ketentuan</span>
          </button>
        </div>
        <ErrorAlert message={error} />
        {isLogin ? (
          <RegisterForm
            onSubmit={handleNext}
            isSubmitting={isSubmitting}
            error={error}
            formData={formData}
            onFormChange={handleFormChange}
          />
        ) : (
          <VolunteerinRequirements
            setIsLogin={setIsLogin}
            handleNext={handleNext}
          />
        )}
        <div className="text-center text-gray-600 mt-4">
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
