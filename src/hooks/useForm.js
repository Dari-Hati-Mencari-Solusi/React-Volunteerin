import { useState } from 'react';

/**
 * Custom hook untuk mengelola form state
 * @param {Object} initialState - Nilai awal state form
 * @returns {Object} Form state dan methods
 */
export const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Menangani perubahan input form
   * @param {Event} event - Event object dari input element
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  /**
   * Mengatur ulang form ke nilai awal
   */
  const resetForm = () => {
    setFormData(initialState);
    clearMessages();
    setIsSubmitting(false);
  };

  /**
   * Membersihkan pesan error dan success
   */
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  /**
   * Mengatur status form (error atau success)
   * @param {string} type - Tipe status ('error' atau 'success')
   * @param {string} message - Pesan status
   */
  const setStatus = (type, message) => {
    if (type === 'error') {
      setError(message);
      setSuccess('');
    } else if (type === 'success') {
      setSuccess(message);
      setError('');
    }
  };

  return {
    formData,
    setFormData,
    error,
    setError,
    success,
    setSuccess,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    resetForm,
    clearMessages,
    setStatus
  };
};
