import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { partnerService } from "../../services/partnerService";
import UploadDoc from '../Elements/forms/UploadDoc';

// Custom SVG icons to replace lucide-react dependency
const FileIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>
);

const InfoIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
  </svg>
);

const LegalitasPage = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  const [formData, setFormData] = useState({
    namaDocument: "",
    document: null,
    documentUrl: "",
    keterangan: "",
  });

  // Fetch existing documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await partnerService.getLegalDocuments();
      console.log("Fetched documents:", response);
      
      // Handle different response structures from backend
      if (response?.data) {
        if (Array.isArray(response.data)) {
          setDocuments(response.data);
        } 
        else if (typeof response.data === 'object') {
          setDocuments([response.data]);
        } 
        else {
          setDocuments([]);
        }
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching legal documents:", error);
      
      // Don't show error for 404 (no documents yet)
      if (error.response?.status !== 404) {
        toast.error("Failed to load legal documents");
      }
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocUpload = (file, url) => {
    console.log("File received in handleDocUpload:", file);
    console.log("URL received:", url);
    
    setFormData(prev => ({
      ...prev,
      document: file,
      documentUrl: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If legal documents already exist, show warning and cancel upload
    if (documents.length > 0) {
      toast.warning("Legal documents already exist and cannot be changed");
      return;
    }
    
    console.log("=== SUBMIT FORM ===");
    console.log("Current formData:", formData);
    
    // Form validation
    const errors = [];
    
    if (!formData.namaDocument.trim()) {
      errors.push("Document name cannot be empty");
    }

    if (!formData.document) {
      errors.push("No document has been uploaded");
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSaving(true);
      console.log("Preparing to upload document...");

      // Create FormData according to backend specifications
      const fileFormData = new FormData();
      
      // Required fields: documentName, document, information (optional)
      fileFormData.append('documentName', formData.namaDocument.trim());
      fileFormData.append('document', formData.document);
      
      // Only add information if provided
      if (formData.keterangan.trim()) {
        fileFormData.append('information', formData.keterangan.trim());
      }
      
      // Log form data for debugging
      console.log("Sending to API:");
      for (let [key, value] of fileFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File: ${value.name}, type: ${value.type}, size: ${value.size} bytes]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Upload document with separate error handling
      let response;
      try {
        response = await partnerService.uploadLegalDocument(fileFormData);
        console.log("Upload response:", response);
      } catch (uploadError) {
        console.error("Upload API Error:", uploadError);
        throw new Error(uploadError.message || "Failed to upload document to server");
      }
      
      // Handle successful response
      if (response && response.data) {
        // Show success message from backend
        const successMessage = response.message || "Legal document saved successfully";
        toast.success(successMessage);
        
        // Add new document to list
        setDocuments([response.data]);
        
        // Reset form
        setFormData({
          namaDocument: "",
          document: null,
          documentUrl: "",
          keterangan: "",
        });
        
        // Refresh documents to ensure latest data
        setTimeout(() => {
          fetchDocuments();
        }, 1000);
      } else {
        throw new Error("Response does not match expected format");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      <h1 className="title">Legalitas</h1>
      
      {/* Existing Documents Section */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-t-2 border-b-2 border-[#0A3E54] rounded-full animate-spin"></div>
        </div>
      ) : documents.length > 0 ? (
        <div className="w-full">
          <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
            <h2 className="text-lg font-semibold">Dokumen Legalitas yang Tersimpan</h2>
          </div>
          <div className="bg-[#F7F7F7] p-6 rounded-b">
            {/* Document immutability notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <InfoIcon size={20} className="text-blue-500" />
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Informasi:</span> Dokumen legalitas yang sudah diunggah tidak dapat diubah sesuai ketentuan yang berlaku.
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileIcon size={24} className="text-[#0A3E54]" />
                    <div>
                      <p className="font-medium">{doc.documentName}</p>
                      <p className="text-sm text-gray-500">
                        {doc.information || "Tidak ada keterangan tambahan"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Diunggah: {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={doc.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#0A3E54] text-white text-sm rounded hover:bg-[#0a2e3e]"
                    >
                      Lihat Dokumen
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submission status info */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircleIcon size={20} className="text-yellow-500 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <span className="font-medium">Status Pengajuan:</span> 
                  <p className="mt-1">
                    Dokumen Anda sedang dalam proses persetujuan. Silakan menunggu hingga 2 × 24 jam kerja untuk proses persetujuan proposal Anda. 
                    Jika melebihi waktu tersebut, silakan hubungi CS Kerjasama.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-gray-50 border rounded-lg p-8 text-center">
          <div className="mx-auto text-gray-300 mb-3 flex justify-center">
            <FileIcon size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">Belum ada dokumen legalitas</h3>
          <p className="text-sm text-gray-500">
            Silakan unggah dokumen legalitas Anda untuk memulai. Perhatikan bahwa dokumen hanya dapat diunggah sekali.
          </p>
        </div>
      )}
      
      {/* Upload New Document Section - Only show if no documents exist */}
      {documents.length === 0 && (
        <div className="w-full">
          <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
            <h2 className="text-lg font-semibold">Unggah Dokumen Legalitas</h2>
          </div>
          <div className="bg-[#F7F7F7] p-6 rounded-b">
            {/* One-time upload warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircleIcon size={20} className="text-yellow-500" />
                <div className="text-sm text-yellow-700">
                  <span className="font-medium">Perhatian Penting:</span> Dokumen legalitas hanya dapat diunggah satu kali dan tidak dapat diubah setelah tersimpan. Pastikan semua informasi sudah benar.
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaDocument"
                  value={formData.namaDocument}
                  onChange={handleInputChange}
                  placeholder="Contoh: Proposal Pengajuan Sponsor Universitas Diponegoro"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan nama dokumen yang jelas dan deskriptif
                </p>
              </div>

              {/* Document upload component */}
              <UploadDoc onUploadSuccess={handleDocUpload} />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Keterangan <span className="text-gray-400">(Opsional)</span>
                </label>
                <textarea 
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  rows="4" 
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white" 
                  placeholder="Tambahkan keterangan tambahan tentang dokumen (tidak wajib diisi)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Keterangan tambahan tentang dokumen, misalnya: catatan khusus, versi dokumen, dll.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-8 py-3 bg-[#0A3E54] text-white rounded-lg font-medium hover:bg-[#0a2e3e] transition-colors ${
                    saving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    "Simpan Dokumen"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Informative section when document exists */}
      {!loading && documents.length > 0 && (
        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <InfoIcon size={24} className="text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Dokumen Legalitas Sudah Tersedia</h3>
              <p className="text-blue-700 mb-2">
                Anda telah mengunggah dokumen legalitas dan tidak dapat mengubahnya. 
                Dokumen sedang dalam proses persetujuan tim CS Kerjasama.
              </p>
              <p className="text-sm text-blue-600">
                Untuk bantuan lebih lanjut, silakan hubungi: <span className="font-medium">CS Kerjasama</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalitasPage;