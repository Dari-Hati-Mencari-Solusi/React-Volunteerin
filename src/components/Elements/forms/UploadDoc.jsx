import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

// Universal upload icon
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
    <path d="M16 16L12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.39 18.39C21.3653 17.8583 22.1358 17.0169 22.5799 15.9986C23.024 14.9804 23.1162 13.8432 22.8443 12.7667C22.5725 11.6901 21.9515 10.7355 21.0733 10.0534C20.1952 9.37137 19.1085 9.00072 18 9.00001H16.74C16.4373 7.82926 15.8732 6.74235 15.0899 5.82099C14.3067 4.89963 13.3248 4.16736 12.2181 3.68114C11.1113 3.19491 9.90851 2.96878 8.70008 3.01832C7.49164 3.06787 6.31381 3.39183 5.24822 3.96396C4.18264 4.53608 3.25555 5.34066 2.53828 6.31732C1.82101 7.29398 1.33086 8.41935 1.10939 9.60954C0.887916 10.7997 0.940734 12.0223 1.26423 13.1851C1.58772 14.348 2.17124 15.4202 2.96 16.32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// File/document icon
const FileIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Image icon
const ImageIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
    <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Close/delete icon
const XIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Alert/info icon
const AlertCircleIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>
);

const UploadDoc = ({ 
  onUploadSuccess, 
  initialDocumentUrl = null, 
  initialDocumentName = null,
  acceptedFileTypes = ".pdf,application/pdf", // Default to PDF, but can be overridden
  maxFileSizeMB = 5 // Default max size 5MB
}) => {
  const [preview, setPreview] = useState(initialDocumentUrl);
  const [documentName, setDocumentName] = useState(initialDocumentName);
  const [documentSize, setDocumentSize] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Parse accepted types for validation and display
  const acceptedTypesArray = acceptedFileTypes.split(',').map(type => type.trim());
  
  // Auto-detect if we're accepting images
  const acceptsImages = acceptedTypesArray.some(type => 
    type.includes('image/') || type === 'image/*' || ['.jpg','.jpeg','.png','.gif','.webp'].includes(type)
  );
  
  // Auto-detect if we're accepting PDFs
  const acceptsPDF = acceptedTypesArray.some(type => 
    type.includes('application/pdf') || type === '.pdf'
  );

  // Display text based on accepted types
  const getTypeDescription = () => {
    if (acceptsImages && acceptsPDF) return "PDF atau gambar (JPG, PNG, dll)";
    if (acceptsImages) return "gambar (JPG, PNG, GIF, WebP)";
    if (acceptsPDF) return "PDF";
    return "dokumen";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidByMime = acceptedTypesArray.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      if (type === 'image/*') {
        return file.type.startsWith('image/');
      }
      return file.type === type;
    });
    
    // Check if extension matches what we expect
    const isValidByExtension = acceptedTypesArray.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return false;
    });

    if (!isValidByMime && !isValidByExtension) {
      toast.error(`Format file tidak didukung. Gunakan ${getTypeDescription()}`);
      return;
    }

    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file tidak boleh lebih dari ${maxFileSizeMB}MB`);
      return;
    }

    // Special validation for PDF
    if (file.type === 'application/pdf' && acceptsPDF) {
      try {
        const fileBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(fileBuffer);
        
        // Check PDF header
        const pdfSignature = '%PDF';
        const fileStart = String.fromCharCode(...uint8Array.slice(0, 4));
        
        if (fileStart !== pdfSignature) {
          toast.error('File PDF tidak valid atau rusak');
          return;
        }
      } catch (validationError) {
        console.warn("Could not validate PDF content:", validationError);
      }
    }

    try {
      setLoading(true);
      
      // Create clean file object to prevent encoding issues
      const cleanFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(cleanFile);
      setPreview(fileUrl);
      setDocumentName(cleanFile.name);
      setDocumentSize(cleanFile.size);
      setDocumentType(cleanFile.type);
      
      if (onUploadSuccess && typeof onUploadSuccess === 'function') {
        try {
          onUploadSuccess(file, fileUrl);
            } catch (callbackError) {
          console.error("Error in callback:", callbackError);
          toast.error("Error processing file callback");
        }
      } else {
        console.error("onUploadSuccess is not a function:", typeof onUploadSuccess);
      }
      
      toast.success(`${acceptsImages && file.type.startsWith('image/') ? 'Gambar' : 'Dokumen'} berhasil dipilih dan siap untuk diunggah`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(`Gagal memproses ${getTypeDescription()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFile = () => {
    // Clean up object URL to prevent memory leaks
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    setPreview(null);
    setDocumentName(null);
    setDocumentSize(null);
    setDocumentType(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onUploadSuccess && typeof onUploadSuccess === 'function') {
      try {
        onUploadSuccess(null, null);
      } catch (error) {
        console.error("Error clearing file:", error);
      }
    }
    
    toast.info(`${getTypeDescription()} telah dihapus`);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Determine icon and preview based on file type
  const FileTypeIcon = () => {
    if (documentType?.startsWith('image/')) {
      return <ImageIcon size={24} className="text-[#0A3E54]" />;
    }
    return <FileIcon size={24} className="text-[#0A3E54]" />;
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Unggah {getTypeDescription()} <span className="text-red-500">*</span>
      </label>
      
      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white">
        {preview ? (
          <div className="space-y-3">
            {/* Smart preview based on file type */}
            <div className="flex justify-center">
              {documentType?.startsWith('image/') ? (
                <div className="relative max-w-sm">
                  <img 
                    src={preview} 
                    alt="Preview dokumen" 
                    className="w-full h-auto max-h-64 object-contain rounded border shadow-sm"
                    onError={(e) => {
                      console.error("Error loading image preview");
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileIcon size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{getTypeDescription()} Ready</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Lihat Preview" to open</p>
                </div>
              )}
            </div>
            
            {/* File Info */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-3">
                <FileTypeIcon />
                <div>
                  <p className="font-medium truncate max-w-[300px]" title={documentName}>
                    {documentName}
                  </p>
                  {documentSize && (
                    <p className="text-xs text-gray-500">
                      {(documentSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  <p className="text-xs text-green-600">✓ Siap untuk diunggah</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.open(preview, '_blank')}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200 transition-colors"
                >
                  Lihat Preview
                </button>
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-1 text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Hapus file"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full min-h-32">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-500">Memproses file...</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="flex flex-col items-center px-6 py-8 cursor-pointer hover:bg-gray-50 transition-colors w-full rounded focus:outline-none focus:ring-2 focus:ring-[#0A3E54] focus:ring-opacity-20"
                >
                  <UploadIcon />
                  <span className="text-sm text-gray-500 font-medium mt-2">
                    Unggah {getTypeDescription()}
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    Klik untuk memilih file {getTypeDescription()} (maksimal {maxFileSizeMB}MB)
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
          accept={acceptedFileTypes}
          className="hidden"
        />
      </div>
      
      {/* Adaptive guidelines based on accepted file types */}
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500">
          Format yang didukung: {acceptsImages && acceptsPDF ? "PDF, JPG, PNG, GIF, WebP" : 
                               acceptsImages ? "JPG, PNG, GIF, WebP" : 
                               acceptsPDF ? "PDF" : 
                               "Dokumen"} (maksimum {maxFileSizeMB}MB)
        </p>
        
        {acceptsPDF && (
          <>
            <div className="flex items-start space-x-2">
              <AlertCircleIcon size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-600">
                Pastikan dokumen PDF dapat dibuka dan dibaca dengan baik
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircleIcon size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-orange-600">
                Dokumen harus dalam format PDF asli, bukan hasil scan yang di-convert
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircleIcon size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-600">
                Pastikan PDF tidak terproteksi password
              </p>
            </div>
          </>
        )}
        
        {acceptsImages && (
          <>
            <div className="flex items-start space-x-2">
              <AlertCircleIcon size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-600">
                Pastikan gambar dokumen jelas dan dapat dibaca dengan baik
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircleIcon size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-orange-600">
                Foto/scan dokumen dengan pencahayaan yang cukup dan tanpa blur
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadDoc;