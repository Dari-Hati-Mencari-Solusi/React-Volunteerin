/**
 * Format number as Indonesian currency (Rupiah)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to Indonesian locale
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatString = 'dd MMMM yyyy') => {
  try {
    return format(new Date(date), formatString, { locale: id });
  } catch (e) {
    return date;
  }
};