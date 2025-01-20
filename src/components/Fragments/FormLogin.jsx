import React, {useState} from 'react';
import { Mail, Tally1, Check } from 'lucide-react';
  
const FormLogin = () => {

    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(false);
  
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      setIsValid(validateEmail(value));
    };


  return (
    <div className="w-full max-w-md px-4 mx-auto">
      <div className="relative w-full flex justify-center">
        <div className="absolute inset-y-0 md:left-10 sm:left-4 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
          <div className="mx-3">
            <Tally1 className="h-9 w-5 text-gray-400" />
          </div>
        </div>
        <input 
          type="email" 
          value={email}
          onChange={handleEmailChange}
          placeholder="contoh@email.com"
          className="w-full sm:w-[391px] h-[60px] md:pl-[80px] rounded-xl border-2 font-medium border-gray-300 focus:outline-none focus:border-blue-500 text-[#A1A1A1] placeholder-gray-400"
        />
         {isValid && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FormLogin;