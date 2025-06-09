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

  // Effect untuk memuat avatar dari initialAvatarUrl jika tersedia
  useEffect(() => {
    if (initialAvatarUrl) {
      setPreview(initialAvatarUrl);
      setError(null);
    }
  }, [initialAvatarUrl]);

  // Helper function untuk mengambil data form saat ini
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

  // Function untuk resize gambar sesuai aturan server yang super-ketat
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        
        console.log(`Original dimensions: ${width}x${height}`);
        
        // Resize dengan ukuran maksimum 300x300
        const maxDimension = 300;
        let newWidth, newHeight;
        
        if (width > height) {
          newWidth = Math.min(width, maxDimension);
          newHeight = Math.round((height * newWidth) / width);
        } else {
          newHeight = Math.min(height, maxDimension);
          newWidth = Math.round((width * newHeight) / height);
        }
        
        console.log(`Resized dimensions: ${newWidth}x${newHeight}`);

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Fill dengan background putih
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw gambar
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Kompres dengan kualitas bertingkat sampai ukuran < 190KB
        const tryQuality = (quality) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Gagal memproses gambar'));
              return;
            }
            
            const sizeKB = blob.size / 1024;
            console.log(`Compressed to ${sizeKB.toFixed(2)}KB with quality ${quality}`);
            
            // Jika sudah cukup kecil atau sudah kualitas minimal
            if (sizeKB <= 190 || quality <= 0.3) {
              // Nama file sangat sederhana: 'logo.jpg'
              const simpleFile = new File([blob], "logo.jpg", { 
                type: 'image/jpeg',
                lastModified: Date.now()
              });

              resolve({
                file: simpleFile,
                originalSize: file.size / 1024,
                resizedSize: sizeKB,
                originalDimensions: `${width}x${height}`,
                finalDimensions: `${newWidth}x${newHeight}`,
                quality
              });
            } else {
              // Coba kualitas lebih rendah
              tryQuality(Math.max(0.3, quality - 0.1));
            }
          }, 'image/jpeg', quality);
        };
        
        // Mulai dengan kualitas 0.8
        tryQuality(0.8);
      };

      img.onerror = () => {
        reject(new Error('Gagal memuat gambar'));
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => {
        reject(new Error('Gagal membaca file gambar'));
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
      setError('Format file harus JPG, JPEG, atau PNG');
      toast.error('Format file harus JPG, JPEG, atau PNG');
      return;
    }

    if (file.size > maxOriginalSize) {
      setError(`File terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maksimal 5MB`);
      toast.error('File terlalu besar. Maksimal 5MB');
      return;
    }

    try {
      setLoading(true);
      
      // Preview gambar untuk responsivitas
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setCompressionStatus('Mengoptimalkan gambar...');
      
      // Resize dan compress gambar
      const resizeResult = await resizeImage(file);
      const processedFile = resizeResult.file;
      
      console.log('Resize result:', resizeResult);
      setCompressionStatus(`Optimasi selesai: ${resizeResult.originalDimensions} → ${resizeResult.finalDimensions}, ${resizeResult.resizedSize.toFixed(1)}KB`);
      
      // Validasi ukuran akhir
      if (processedFile.size > 200 * 1024) {
        setError(`Gambar masih terlalu besar: ${(processedFile.size / 1024).toFixed(1)}KB. Maksimal 200KB.`);
        toast.error("Gagal mengoptimalkan gambar. Coba gambar lain.");
        setLoading(false);
        return;
      }
      
      setAvatar(processedFile);
      
      // METODE 1: Upload via Fetch API langsung
      
      setCompressionStatus('Mengunggah logo ke server...');
      
      try {
        // Buat FormData sederhana dengan field minimal
        const formData = new FormData();
        
        // Nama field HARUS 'logo' sesuai API
        formData.append('logo', processedFile);
        
        // Tambah data profil yang diperlukan
        const currentData = getCurrentFormData();
        const organizationTypeMap = {
          'komunitas': 'COMMUNITY',
          'pemerintah': 'GOVERNMENT', 
          'perusahaan': 'CORPORATE',
          'individu': 'INDIVIDUAL'
        };
        
        // Default ke COMMUNITY jika tidak ada
        const organizationType = currentData?.jenisPenyelenggara 
          ? (organizationTypeMap[currentData.jenisPenyelenggara] || 'COMMUNITY')
          : 'COMMUNITY';
        
        // Tambahkan field wajib (simpel tanpa karakter khusus)
        formData.append('organizationType', organizationType);
        formData.append('organizationAddress', currentData?.organizationAddress || 'Alamat Penyelenggara');
        formData.append('instagram', currentData?.usernameInstagram || 'instagram_handle');
        
        // Log FormData untuk debugging
        console.log("FormData for profile update:");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${(value.size / 1024).toFixed(2)}KB]`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        // Upload menggunakan service yang sudah dioptimalkan
        const response = await partnerService.updatePartnerProfileWithLogo(formData);
        
        console.log("Logo upload response:", response);
        
        toast.success("Logo berhasil diunggah!");
        setCompressionStatus('✅ Logo berhasil diunggah ke server!');
        
        // Update state dan callback
        if (response?.data?.partnerProfile?.logoUrl) {
          const logoUrl = response.data.partnerProfile.logoUrl;
          setPreview(logoUrl);
          
          // Callback ke parent
          if (onAvatarUpload && typeof onAvatarUpload === 'function') {
            onAvatarUpload(processedFile, logoUrl);
          }
        } else {
          if (onAvatarUpload && typeof onAvatarUpload === 'function') {
            onAvatarUpload(processedFile, preview);
          }
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        
        // METODE 2: Jika fetch gagal, coba dengan XHR langsung
        setCompressionStatus('Mencoba metode alternatif dengan XHR...');
        
        try {
          console.log("Trying XHR approach...");
          
          // Buat XHR request manual
          const xhr = new XMLHttpRequest();
          const API_URL = import.meta.env.VITE_BE_BASE_URL;
          const token = localStorage.getItem('token');
          
          // Buat promise untuk XHR
          const xhrPromise = new Promise((resolve, reject) => {
            xhr.open('PUT', `${API_URL}/partners/me/profile`, true);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            
            xhr.onload = function() {
              if (this.status >= 200 && this.status < 300) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  resolve(response);
                } catch (e) {
                  reject(new Error('Invalid JSON response'));
                }
              } else {
                try {
                  const errorData = JSON.parse(xhr.responseText);
                  reject({
                    status: this.status,
                    message: errorData.message || `Error ${this.status}`,
                    data: errorData
                  });
                } catch (e) {
                  reject(new Error(`Server error: ${this.status}`));
                }
              }
            };
            
            xhr.onerror = function() {
              reject(new Error('Network error'));
            };
            
            // Buat FormData baru untuk XHR
            const xhrFormData = new FormData();
            xhrFormData.append('logo', processedFile);
            xhrFormData.append('organizationType', organizationType);
            xhrFormData.append('organizationAddress', currentData?.organizationAddress || 'Alamat Penyelenggara');
            xhrFormData.append('instagram', currentData?.usernameInstagram || 'instagram_handle');
            
            // Kirim request
            xhr.send(xhrFormData);
          });
          
          // Tunggu XHR selesai
          const xhrResponse = await xhrPromise;
          console.log("XHR upload successful:", xhrResponse);
          
          toast.success("Logo berhasil diunggah dengan metode alternatif!");
          setCompressionStatus('✅ Logo berhasil diunggah!');
          
          // Update dan callback - sama seperti metode 1
          if (xhrResponse?.data?.partnerProfile?.logoUrl || xhrResponse?.partnerProfile?.logoUrl) {
            const logoUrl = xhrResponse?.data?.partnerProfile?.logoUrl || xhrResponse?.partnerProfile?.logoUrl;
            setPreview(logoUrl);
            
            if (onAvatarUpload && typeof onAvatarUpload === 'function') {
              onAvatarUpload(processedFile, logoUrl);
            }
          } else {
            if (onAvatarUpload && typeof onAvatarUpload === 'function') {
              onAvatarUpload(processedFile, preview);
            }
          }
        } catch (xhrError) {
          console.error("XHR also failed:", xhrError);
          throw new Error(xhrError.message || "Semua metode upload gagal. Coba gambar lain.");
        }
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      
      // Reset preview ke yang sebelumnya jika gagal
      setPreview(initialAvatarUrl || null);
      
      let errorMessage = "Gagal mengunggah logo";
      
      if (error.status === 500) {
        errorMessage = "Server tidak dapat memproses gambar. Coba gambar lain atau hubungi administrator.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // FALLBACK untuk development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using local preview as fallback');
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          onAvatarUpload(file, preview);
          toast.info("Development mode: Menggunakan preview lokal untuk testing UI");
        }
      }
    } finally {
      setLoading(false);
      
      // Clear status message after delay
      setTimeout(() => {
        if (!error) {
          setCompressionStatus('');
        }
      }, 5000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus logo?')) {
      try {
        setLoading(true);
        setCompressionStatus('Menghapus logo...');
        
        // Panggil API untuk menghapus avatar jika ada
        if (initialAvatarUrl) {
          try {
            await partnerService.removeAvatar();
            toast.success("Logo berhasil dihapus");
          } catch (error) {
            console.error("Error removing avatar:", error);
            toast.error("Gagal menghapus logo dari server");
            throw error;
          }
        }
        
        // Reset state lokal
        setPreview(null);
        setAvatar(null);
        setError(null);
        setCompressionStatus('');
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Panggil callback
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          onAvatarUpload(null, null);
        }
      } catch (error) {
        console.error("Error in removeAvatar:", error);
        toast.error(error.message || "Gagal menghapus logo");
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
        <span className="text-xs text-gray-500 ml-2">(Disesuaikan otomatis ke ukuran yang tepat)</span>
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
                setError("Gagal memuat gambar. URL tidak valid atau gambar rusak.");
                e.target.src = 'https://placehold.co/200x200?text=Error';
              }}
            />
            {!loading && (
              <button 
                type="button"
                onClick={removeAvatar}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                aria-label="Hapus logo"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <User size={32} className="text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 text-center px-2">Klik untuk unggah logo</p>
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
          <p className="text-sm text-gray-600 ml-2">Memproses logo...</p>
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