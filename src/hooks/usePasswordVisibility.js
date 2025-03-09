import { useState } from 'react';

export const usePasswordVisibility = (initialState = false) => {
  const [showPassword, setShowPassword] = useState(initialState);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return {
    showPassword,
    togglePasswordVisibility
  };
};
