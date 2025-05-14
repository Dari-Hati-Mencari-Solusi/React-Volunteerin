/**
 * Memvalidasi format email
 * @param {string} email - Alamat email yang akan divalidasi
 * @returns {boolean} Hasil validasi
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Memvalidasi format nomor telepon Indonesia
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {boolean} Hasil validasi
 */
export const validatePhone = (phone) => {
  const regex = /^(\+62|08)[1-9]\d{6,9}$/;
  return regex.test(phone);
};

/**
 * Memvalidasi kekuatan password
 * @param {string} password - Password yang akan divalidasi
 * @param {number} minLength - Panjang minimal password (default: 6)
 * @returns {boolean} Hasil validasi
 */
export const validatePassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

/**
 * Memvalidasi kesamaan password dan konfirmasi password
 * @param {string} password - Password
 * @param {string} confirmPassword - Konfirmasi password
 * @returns {boolean} Hasil validasi
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Memvalidasi bahwa string tidak kosong
 * @param {string} value - Nilai yang akan divalidasi
 * @returns {boolean} Hasil validasi
 */
export const validateRequired = (value) => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Memvalidasi format nomor telepon hanya angka
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {boolean} Hasil validasi
 */
export const validateNumericPhone = (phone) => {
  return /^\d+$/.test(phone);
};

/**
 * Memvalidasi panjang minimum dari string
 * @param {string} value - Nilai yang akan divalidasi
 * @param {number} minLength - Panjang minimum
 * @returns {boolean} Hasil validasi
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Menggabungkan beberapa fungsi validasi
 * @param {string} value - Nilai yang akan divalidasi
 * @param {Function[]} validators - Array fungsi validasi yang akan dijalankan
 * @returns {boolean} Hasil validasi (true jika semua validasi berhasil)
 */
export const validateWithAll = (value, validators) => {
  return validators.every(validator => validator(value));
};
