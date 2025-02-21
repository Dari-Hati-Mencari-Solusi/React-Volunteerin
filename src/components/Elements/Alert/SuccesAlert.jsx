import React from 'react';

const SuccessAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-green-500 text-white p-3 rounded-lg flex items-center gap-2 mb-4 justify-center">
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default SuccessAlert;