import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500 text-white p-3 rounded-lg flex items-center gap-2 mb-4 justify-center">
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;