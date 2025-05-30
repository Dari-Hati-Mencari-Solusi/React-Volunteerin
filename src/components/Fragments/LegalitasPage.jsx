import React, { useState, useEffect } from 'react';
import { File, AlertCircle, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { partnerService } from "../../services/partnerService";
import UploadDoc from '../Elements/forms/UploadDoc';
import httpClient from '../../utils/httpClient';

const API_URL = import.meta.env.VITE_BE_BASE_URL;

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

  // Define fetchDocuments function outside useEffect to reuse it
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await partnerService.getLegalDocuments();
      console.log("Fetched documents:", response);
      
      // Handle null data from API
      if (response?.data && Array.isArray(response.data)) {
        setDocuments(response.data);
      } else if (response?.data) {
        // If data is not an array but exists
        setDocuments([response.data]);
      } else {
        // If data is null
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching legal documents:", error);
      toast.error("Gagal memuat dokumen legalitas");
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
    setFormData({
      ...formData,
      document: file,
      documentUrl: url,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Jika sudah ada dokumen legalitas, berikan pesan dan batalkan upload
    if (documents.length > 0) {
      toast.warning("Dokumen legalitas sudah tersedia dan tidak dapat diubah");
      return;
    }
    
    console.log("Submit button clicked", formData);
    
    // Validate all form inputs
    const errors = [];
    
    if (!formData.namaDocument.trim()) {
      errors.push("Nama dokumen tidak boleh kosong");
    }

    if (!formData.document) {
      errors.push("Anda belum mengunggah dokumen");
    }
    
    if (!formData.keterangan.trim()) {
      errors.push("Keterangan dokumen tidak boleh kosong");
    }

    // If there are errors, show them in toast and return
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSaving(true);
      console.log("Preparing to upload document...");

      // Create FormData for file upload
      const fileFormData = new FormData();
      
      // Append form data with correct field names based on API docs
      fileFormData.append('document', formData.document);
      fileFormData.append('documentName', formData.namaDocument);
      fileFormData.append('information', formData.keterangan); // Make sure to always send information

      // Debug: Log what's being sent
      console.log("Sending document:", formData.document.name);
      console.log("Document name:", formData.namaDocument);
      
      // Upload the document
      const response = await partnerService.uploadLegalDocument(fileFormData);
      
      console.log("Upload response:", response);
      
      if (response?.data) {
        toast.success(response.message || "Dokumen legalitas berhasil disimpan");
        
        // Add new document to list
        setDocuments(prev => [...prev, response.data]);
        
        // Reset form
        setFormData({
          namaDocument: "",
          document: null,
          documentUrl: "",
          keterangan: "",
        });
        
        // Force reload documents to ensure latest data
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(error.message || "Gagal mengunggah dokumen");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    // Disable delete functionality
    toast.warning("Dokumen legalitas tidak bisa dihapus setelah diunggah");
    return;
    
    // Kode delete lama dinonaktifkan karena tidak diperlukan lagi
    /*
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      return;
    }
    
    try {
      console.log(`Menghapus dokumen: ${documentId}`);
      ... kode lainnya ...
    } catch (error) {
      ... kode lainnya ...
    }
    */
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
            {/* Notification that document can't be changed */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Info size={20} className="text-blue-500" />
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Informasi:</span> Dokumen legalitas yang sudah diunggah tidak dapat diubah sesuai ketentuan yang berlaku.
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <File size={24} className="text-[#0A3E54]" />
                    <div>
                      <p className="font-medium">{doc.documentName}</p>
                      <p className="text-sm text-gray-500">{doc.information || "Tidak ada keterangan"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={doc.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#0A3E54] text-white text-sm rounded hover:bg-[#0a2e3e]"
                    >
                      Lihat
                    </a>
                    {/* Tombol hapus dihilangkan karena dokumen tidak bisa dihapus */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-gray-50 border rounded-lg p-8 text-center">
          <div className="mx-auto text-gray-300 mb-3 flex justify-center">
            <File size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">Belum ada dokumen legalitas</h3>
          <p className="text-sm text-gray-500">Silakan unggah dokumen legalitas Anda untuk memulai. Perhatikan bahwa dokumen hanya dapat diunggah sekali.</p>
        </div>
      )}
      
      {/* Upload New Document Section - Only show if no documents exist */}
      {documents.length === 0 && (
        <div className="w-full">
          <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
            <h2 className="text-lg font-semibold">Unggah Dokumen Legalitas</h2>
          </div>
          <div className="bg-[#F7F7F7] p-6 rounded-b">
            {/* Warning about one-time upload */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-yellow-500" />
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
                  placeholder="Contoh: Akta Pendirian, NPWP, SIUP, dll"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                  required
                />
              </div>

              {/* Use the UploadDoc component */}
              <UploadDoc onUploadSuccess={handleDocUpload} />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  rows="4" 
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white" 
                  placeholder="Tambahkan keterangan dokumen di sini..."
                  required
                >
                </textarea>
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
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Informative section when document already exists */}
      {!loading && documents.length > 0 && (
        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Info size={24} className="text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Dokumen Legalitas Sudah Tersedia</h3>
              <p className="text-blue-700 mb-2">
                Anda telah mengunggah dokumen legalitas dan tidak dapat mengubahnya. 
                Jika Anda memerlukan perubahan pada dokumen, silakan hubungi tim dukungan.
              </p>
              <p className="text-sm text-blue-600">
                Untuk bantuan lebih lanjut, silakan hubungi: <span className="font-medium">support@volunteerin.id</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalitasPage;