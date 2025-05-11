import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { toast } from 'react-toastify';

const UploadDoc = ({ onUploadSuccess, initialDocumentUrl = null, initialDocumentName = null }) => {
  const [preview, setPreview] = useState(initialDocumentUrl);
  const [documentName, setDocumentName] = useState(initialDocumentName);
  const [documentSize, setDocumentSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type (allow PDF and common document formats)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan PDF');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file tidak boleh lebih dari 5MB');
      return;
    }

    try {
      setLoading(true);
      
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      setDocumentName(file.name);
      setDocumentSize(file.size);
      
      if (onUploadSuccess) {
        onUploadSuccess(file, fileUrl);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Gagal memproses dokumen');
    } finally {
      setLoading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const handleClearFile = () => {
    setPreview(null);
    setDocumentName(null);
    setDocumentSize(null);
    if (onUploadSuccess) {
      onUploadSuccess(null, null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Unggah Dokumen <span className="text-red-500">*</span>
      </label>
      
      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white">
        {preview ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="flex items-center gap-3">
              <File size={24} className="text-[#0A3E54]" />
              <div>
                <p className="font-medium truncate max-w-[300px]">
                  {documentName}
                </p>
                {documentSize && (
                  <p className="text-xs text-gray-500">
                    {(documentSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClickUpload}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleClearFile}
                className="p-1 text-red-500 rounded-full hover:bg-red-50"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full min-h-32">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-500">Memproses...</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="flex flex-col items-center px-6 py-8 cursor-pointer"
                >
                  <Upload size={32} className="mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Unggah dokumen (PDF, max 5MB)
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
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Format PDF/DOC/DOCX dengan ukuran maksimum 5MB
      </p>
    </div>
  );
};

export default UploadDoc;