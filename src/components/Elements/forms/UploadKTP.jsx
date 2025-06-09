import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

// Upload icon
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
    <path d="M16 16L12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.39 18.39C21.3653 17.8583 22.1358 17.0169 22.5799 15.9986C23.024 14.9804 23.1162 13.8432 22.8443 12.7667C22.5725 11.6901 21.9515 10.7355 21.0733 10.0534C20.1952 9.37137 19.1085 9.00072 18 9.00001H16.74C16.4373 7.82926 15.8732 6.74235 15.0899 5.82099C14.3067 4.89963 13.3248 4.16736 12.2181 3.68114C11.1113 3.19491 9.90851 2.96878 8.70008 3.01832C7.49164 3.06787 6.31381 3.39183 5.24822 3.96396C4.18264 4.53608 3.25555 5.34066 2.53828 6.31732C1.82101 7.29398 1.33086 8.41935 1.10939 9.60954C0.887916 10.7997 0.940734 12.0223 1.26423 13.1851C1.58772 14.348 2.17124 15.4202 2.96 16.32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Info icon
const InfoIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="0.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Delete/close icon
const XIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ID Card icon
const IdCardIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 8H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Resize and optimize an image for upload
 * @param {File} file - The original file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<Object>} - Object with resized file and metadata
 */
// Simplify resizing function
// Ganti fungsi resizeImage dengan yang lebih simple
const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    // Pastikan file tidak terlalu besar, tapi tidak perlu berlebihan dalam kompresi
    if (file.size <= 800 * 1024) { // Jika kurang dari 800KB, tidak perlu resize
      console.log('File sudah optimal, tidak perlu resize');
      resolve({
        file: file,
        originalSize: file.size / 1024,
        resizedSize: file.size / 1024,
        finalDimensions: 'original'
      });
      return;
    }
    
    // Untuk file yang lebih besar, gunakan minimal processing
    try {
      // Buat nama file yang lebih simple (tanpa karakter khusus)
      const fileExt = file.name.split('.').pop().toLowerCase();
      const safeFileName = `ktp_${Date.now()}.${fileExt}`;
      
      // Buat file baru dengan nama yang aman
      const cleanFile = new File([file], safeFileName, {
        type: file.type,
        lastModified: file.lastModified
      });
      
      resolve({
        file: cleanFile,
        originalSize: file.size / 1024,
        resizedSize: file.size / 1024,
        finalDimensions: 'original (renamed)'
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * KTP Upload component
 * @param {Function} onUploadSuccess - Callback when upload is successful
 * @param {string} initialImageUrl - URL of the existing KTP image
 * @param {boolean} disabled - Whether the component is disabled
 */
const UploadKTP = ({ onUploadSuccess, initialImageUrl = null, disabled = false }) => {
  const [preview, setPreview] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compressionStatus, setCompressionStatus] = useState('');
  const [ktpFile, setKtpFile] = useState(null);
  const fileInputRef = useRef(null);

  // Reset error when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
      setError(null);
    }
  }, [initialImageUrl]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset states
    setError(null);
    setLoading(true);
    setCompressionStatus('');
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Hanya file gambar (JPG, PNG) yang diperbolehkan');
        setLoading(false);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file tidak boleh lebih dari 5MB');
        setLoading(false);
        return;
      }

      // Generate a preview immediately for better UX
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreview(tempPreviewUrl);
      
      // Resize and compress image
      setCompressionStatus('Memproses gambar KTP...');
      console.log('Processing KTP image...');
      
      const { file: optimizedFile, originalSize, resizedSize, finalDimensions } = await resizeImage(file);
      
      // Update compression status
      setCompressionStatus(
        `Optimalisasi berhasil: ${finalDimensions}, ${resizedSize.toFixed(1)}KB (${Math.round((1 - resizedSize/originalSize) * 100)}% lebih kecil)`
      );
      
      console.log(`KTP optimized: ${originalSize.toFixed(1)}KB → ${resizedSize.toFixed(1)}KB`);
      
      // Update state with processed file
      setKtpFile(optimizedFile);
      
      // Create a new preview URL for the optimized file
      if (tempPreviewUrl !== initialImageUrl) {
        URL.revokeObjectURL(tempPreviewUrl);
      }
      
      const optimizedPreviewUrl = URL.createObjectURL(optimizedFile);
      setPreview(optimizedPreviewUrl);
      
      // Call the callback with the processed file and preview URL
      // Generate a temporary ID for new uploads
      const tempImageId = 'ktp_' + Math.random().toString(36).substring(2, 10);
      onUploadSuccess(optimizedFile, optimizedPreviewUrl, tempImageId);
      
      console.log('KTP processing complete');
      toast.success('KTP berhasil diproses dan siap untuk diunggah');
      
    } catch (error) {
      console.error('Error processing KTP:', error);
      setError(`Gagal memproses gambar: ${error.message}`);
      // Revert to initial image if processing fails
      if (preview && preview !== initialImageUrl && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setPreview(initialImageUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleClearImage = () => {
    if (preview && preview !== initialImageUrl && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    setPreview(null);
    setKtpFile(null);
    setError(null);
    setCompressionStatus('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Call the callback with null to indicate image was removed
    onUploadSuccess(null, null, null);
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Foto KTP <span className="text-red-500">*</span>
      </label>
      
      <div className={`border ${error ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-lg p-4 bg-white`}>
        {preview ? (
          <div className="space-y-3">
            {/* Image preview */}
            <div className="relative flex justify-center">
              <img 
                src={preview} 
                alt="Preview KTP" 
                className="max-h-64 max-w-full h-auto object-contain rounded border shadow-sm"
                onError={(e) => {
                  console.error('Error loading KTP preview');
                  setError('Gagal memuat preview KTP');
                  e.target.src = 'https://via.placeholder.com/400x250?text=Error+Loading+Image';
                }}
              />
              
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 focus:outline-none"
                  aria-label="Hapus gambar"
                >
                  <XIcon size={18} className="text-red-500" />
                </button>
              )}
            </div>
            
            {/* Image info */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-2">
                <IdCardIcon className="text-[#0A3E54]" />
                <div>
                  <p className="text-sm font-medium">KTP Telah Diunggah</p>
                  {compressionStatus && (
                    <p className="text-xs text-gray-500">{compressionStatus}</p>
                  )}
                </div>
              </div>
              
              {!disabled && (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Ganti Foto
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full min-h-32">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-500">{compressionStatus || 'Memproses...'}</p>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleButtonClick}
                  className={`flex flex-col items-center px-6 py-8 cursor-pointer hover:bg-gray-50 transition-colors w-full rounded focus:outline-none ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#0A3E54] focus:ring-opacity-20'
                  }`}
                >
                  <IdCardIcon size={48} className="text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium mt-2">
                    Unggah Foto KTP
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    Klik untuk memilih file (JPG, PNG)
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          disabled={disabled || loading}
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* Info & Guidelines */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center space-x-1">
          <InfoIcon size={14} className="text-gray-500" />
          <p className="text-xs text-gray-500">
            Format yang didukung: JPG, PNG (maksimum 5MB)
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <InfoIcon size={14} className="text-blue-500" />
          <p className="text-xs text-blue-600">
            Pastikan foto KTP jelas dan informasi dapat dibaca dengan baik
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <InfoIcon size={14} className="text-orange-500" />
          <p className="text-xs text-orange-600">
            KTP akan dioptimasi secara otomatis untuk kebutuhan upload
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadKTP;