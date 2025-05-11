import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { partnerService } from "../../../services/partnerService";

const UploadKTP = ({ onUploadSuccess, initialImageUrl = null }) => {
  const [preview, setPreview] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG, dll)');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file tidak boleh lebih dari 2MB');
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('ktpImage', file);
      
      const response = await partnerService.uploadKtpImage(formData);
      
      if (response && response.data) {
        const { ktpUrl, ktpImageId } = response.data;
        setPreview(ktpUrl);
        
        if (onUploadSuccess) {
          onUploadSuccess(file, ktpUrl, ktpImageId);
        }
        
        toast.success('KTP berhasil diunggah');
      }
    } catch (error) {
      console.error('Error uploading KTP:', error);
      toast.error(error.message || 'Gagal mengunggah KTP');
    } finally {
      setLoading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Upload KTP <span className="text-red-500">*</span>
      </label>
      
      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white">
        {preview ? (
          <div className="flex flex-col items-center">
            <img 
              src={preview} 
              alt="Preview KTP" 
              className="max-h-48 max-w-full object-contain mb-3"
            />
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={handleClickUpload}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                <Upload size={16} />
                <span>Ganti Foto</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full min-h-32">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-500">Mengunggah...</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="flex flex-col items-center px-6 py-8 cursor-pointer"
                >
                  <Upload size={32} className="mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Upload KTP (JPG, PNG, max 2MB)
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    Klik atau drag & drop di sini
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
          accept="image/*"
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Pastikan foto KTP jelas dan dapat dibaca
      </p>
    </div>
  );
};

export default UploadKTP;