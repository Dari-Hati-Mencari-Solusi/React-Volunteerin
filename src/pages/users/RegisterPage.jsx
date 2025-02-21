import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logo_volunteerin.jpg"; // Import logo
import ErrorAlert from '../../components/Elements/Alert/ErrorAlert';
import SuccessAlert from '../../components/Elements/Alert/SuccesAlert';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(\+62|08)[1-9]\d{6,9}$/.test(phone); // Allow 08 or +62 prefix

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name) return "Nama lengkap harus diisi!";
    if (!formData.email) return "Alamat email harus diisi!";
    if (!validateEmail(formData.email)) return "Alamat email tidak valid!";
    if (!formData.phone) return "Nomor handphone harus diisi!";
    if (!validatePhone(formData.phone)) return "Nomor handphone tidak valid!";
    if (!formData.password) return "Kata sandi harus diisi!";
    if (formData.password.length < 6) return "Kata sandi minimal 6 karakter!";
    if (formData.password !== formData.confirmPassword)
      return "Kata sandi dan konfirmasi tidak cocok!";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    // Convert phone number to +62 format if it starts with 08
    let formattedPhone = formData.phone;
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '+62' + formattedPhone.slice(1);
    }

    try {
      const response = await axios.post("YOUR_REGISTER_API_ENDPOINT", {
        ...formData,
        phone: formattedPhone,
      });
      if (!response.data.success) {
        setError(response.data.message || "Terjadi kesalahan saat mendaftar!");
      } else {
        setSuccess("Pendaftaran berhasil! Silakan masuk.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat mendaftar!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8">
        {/* Kiri: Logo & Deskripsi */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-6">
          <img src={logo} alt="Volunteerin Logo" className="w-48 md:w-60 mb-4" />
          <h2 className="text-xl font-semibold text-[#0a3e54]">Volunteerin</h2>
          <p className="text-center text-sm text-[#0a3e54] max-w-sm">
            Bergabunglah dengan komunitas relawan dan temukan berbagai peluang sesuai minat dan keahlianmu.
          </p>
        </div>

        {/* Kanan: Form Pendaftaran */}
        <div className="w-full md:w-5/6 lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#0a3e54] mb-6">Daftar</h2>

          <ErrorAlert message={error} />
          <SuccessAlert message={success} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Nama Lengkap" id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
            <FormInput label="Alamat Email" id="email" name="email" type="email" placeholder="johndoe@gmail.com" value={formData.email} onChange={handleInputChange} />
            <FormInput label="No. Handphone" id="phone" name="phone" type="text" placeholder="081234567890" value={formData.phone} onChange={handleInputChange} />
            
            {/* Kata Sandi */}
            <PasswordInput
              label="Kata Sandi"
              id="password"
              name="password"
              placeholder="Buat Password"
              value={formData.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {/* Konfirmasi Kata Sandi */}
            <PasswordInput
              label="Konfirmasi Kata Sandi"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Konfirmasi Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />

            <button
              type="submit"
              className={`w-full bg-[#0a3e54] text-white py-2.5 rounded-lg font-medium transition ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-[#08506a]"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#0a3e54] font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Komponen Input
const FormInput = ({ label, id, name, type, placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#0a3e54] mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3e54] focus:outline-none transition"
      required
    />
  </div>
);

// Komponen Password Input
const PasswordInput = ({ label, id, name, placeholder, value, onChange, showPassword, setShowPassword }) => (
  <div className="relative">
    <FormInput label={label} id={id} name={name} type={showPassword ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 transition"
    >
      {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
    </button>
  </div>
);

export default Register;