import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { AlertTriangle as AlertIcon, Upload as UploadIcon, X } from 'lucide-react';

// Info icon component
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadKTP = ({ onUploadSuccess, initialImageUrl }) => {
  const [preview, setPreview] = useState(null);
  const [ktpFile, setKtpFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compressionStatus, setCompressionStatus] = useState('');
  const fileInputRef = useRef(null);
  
  // Set initial preview from props
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
      setError(null);
      setKtpFile(null); // Reset file since we're using the initialImageUrl
      
      // Try to load image to verify URL
      const img = new Image();
      img.onerror = () => {
        // Just log error, don't display it
      };
      img.src = initialImageUrl;
    }
  }, [initialImageUrl]);

  // Image optimization function
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Get original dimensions
        const { width, height } = img;
        
        // Set target dimensions - larger for ID card to maintain readability
        const maxWidth = 1200;
        const maxHeight = 800;
        
        let newWidth, newHeight;
        
        if (width > height) {
          if (width > maxWidth) {
            newWidth = maxWidth;
            newHeight = Math.round((height * maxWidth) / width);
          } else {
            newWidth = width;
            newHeight = height;
          }
        } else {
          if (height > maxHeight) {
            newHeight = maxHeight;
            newWidth = Math.round((width * maxHeight) / height);
          } else {
            newWidth = width;
            newHeight = height;
          }
        }
        
        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Use white background (better for ID card)
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert to JPEG with higher quality since ID card needs to be readable
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to process ID card image'));
            return;
          }
          
          const originalSize = file.size / 1024;
          const resizedSize = blob.size / 1024;
          const fileName = file.name.split('.').slice(0, -1).join('.') + '.jpg';
          
          const optimizedFile = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve({
            file: optimizedFile, 
            originalSize,
            resizedSize,
            finalDimensions: `${newWidth}x${newHeight}`
          });
        }, 'image/jpeg', 0.90); // Use higher quality (0.90) for ID card
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load ID card image'));
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read ID card file'));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
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
        setError('Only image files (JPG, PNG) are allowed');
        setLoading(false);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size cannot exceed 5MB');
        setLoading(false);
        return;
      }

      // Generate a preview immediately for better UX
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreview(tempPreviewUrl);
      
      // Resize and compress image
      setCompressionStatus('Processing ID card image...');
      
      const { file: optimizedFile, originalSize, resizedSize, finalDimensions } = await resizeImage(file);
      
      // Update compression status
      setCompressionStatus(
        `Optimization successful: ${finalDimensions}, ${resizedSize.toFixed(1)}KB (${Math.round((1 - resizedSize/originalSize) * 100)}% smaller)`
      );
      
      // Save optimized file
      setKtpFile(optimizedFile);
      
      // Create a new preview URL for the optimized file
      if (tempPreviewUrl !== initialImageUrl) {
        URL.revokeObjectURL(tempPreviewUrl);
      }
      
      const optimizedPreviewUrl = URL.createObjectURL(optimizedFile);
      setPreview(optimizedPreviewUrl);
      
      // Generate a temporary image ID
      const tempImageId = `ktp_${Math.random().toString(36).substring(2, 10)}`;
      
      // Call the callback
      if (onUploadSuccess && typeof onUploadSuccess === 'function') {
        onUploadSuccess(optimizedFile, optimizedPreviewUrl, tempImageId);
      }
      
      toast.success('ID card processed successfully and ready for upload');
      
    } catch (error) {
      setError(`Failed to process image: ${error.message}`);
      
      // Revert to initial image if processing fails
      if (preview && preview !== initialImageUrl) {
        URL.revokeObjectURL(preview);
      }
      setPreview(initialImageUrl);
      
    } finally {
      setLoading(false);
      
      // Auto-hide compression status after success
      if (!error) {
        setTimeout(() => {
          setCompressionStatus('');
        }, 5000);
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove the selected ID card image
  const removeKTP = () => {
    if (preview && preview !== initialImageUrl) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setKtpFile(null);
    setError(null);
    setCompressionStatus('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Call the callback with null values
    if (onUploadSuccess && typeof onUploadSuccess === 'function') {
      onUploadSuccess(null, null, null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">
        Foto KTP Penanggung Jawab <span className="text-red-500">*</span>
      </label>
      
      {preview ? (
        <div className="relative">
          <div className="border-2 border-[#0A3E54] rounded-lg p-1 relative">
            <img 
              src={preview} 
              alt="KTP Preview" 
              className="w-full rounded object-contain max-h-64"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x500?text=ID+Card+Image+Unavailable';
                setError('Failed to load ID card image. Please upload again.');
              }}
            />
            
            {!loading && (
              <button 
                type="button"
                onClick={removeKTP}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                aria-label="Remove ID Card"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            {preview === initialImageUrl ? 
              "ID card already uploaded" : 
              "ID card ready for upload"}
          </p>
        </div>
      ) : (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center">
            <UploadIcon size={48} className="text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 text-center mb-1 font-medium">
              Click to upload ID card photo
            </p>
            <p className="text-xs text-gray-500 text-center">
              Format: JPG, JPEG, PNG (max 5MB)
            </p>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/jpg"
        className="hidden"
      />
      
      {loading && (
        <div className="w-full flex justify-center py-2">
          <div className="w-5 h-5 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin mr-2"></div>
          <p className="text-sm text-gray-600">Processing ID card...</p>
        </div>
      )}
      
      {compressionStatus && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600 flex items-start space-x-2">
          <InfoIcon />
          <span>{compressionStatus}</span>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start space-x-2">
          <AlertIcon size={16} className="text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex items-start space-x-2">
          <InfoIcon />
          <div>
          <p className="text-xs text-blue-700 font-medium">Panduan Upload KTP:</p>
            <ul className="text-xs text-blue-600 list-disc list-inside space-y-1 mt-1">
              <li>KTP harus terlihat jelas dan tidak terpotong</li>
              <li>Semua informasi pada KTP harus terbaca dengan jelas</li>
              <li>Pastikan foto KTP yang diunggah adalah milik penanggung jawab yang terdaftar</li>
              <li>File dioptimasi secara otomatis untuk kecepatan upload</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadKTP;