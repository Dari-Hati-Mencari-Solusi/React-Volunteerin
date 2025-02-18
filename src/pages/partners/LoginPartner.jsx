import React, { useState } from "react";
import ErrorAlert from "../../components/Elements/Alert/ErrorAlert";
import SuccessAlert from "../../components/Elements/Alert/SuccesAlert";
import Logo from "../../assets/images/logo_volunteerin.jpg";
import WhatsAppButton from "../../components/Elements/buttons/BtnWhatsapp";
import { Link } from "react-router-dom";

const PartnerLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!isSubmitting) {
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Maaf, Email atau kata sandi anda salah!");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Maaf, Email atau kata sandi anda salah!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await mockLoginAPI(formData);

      if (!response.success) {
        setError("Maaf, Email atau kata sandi anda salah!");
      } else {
        setSuccess("Anda berhasil masuk!");
      }
    } catch (err) {
      setError("Maaf, Email atau kata sandi anda salah!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockLoginAPI = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 600);
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="lg:py-3 md:py-3 py-8">
        <img
          src={Logo}
          alt="logo volunteerin"
          className="lg:w-[295px] lg:h-[64px] md:w-[295px] md:h-[64px] w-[250px] h-[50px]"
        />
      </div>
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-xl p-8 w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#14464B] mb-2">
            Volunteerin Partner
          </h1>
          <p className="text-[#14464B] text-lg">Masuk Sebagai Partner</p>
        </div>

        <ErrorAlert message={error} />

        <SuccessAlert message={success} />

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[469px]">
          <div className="space-y-2">
            <label className="text-gray-700 block">Alamat Email</label>
            <input
              type="email"
              name="email"
              placeholder="Contoh: johndoe@gmail.com"
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]`}
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-gray-700">Kata sandi</label>
              <a
                href="#"
                className="text-[#14464B] text-sm font-medium hover:underline"
              >
                Lupa kata sandi
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Masukkan password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]`}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#14464B] text-white py-3 rounded-lg font-medium hover:bg-[#14464B]/90 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Link to="/">{isSubmitting ? "Memproses..." : "Masuk"}</Link>
          </button>

          <div className="text-center text-gray-600">
            Mau cari kandidat volunteer?{" "}
            <a href="#" className="text-[#14464B] font-medium hover:underline">
              Daftar menjadi Partner
            </a>
          </div>
        </form>
      </div>
      <WhatsAppButton phoneNumber="+6285343037191" />
    </div>
  );
};

export default PartnerLoginForm;
