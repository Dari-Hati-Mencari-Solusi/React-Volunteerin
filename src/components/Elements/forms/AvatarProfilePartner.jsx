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

  // Function untuk resize gambar sesuai aturan server (500x500px)
  const resizeImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        
        console.log(`Original dimensions: ${width}x${height}`);
        
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            newWidth = maxWidth;
            newHeight = maxWidth / aspectRatio;
            
            if (newHeight > maxHeight) {
              newHeight = maxHeight;
              newWidth = maxHeight * aspectRatio;
            }
          } else {
            newHeight = maxHeight;
            newWidth = maxHeight * aspectRatio;
            
            if (newWidth > maxWidth) {
              newWidth = maxWidth;
              newHeight = maxWidth / aspectRatio;
            }
          }
        }

        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);
        
        console.log(`Resized dimensions: ${Math.round(newWidth)}x${Math.round(newHeight)}`);

        canvas.width = Math.round(newWidth);
        canvas.height = Math.round(newHeight);

        ctx.drawImage(img, 0, 0, Math.round(newWidth), Math.round(newHeight));

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Gagal mengkonversi gambar'));
            return;
          }

          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          resolve({
            file: resizedFile,
            originalSize: file.size / 1024,
            resizedSize: blob.size / 1024,
            originalDimensions: `${width}x${height}`,
            finalDimensions: `${Math.round(newWidth)}x${Math.round(newHeight)}`
          });
        }, file.type, quality);
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
    const maxOriginalSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Format file harus JPG, JPEG, atau PNG');
      toast.error('Format file harus JPG, JPEG, atau PNG');
      return;
    }

    if (file.size > maxOriginalSize) {
      setError(`File terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maksimal 10MB`);
      toast.error('File terlalu besar. Maksimal 10MB');
      return;
    }

    try {
      setLoading(true);
      
      // Preview gambar original
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const originalSizeKB = file.size / 1024;
      console.log(`Original file size: ${originalSizeKB.toFixed(2)}KB`);
      
      setCompressionStatus('Menyesuaikan gambar dengan aturan server...');
      toast.info('Menyesuaikan dimensi gambar sesuai aturan server...');
      
      // Resize gambar untuk memenuhi aturan server (maksimal 500x500px)
      const resizeResult = await resizeImage(file, 500, 500, 0.85);
      const processedFile = resizeResult.file;
      
      console.log('Resize result:', resizeResult);
      setCompressionStatus(`Berhasil disesuaikan: ${resizeResult.originalDimensions} → ${resizeResult.finalDimensions} (${resizeResult.resizedSize.toFixed(0)}KB)`);
      
      setAvatar(processedFile);

      // Buat FormData sesuai dokumentasi BE
      const formData = new FormData();
      formData.append('logo', processedFile);
      
      // Ambil data profil dari form atau default values
      const currentData = getCurrentFormData();
      
      // organizationType - wajib sesuai dokumentasi
      if (currentData?.jenisPenyelenggara) {
        const organizationTypeMap = {
          'komunitas': 'COMMUNITY',
          'pemerintah': 'GOVERNMENT', 
          'perusahaan': 'CORPORATE',
          'individu': 'INDIVIDUAL'
        };
        const organizationType = organizationTypeMap[currentData.jenisPenyelenggara] || 'COMMUNITY';
        formData.append('organizationType', organizationType);
      } else {
        formData.append('organizationType', 'COMMUNITY');
      }
      
      // organizationAddress - wajib sesuai dokumentasi
      if (currentData?.organizationAddress) {
        formData.append('organizationAddress', currentData.organizationAddress);
      } else {
        formData.append('organizationAddress', 'Alamat belum diisi');
      }
      
      // instagram - wajib sesuai dokumentasi
      if (currentData?.usernameInstagram) {
        formData.append('instagram', currentData.usernameInstagram);
      } else {
        formData.append('instagram', 'belum_diisi');
      }
      
      // Debug: Log FormData
      console.log("FormData for logo upload:");
      for (let [key, value] of formData.entries()) {
        if (key === 'logo') {
          console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${(value.size/1024).toFixed(2)}KB]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      setCompressionStatus('Mengunggah gambar ke server...');
      
      // Upload menggunakan PUT method sesuai dokumentasi
      const response = await partnerService.updatePartnerProfileWithLogo(formData);
      
      console.log("Logo upload response:", response);
      
      // Sesuai dokumentasi BE, response struktur berbeda
      if (response && response.message && response.message.includes('berhasil')) {
        toast.success("Logo berhasil diunggah!");
        setCompressionStatus('✅ Upload berhasil! Logo telah disimpan.');
        
        // Karena BE tidak return avatarUrl, kita gunakan preview lokal
        // atau refresh data profile untuk mendapatkan avatar terbaru
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          onAvatarUpload(processedFile, preview); // Gunakan preview URL sementara
        }
        
        // Optional: Refresh profile data untuk mendapatkan avatar URL terbaru
        setTimeout(async () => {
          try {
            const updatedProfile = await partnerService.getPartnerProfile();
            if (updatedProfile?.data?.avatarUrl) {
              setPreview(updatedProfile.data.avatarUrl);
              if (onAvatarUpload) {
                onAvatarUpload(processedFile, updatedProfile.data.avatarUrl);
              }
            }
          } catch (refreshError) {
            console.log("Failed to refresh profile data:", refreshError);
          }
        }, 1000);
        
      } else {
        setError('Gagal mengunggah logo. Response tidak sesuai dari server.');
        console.error("Unexpected response structure:", response);
        setPreview(initialAvatarUrl || null);
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      
      setPreview(initialAvatarUrl || null);
      
      // Handle error sesuai dokumentasi BE
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message;
        
        if (statusCode === 400) {
          if (errorMessage?.includes('Dimensi')) {
            setError('Dimensi gambar tidak sesuai aturan server. Maksimal 500x500px.');
          } else if (errorMessage?.includes('organizationType')) {
            setError('Tipe organisasi tidak valid. Pilih: COMMUNITY, GOVERNMENT, CORPORATE, atau INDIVIDUAL.');
          } else if (errorMessage?.includes('instagram')) {
            setError('Username Instagram tidak valid.');
          } else if (errorMessage?.includes('organizationAddress')) {
            setError('Alamat organisasi tidak boleh kosong.');
          } else {
            setError(`Error validasi: ${errorMessage || 'Data tidak valid'}`);
          }
        } else if (statusCode === 401) {
          setError('Sesi telah berakhir. Silakan login kembali.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (statusCode === 500) {
          setError('Server sedang mengalami masalah. Silakan coba beberapa saat lagi.');
        } else if (statusCode === 413) {
          setError('File terlalu besar. Maksimal yang diperbolehkan server.');
        } else {
          setError(`Error: ${errorMessage || `Terjadi error dengan kode ${statusCode}`}`);
        }
      } else if (error.request) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setError(error.message || "Gagal mengunggah logo");
      }
      
      toast.error(error.message || "Gagal mengunggah logo");
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setCompressionStatus('');
      }, 3000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus logo?')) {
      setPreview(null);
      setAvatar(null);
      setError(null);
      setCompressionStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onAvatarUpload && typeof onAvatarUpload === 'function') {
        onAvatarUpload(null, null);
      }
      
      toast.info("Logo telah dihapus");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">
        Logo/Avatar Penyelenggara 
        <span className="text-xs text-gray-500 ml-2">(Disesuaikan otomatis ke 500x500px)</span>
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
          <div className="w-6 h-6 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin"></div>
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
      
      <p className="text-xs text-gray-500 text-center">
        Logo akan disesuaikan otomatis dengan aturan server (maksimal 500x500px).
      </p>
      
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mt-2">
        <p className="text-xs text-blue-700 font-medium mb-1">Fitur Otomatis:</p>
        <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
          <li>📏 Resize otomatis ke maksimal 500x500px</li>
          <li>✅ Mempertahankan aspect ratio gambar</li>
          <li>⚡ Optimasi kualitas gambar</li>
          <li>📤 Upload gambar hingga 10MB (akan diproses)</li>
          <li>🎯 Sesuai dengan aturan server</li>
        </ul>
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          <strong>⚠️ Catatan:</strong> Gambar akan diresize untuk memenuhi aturan server (500x500px maksimal)
        </div>
      </div>
    </div>
  );
};

export default AvatarProfilePartner;