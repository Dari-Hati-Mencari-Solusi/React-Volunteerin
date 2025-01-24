import React, { useState } from "react";
import { Mail, Lock, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FormLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(validatePassword(value));
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex flex-col gap-6 px-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-7 w-7 text-black" />
            <h1 className="text-2xl font-semibold">Masuk</h1>
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-black" />
          </div>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Contoh@email.com"
            className="h-[60px] w-[390px] pl-12 pr-12 rounded-xl border-2 font-normal border-gray-300 text-[#A1A1A1] placeholder-gray-400 focus:outline-none"
          />
          {isEmailValid && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <div className="bg-green-500 rounded-full">
                <Check className="h-6 w-6  text-white p-[3px]" />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-black" />
          </div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-[390px] h-[60px] pl-12 pr-12 rounded-xl border-2 font-normal border-gray-300 text-[#A1A1A1] placeholder-gray-400 focus:outline-none"
          />
          {isPasswordValid && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <div className="bg-green-500 rounded-full">
                <Check className="h-6 w-6  text-white p-[3px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
