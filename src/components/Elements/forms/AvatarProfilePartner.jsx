import React, { useState, useEffect, useRef } from 'react';
import { X, User, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { partnerService } from '../../../services/partnerService';

const AvatarProfilePartner = ({ onAvatarUpload, initialAvatarUrl }) => {
  const [preview, setPreview] = useState(initialAvatarUrl || null);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Effect untuk memuat avatar dari initialAvatarUrl jika tersedia
  useEffect(() => {
    if (initialAvatarUrl) {
      setPreview(initialAvatarUrl);
      setError(null); // Reset error jika avatar berhasil dimuat
    }
  }, [initialAvatarUrl]);

  const handleFileChange = async (e) => {
    // Reset error state
    setError(null);
    
    const file = e.target.files[0];
    if (!file) return;

    // Validasi file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setError('Format file harus JPG, JPEG, atau PNG');
      toast.error('Format file harus JPG, JPEG, atau PNG');
      return;
    }

    if (file.size > maxSize) {
      setError(`Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maksimal 2MB`);
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    // Preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Set file untuk upload
    setAvatar(file);

    try {
      setLoading(true);
      
      // Buat FormData baru
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Upload avatar
      const response = await partnerService.uploadAvatar(formData);
      
      console.log("Avatar upload response:", response);
      
      // Cek apakah response sesuai dengan struktur yang diharapkan
      // Berdasarkan response struktur API yang diberikan, perlu menyesuaikan
      if (response && response.data && response.data.user && response.data.user.avatarUrl) {
        // Gunakan avatarUrl dari response
        const avatarUrl = response.data.user.avatarUrl;
        setPreview(avatarUrl);
        toast.success("Logo berhasil diunggah!");
        
        // Panggil callback jika disediakan
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          onAvatarUpload(file, avatarUrl);
        }
      } else {
        // Fallback jika response tidak sesuai harapan
        setError('Gagal mengunggah logo. Response tidak valid dari server.');
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      
      // Set specific error message based on error type
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message;
        
        if (statusCode === 413) {
          setError('Ukuran file terlalu besar untuk server. Gunakan file yang lebih kecil.');
        } else if (statusCode === 415) {
          setError('Format file tidak didukung oleh server.');
        } else if (statusCode === 401) {
          setError('Sesi telah berakhir. Silakan login kembali.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (errorMessage) {
          setError(`Error: ${errorMessage}`);
        } else {
          setError(`Terjadi error dengan kode ${statusCode}`);
        }
      } else if (error.request) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setError(error.message || "Gagal mengunggah logo");
      }
      
      // Tampilkan toast error
      toast.error(error.message || "Gagal mengunggah logo");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = () => {
    // Konfirmasi penghapusan avatar
    if (window.confirm('Apakah Anda yakin ingin menghapus logo?')) {
      setPreview(null);
      setAvatar(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Optional: Jika API menyediakan endpoint untuk menghapus avatar
      try {
        partnerService.removeAvatar().then(() => {
          toast.info("Logo telah dihapus");
        }).catch(err => {
          console.error("Error removing avatar:", err);
        });
      } catch (error) {
        console.error("Error in removeAvatar:", error);
      }
      
      // Notify parent component that avatar was removed
      if (onAvatarUpload && typeof onAvatarUpload === 'function') {
        onAvatarUpload(null, null);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">
        Logo/Avatar Penyelenggara 
        <span className="text-xs text-gray-500 ml-2">(Opsional, max 2MB)</span>
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
                e.target.src = 'https://placehold.co/200x200?text=Error'; // Fallback image
              }}
            />
            <button 
              type="button"
              onClick={removeAvatar}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              aria-label="Hapus logo"
            >
              <X size={16} />
            </button>
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
        </div>
      )}
      
      {/* Error message display */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start space-x-2">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        Logo akan ditampilkan pada profil dan daftar event Anda. Format: JPG, JPEG, atau PNG (Maks. 2MB)
      </p>
      
      {/* Panduan upload image yang baik */}
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mt-2">
        <p className="text-xs text-blue-700 font-medium mb-1">Tips Mengunggah Logo:</p>
        <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
          <li>Gunakan gambar beresolusi tinggi (minimal 300x300 pixel)</li>
          <li>Pastikan logo terpusat dan terlihat jelas</li>
          <li>Hindari logo dengan banyak teks kecil</li>
          <li>Jika mengalami masalah, coba kompres gambar terlebih dahulu</li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarProfilePartner;