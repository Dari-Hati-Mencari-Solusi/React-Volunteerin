import React, { useState, useEffect, useRef } from 'react';
import { X, User, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { partnerService } from '../../../services/partnerService';

const AvatarProfilePartner = ({ onAvatarUpload, initialAvatarUrl, currentFormData }) => {
  const [preview, setPreview] = useState(initialAvatarUrl || null);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [compressionStatus, setCompressionStatus] = useState('');
  const fileInputRef = useRef(null);
  const [localLogoDataUrl, setLocalLogoDataUrl] = useState(null);
  
  // Define mapping for organization types
  const reverseOrganizationTypeMap = {
    'komunitas': 'COMMUNITY',
    'pemerintah': 'GOVERNMENT', 
    'perusahaan': 'CORPORATE',
    'individu': 'INDIVIDUAL'
  };

  // Load avatar from initialAvatarUrl if available
  useEffect(() => {
    if (initialAvatarUrl) {
      // Try to load from localStorage first to prevent CORS issues
      const savedLogo = localStorage.getItem('partnerLogoPreview');
      if (savedLogo) {
        setPreview(savedLogo);
        setLocalLogoDataUrl(savedLogo);
      } else {
        setPreview(initialAvatarUrl);
      }
      setError(null);
    } else {
      // If no initialAvatarUrl, try to find in localStorage
      const savedLogo = localStorage.getItem('partnerLogoPreview');
      if (savedLogo) {
        setPreview(savedLogo);
        setLocalLogoDataUrl(savedLogo);
      }
    }
  }, [initialAvatarUrl]);

  // Helper function to get current form data
  const getCurrentFormData = () => {
    if (currentFormData) {
      return currentFormData;
    }
    
    if (window.getCurrentProfileFormData && typeof window.getCurrentProfileFormData === 'function') {
      return window.getCurrentProfileFormData();
    }
    
    try {
      const savedFormData = localStorage.getItem('profileFormData');
      if (savedFormData) {
        return JSON.parse(savedFormData);
      }
    } catch (error) {
      console.error("Error getting form data:", error);
    }
    
    return null;
  };

  // Resize and optimize image
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
  
      img.onload = () => {
        const { width, height } = img;
        
        // Resize with maximum 300px dimensions
        const maxDimension = 300;
        let newWidth, newHeight;
        
        if (width > height) {
          newWidth = Math.min(width, maxDimension);
          newHeight = Math.round((height * newWidth) / width);
        } else {
          newHeight = Math.min(height, maxDimension);
          newWidth = Math.round((width * newHeight) / height);
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
  
        // White background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        // Use 85% quality consistently
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to process image'));
            return;
          }
          
          const sizeKB = blob.size / 1024;
          const simpleFile = new File([blob], "logo.jpg", { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
  
          resolve({
            file: simpleFile,
            originalSize: file.size / 1024,
            resizedSize: sizeKB,
            originalDimensions: `${width}x${height}`,
            finalDimensions: `${newWidth}x${newHeight}`
          });
        }, 'image/jpeg', 0.85);
      };
  
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
  
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    setError(null);
    setCompressionStatus('');
    
    const file = e.target.files[0];
    if (!file) return;
  
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxOriginalSize = 5 * 1024 * 1024; // 5MB
  
    if (!validTypes.includes(file.type)) {
      setError('File format must be JPG, JPEG, or PNG');
      toast.error('File format must be JPG, JPEG, or PNG');
      return;
    }
  
    if (file.size > maxOriginalSize) {
      setError(`File too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum 5MB`);
      toast.error('File too large. Maximum 5MB');
      return;
    }
  
    try {
      setLoading(true);
      
      // Save local preview from original file
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const localPreviewUrl = fileReader.result;
        // Save local preview in localStorage to prevent CORS issues
        try {
          localStorage.setItem('partnerLogoPreview', localPreviewUrl);
          setLocalLogoDataUrl(localPreviewUrl);
        } catch (e) {
          console.log("Error saving logo to localStorage:", e);
        }
        
        // Set local preview
        setPreview(localPreviewUrl);
      };
      fileReader.readAsDataURL(file);
  
      setCompressionStatus('Optimizing image...');
      
      // Resize image
      const resizeResult = await resizeImage(file);
      const processedFile = resizeResult.file;
      
      setCompressionStatus(`Optimization complete: ${resizeResult.originalDimensions} → ${resizeResult.finalDimensions}, ${resizeResult.resizedSize.toFixed(1)}KB`);
      
      // Validate final size
      if (processedFile.size > 200 * 1024) {
        setError(`Image still too large: ${(processedFile.size / 1024).toFixed(1)}KB. Maximum 200KB.`);
        toast.error("Image too large after compression. Try another simpler image.");
        setLoading(false);
        return;
      }
      
      // Save preview from compressed file to localStorage
      const processedReader = new FileReader();
      processedReader.onloadend = () => {
        const processedDataUrl = processedReader.result;
        try {
          localStorage.setItem('partnerLogoPreview', processedDataUrl);
          setLocalLogoDataUrl(processedDataUrl);
          
          // Update preview with compressed result
          setPreview(processedDataUrl);
        } catch (e) {
          console.log("Error saving compressed logo to localStorage:", e);
        }
      };
      processedReader.readAsDataURL(processedFile);
      
      setAvatar(processedFile);
      
      const API_URL = import.meta.env.VITE_BE_BASE_URL;
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // New approach: Try to create profile first regardless of whether it exists or not
      try {
        setCompressionStatus('Preparing profile...');
        
        // Get required profile data
        const currentData = getCurrentFormData();
        const organizationType = currentData?.jenisPenyelenggara 
          ? (reverseOrganizationTypeMap[currentData.jenisPenyelenggara] || 'COMMUNITY') 
          : 'COMMUNITY';
        const organizationAddress = currentData?.organizationAddress || 'Organization Address';
        const instagram = currentData?.usernameInstagram || 'instagram_handle';
        
        // Fix: Use FormData for POST & PUT (not JSON)
        
        // Create FormData for create/update profile operation
        const profileFormData = new FormData();
        profileFormData.append('organizationType', organizationType);
        profileFormData.append('organizationAddress', organizationAddress);
        profileFormData.append('instagram', instagram);
        
        // Add dummy file to meet backend requirements
        const pngData = new Uint8Array([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
          0x08, 0x04, 0x00, 0x00, 0x00, 0xB5, 0x1C, 0x0C, 0x02, 0x00, 0x00, 0x00,
          0x0B, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0x0F, 0x00, 0x01,
          0x01, 0x01, 0x00, 0x1B, 0xBF, 0x17, 0x84, 0x00, 0x00, 0x00, 0x00, 0x49,
          0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        const pngBlob = new Blob([pngData], {type: 'image/png'});
        const dummyFile = new File([pngBlob], 'dummy.png', {type: 'image/png'});
        
        // New approach: Try POST to create new profile first
        setCompressionStatus('Trying to create new profile...');
        try {
          // FormData for POST (add dummy logo)
          const postFormData = new FormData();
          postFormData.append('organizationType', organizationType);
          postFormData.append('organizationAddress', organizationAddress);
          postFormData.append('instagram', instagram);
          postFormData.append('logo', dummyFile);
          
          const createResponse = await fetch(`${API_URL}/partners/me/profile`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: postFormData
          });
          
          const createData = await createResponse.json();
          if (createResponse.ok) {
            setCompressionStatus('Profile created successfully, uploading logo...');
          } else {
            // Continue to PUT method (profile might already exist)
          }
        } catch (createError) {
          // Continue to PUT method
        }
        
        // Fix: Now upload the real logo with PUT
        setCompressionStatus('Uploading logo to server...');
        
        // FormData for logo upload
        const logoFormData = new FormData();
        logoFormData.append('logo', processedFile);
        logoFormData.append('organizationType', organizationType);
        logoFormData.append('organizationAddress', organizationAddress);
        logoFormData.append('instagram', instagram);
        
        const uploadResponse = await fetch(`${API_URL}/partners/me/profile`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for multipart/form-data
          },
          body: logoFormData
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || `Failed to upload logo! Status: ${uploadResponse.status}`);
        }
        
        const uploadData = await uploadResponse.json();
        
        setCompressionStatus('✅ Logo uploaded successfully to server!');
        toast.success("Logo uploaded successfully!");
        
        // Fix: Use server URL for metadata but still display local logo
        // to avoid CORS issues
        const serverLogoUrl = `${API_URL}/partners/me/logo?t=${Date.now()}`;
        
        // Call callback if available
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          // Important: Send local preview as third parameter for display
          onAvatarUpload(processedFile, serverLogoUrl, localLogoDataUrl || processedReader.result);
        }
        
      } catch (profileError) {
        console.error("Error checking/creating profile:", profileError);
        throw profileError;
      }
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      
      // Try to use saved local preview if available
      const savedPreview = localStorage.getItem('partnerLogoPreview');
      if (savedPreview) {
        setPreview(savedPreview);
      } else {
        setPreview(initialAvatarUrl || null);
      }
      
      const errorMessage = error.message || "Failed to upload logo";
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        if (!error) {
          setCompressionStatus('');
        }
      }, 3000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = async () => {
    if (window.confirm('Are you sure you want to remove the logo?')) {
      try {
        setLoading(true);
        setCompressionStatus('Removing logo...');
        
        // Remove from localStorage
        localStorage.removeItem('partnerLogoPreview');
        setLocalLogoDataUrl(null);
        
        // Call API to remove avatar if it exists
        if (initialAvatarUrl) {
          try {
            await partnerService.removeAvatar();
            toast.success("Logo removed successfully");
          } catch (error) {
            console.error("Error removing avatar:", error);
            toast.error("Failed to remove logo from server");
            throw error;
          }
        }
        
        // Reset local state
        setPreview(null);
        setAvatar(null);
        setError(null);
        setCompressionStatus('');
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Call callback
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          onAvatarUpload(null, null);
        }
      } catch (error) {
        console.error("Error in removeAvatar:", error);
        toast.error(error.message || "Failed to remove logo");
      } finally {
        setLoading(false);
        setCompressionStatus('');
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">
        Logo/Avatar Penyelenggara 
        <span className="text-xs text-gray-500 ml-2">(Automatically adjusted to proper size)</span>
      </label>
      
      <div className="flex justify-center">
        {preview ? (
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#0A3E54]">
            <img 
              src={preview} 
              alt="Logo Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Error loading image");
                
                // Try to get from localStorage if image fails to load
                const savedPreview = localStorage.getItem('partnerLogoPreview');
                if (savedPreview) {
                  e.target.src = savedPreview;
                  return;
                }
                
                // Fallback to error placeholder
                setError("Failed to load image. Try uploading a new logo.");
                e.target.src = 'https://placehold.co/200x200?text=Logo';
              }}
            />
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <User size={32} className="text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 text-center px-2">Click to upload logo</p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/jpg"
          className="hidden"
          id="avatar-upload-input"
        />
      </div>
      
      {loading && (
        <div className="w-full flex justify-center py-2">
          <div className="w-6 h-6 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin mr-2"></div>
          <p className="text-sm text-gray-600 ml-2">Processing logo...</p>
        </div>
      )}

      {compressionStatus && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600 flex items-start space-x-2">
          <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <span>{compressionStatus}</span>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start space-x-2">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mt-2">
      <p className="text-xs text-blue-700 font-medium mb-1">Panduan Upload Logo:</p>
        <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
          <li>📏 Ukuran optimal: 300x300 piksel (dioptimasi otomatis)</li>
          <li>✅ Format: JPG, JPEG, atau PNG</li>
          <li>⚡ Maksimal 200KB (dioptimasi otomatis)</li>
          <li>🎯 Hindari gambar dengan transparansi</li>
        </ul>
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          <strong>Tips:</strong> Jika upload gagal, coba gunakan gambar dengan latar solid (bukan transparan)
        </div>
      </div>
    </div>
  );
};

export default AvatarProfilePartner;