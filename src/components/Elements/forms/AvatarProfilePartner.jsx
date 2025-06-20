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
  
  // Tambahkan definisi reverseOrganizationTypeMap di sini
  const reverseOrganizationTypeMap = {
    'komunitas': 'COMMUNITY',
    'pemerintah': 'GOVERNMENT', 
    'perusahaan': 'CORPORATE',
    'individu': 'INDIVIDUAL'
  };

  // Effect untuk memuat avatar dari initialAvatarUrl jika tersedia
  useEffect(() => {
    if (initialAvatarUrl) {
      // Coba ambil dari localStorage terlebih dahulu untuk mencegah CORS
      const savedLogo = localStorage.getItem('partnerLogoPreview');
      if (savedLogo) {
        setPreview(savedLogo);
        setLocalLogoDataUrl(savedLogo);
      } else {
        setPreview(initialAvatarUrl);
      }
      setError(null);
    } else {
      // Jika tidak ada initialAvatarUrl, coba cari di localStorage
      const savedLogo = localStorage.getItem('partnerLogoPreview');
      if (savedLogo) {
        setPreview(savedLogo);
        setLocalLogoDataUrl(savedLogo);
      }
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

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
  
      img.onload = () => {
        const { width, height } = img;
        
        // Resize dengan maksimum 300px dimensions
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
  
        // Latar belakang putih
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Gambar
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        // Gunakan kualitas 85% secara konsisten
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Gagal memproses gambar'));
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
      
      // SIMPAN PREVIEW LOKAL DARI FILE ASLI
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const localPreviewUrl = fileReader.result;
        // Simpan preview lokal di localStorage untuk mencegah masalah CORS
        try {
          localStorage.setItem('partnerLogoPreview', localPreviewUrl);
          setLocalLogoDataUrl(localPreviewUrl);
        } catch (e) {
          console.log("Error menyimpan logo ke localStorage:", e);
        }
        
        // Set preview lokal
        setPreview(localPreviewUrl);
      };
      fileReader.readAsDataURL(file);
  
      setCompressionStatus('Mengoptimalkan gambar...');
      
      // Resize image
      const resizeResult = await resizeImage(file);
      const processedFile = resizeResult.file;
      
      console.log('Resize result:', resizeResult);
      setCompressionStatus(`Optimasi selesai: ${resizeResult.originalDimensions} → ${resizeResult.finalDimensions}, ${resizeResult.resizedSize.toFixed(1)}KB`);
      
      // Validasi ukuran akhir
      if (processedFile.size > 200 * 1024) {
        setError(`Gambar masih terlalu besar: ${(processedFile.size / 1024).toFixed(1)}KB. Maksimal 200KB.`);
        toast.error("Gambar terlalu besar setelah kompresi. Coba gambar lain yang lebih sederhana.");
        setLoading(false);
        return;
      }
      
      // SIMPAN PREVIEW DARI FILE TERKOMPRESI KE LOCALSTORAGE
      const processedReader = new FileReader();
      processedReader.onloadend = () => {
        const processedDataUrl = processedReader.result;
        try {
          localStorage.setItem('partnerLogoPreview', processedDataUrl);
          setLocalLogoDataUrl(processedDataUrl);
          
          // Update preview dengan hasil kompresi
          setPreview(processedDataUrl);
        } catch (e) {
          console.log("Error menyimpan logo terkompresi ke localStorage:", e);
        }
      };
      processedReader.readAsDataURL(processedFile);
      
      setAvatar(processedFile);
      
      const API_URL = import.meta.env.VITE_BE_BASE_URL;
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan');
      }
      
      // PENDEKATAN BARU: Coba buat profil terlebih dahulu tanpa peduli apakah sudah ada atau belum
      try {
        setCompressionStatus('Mempersiapkan profil...');
        
        // Ambil data profil yang diperlukan
        const currentData = getCurrentFormData();
        const organizationType = currentData?.jenisPenyelenggara 
          ? (reverseOrganizationTypeMap[currentData.jenisPenyelenggara] || 'COMMUNITY') 
          : 'COMMUNITY';
        const organizationAddress = currentData?.organizationAddress || 'Alamat Penyelenggara';
        const instagram = currentData?.usernameInstagram || 'instagram_handle';
        
        // PERBAIKAN: Gunakan FormData untuk POST & PUT (bukan JSON)
        
        // Buat FormData untuk operasi create/update profil
        const profileFormData = new FormData();
        profileFormData.append('organizationType', organizationType);
        profileFormData.append('organizationAddress', organizationAddress);
        profileFormData.append('instagram', instagram);
        
        // Tambahkan dummy file untuk memenuhi persyaratan backend
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
        
        // PENDEKATAN BARU: Coba POST untuk membuat profil baru terlebih dahulu
        console.log("Mencoba membuat profil baru dengan POST...");
        setCompressionStatus('Mencoba membuat profil baru...');
        try {
          // FormData untuk POST (tambahkan logo dummy)
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
            console.log("Profil berhasil dibuat:", createData);
            setCompressionStatus('Profil berhasil dibuat, mengupload logo...');
          } else {
            console.log("Pembuatan profil gagal:", createData);
            // Lanjutkan ke metode PUT (kemungkinan profil sudah ada)
          }
        } catch (createError) {
          console.log("Error saat mencoba membuat profil:", createError);
          // Tetap lanjutkan ke metode PUT
        }
        
        // PERBAIKAN: Sekarang upload logo yang sesungguhnya dengan PUT
        console.log("Mengupload logo dengan PUT...");
        setCompressionStatus('Mengunggah logo ke server...');
        
        // FormData untuk upload logo
        const logoFormData = new FormData();
        logoFormData.append('logo', processedFile);
        logoFormData.append('organizationType', organizationType);
        logoFormData.append('organizationAddress', organizationAddress);
        logoFormData.append('instagram', instagram);
        
        const uploadResponse = await fetch(`${API_URL}/partners/me/profile`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`
            // JANGAN set Content-Type untuk multipart/form-data
          },
          body: logoFormData
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || `Gagal upload logo! Status: ${uploadResponse.status}`);
        }
        
        const uploadData = await uploadResponse.json();
        console.log("Logo berhasil diupload:", uploadData);
        
        setCompressionStatus('✅ Logo berhasil diunggah ke server!');
        toast.success("Logo berhasil diunggah!");
        
        // PERBAIKAN: Gunakan server URL untuk metadata tetapi tetap tampilkan logo lokal
        // untuk menghindari masalah CORS
        const serverLogoUrl = `${API_URL}/partners/me/logo?t=${Date.now()}`;
        
        // Panggil callback jika ada
        if (onAvatarUpload && typeof onAvatarUpload === 'function') {
          // PENTING: Kirim preview lokal sebagai parameter ketiga untuk digunakan tampilan
          onAvatarUpload(processedFile, serverLogoUrl, localLogoDataUrl || processedReader.result);
        }
        
      } catch (profileError) {
        console.error("Error saat memeriksa/membuat profil:", profileError);
        throw profileError;
      }
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      
      // Coba gunakan preview lokal yang tersimpan jika ada
      const savedPreview = localStorage.getItem('partnerLogoPreview');
      if (savedPreview) {
        setPreview(savedPreview);
      } else {
        setPreview(initialAvatarUrl || null);
      }
      
      const errorMessage = error.message || "Gagal mengunggah logo";
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
    if (window.confirm('Apakah Anda yakin ingin menghapus logo?')) {
      try {
        setLoading(true);
        setCompressionStatus('Menghapus logo...');
        
        // Hapus dari localStorage
        localStorage.removeItem('partnerLogoPreview');
        setLocalLogoDataUrl(null);
        
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
                
                // Coba ambil dari localStorage jika gambar gagal load
                const savedPreview = localStorage.getItem('partnerLogoPreview');
                if (savedPreview) {
                  console.log("Using saved logo from localStorage");
                  e.target.src = savedPreview;
                  return;
                }
                
                // Fallback ke error placeholder
                setError("Gagal memuat gambar. Coba upload logo baru.");
                e.target.src = 'https://placehold.co/200x200?text=Logo';
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