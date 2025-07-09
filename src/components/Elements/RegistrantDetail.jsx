import React, { useState } from 'react';
import { X, Download, Eye, FileText, Image, File } from 'lucide-react';

const RegistrantDetail = ({ registrant, onClose, onReview, reviewLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);

  if (!registrant) return null;

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Get name from answers or user
  const getRegistrantName = (registrant) => {
    if (registrant.answers && registrant.answers.fullName) {
      return registrant.answers.fullName;
    }
    return registrant.user?.name || 'Tidak tersedia';
  };

  // Get email from answers or user
  const getRegistrantEmail = (registrant) => {
    if (registrant.answers && registrant.answers.emailAddress) {
      return registrant.answers.emailAddress;
    }
    return registrant.user?.email || 'Tidak tersedia';
  };

  // Get phone from answers or user
  const getRegistrantPhone = (registrant) => {
    if (registrant.answers && registrant.answers.phoneNumber) {
      return registrant.answers.phoneNumber;
    }
    return registrant.user?.phoneNumber || 'Tidak tersedia';
  };

  // Format field name untuk display
  const formatFieldName = (fieldName) => {
    const fieldMap = {
      'fullName': 'Nama Lengkap',
      'emailAddress': 'Email',
      'phoneNumber': 'Nomor Telepon',
      'address': 'Alamat',
      'dateOfBirth': 'Tanggal Lahir',
      'occupation': 'Pekerjaan',
      'institution': 'Institusi',
      'experience': 'Pengalaman',
      'motivation': 'Motivasi',
      'skills': 'Keahlian',
      'availability': 'Ketersediaan',
      'emergencyContact': 'Kontak Darurat',
      'gender': 'Jenis Kelamin',
      'education': 'Pendidikan',
      'cv': 'CV/Resume',
      'portfolio': 'Portfolio',
      'certificate': 'Sertifikat',
      'identityCard': 'Kartu Identitas',
      'supportingDocument': 'Dokumen Pendukung'
    };

    if (fieldMap[fieldName]) {
      return fieldMap[fieldName];
    }

    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Check if file is viewable in browser
  const isFileViewable = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(extension);
  };

  // Handle file view
  const handleFileView = (fileUrl, fileName) => {
    setSelectedFile({ url: fileUrl, name: fileName });
    setFileViewerOpen(true);
  };

  // Handle file download
  const handleFileDownload = (fileUrl, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: open in new tab
      window.open(fileUrl, '_blank');
    }
  };

  // Get uploaded files from answers
  const getUploadedFiles = () => {
    if (!registrant.answers) return [];
    
    const files = [];
    
    Object.entries(registrant.answers).forEach(([key, value]) => {
      // Check if value is a file URL (contains file extensions or is a URL)
      if (value && typeof value === 'string' && 
          (value.includes('.pdf') || value.includes('.doc') || value.includes('.jpg') || 
           value.includes('.jpeg') || value.includes('.png') || value.includes('.gif') ||
           value.startsWith('http') || value.startsWith('/uploads'))) {
        
        // Extract filename from URL
        const fileName = value.split('/').pop() || `${formatFieldName(key)}.file`;
        
        files.push({
          fieldName: key,
          displayName: formatFieldName(key),
          fileName: fileName,
          fileUrl: value,
          fileType: fileName.split('.').pop()?.toLowerCase() || 'unknown'
        });
      }
    });
    
    return files;
  };

  // File Viewer Component
  const FileViewer = ({ file, onClose }) => {
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop()?.toLowerCase());
    const isPDF = file.name.split('.').pop()?.toLowerCase() === 'pdf';
    
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="bg-gray-800 p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{file.name}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleFileDownload(file.url, file.name)}
                className="text-white hover:text-gray-300 transition-colors"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
            {isImage ? (
              <div className="flex justify-center">
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-center text-gray-500 mt-8">
                  <File size={48} className="mx-auto mb-4" />
                  <p>Tidak dapat menampilkan gambar</p>
                  <button
                    onClick={() => handleFileDownload(file.url, file.name)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Download File
                  </button>
                </div>
              </div>
            ) : isPDF ? (
              <iframe
                src={file.url}
                className="w-full h-full border-0"
                title={file.name}
                onError={() => {
                  console.error('Error loading PDF');
                }}
              />
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <File size={48} className="mx-auto mb-4" />
                <p>Preview tidak tersedia untuk tipe file ini</p>
                <button
                  onClick={() => handleFileDownload(file.url, file.name)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const uploadedFiles = getUploadedFiles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-[#0A3E54] p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">Detail Pendaftar</h3>
          <button 
            onClick={onClose} 
            disabled={reviewLoading}
            className={`text-white transition-colors ${
              reviewLoading ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-200'
            }`}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Status Pendaftar:</h4>
              <div className="flex items-center gap-2">
                {registrant.status === "ACCEPTED" ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Diterima
                  </span>
                ) : registrant.status === "REJECTED" ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Ditolak
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Belum Diproses
                  </span>
                )}
                
                {reviewLoading && (
                  <div className="flex items-center ml-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#0A3E54]"></div>
                    <span className="text-sm text-gray-600 ml-2">Memproses...</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            {registrant.status !== "ACCEPTED" && registrant.status !== "REJECTED" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onReview('rejected')}
                  disabled={reviewLoading}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    reviewLoading 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {reviewLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Tolak Pendaftar
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => onReview('accepted')}
                  disabled={reviewLoading}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    reviewLoading 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {reviewLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Terima Pendaftar
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Basic Information */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-4">Informasi Pendaftar</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Nama Pendaftar</p>
                <p className="font-medium text-gray-900">{getRegistrantName(registrant)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">{getRegistrantEmail(registrant)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Telepon</p>
                <p className="font-medium text-gray-900">{getRegistrantPhone(registrant)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Waktu Pendaftaran</p>
                <p className="font-medium text-gray-900">{formatDate(registrant.submittedAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Uploaded Files/Documents */}
          {uploadedFiles.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-700 mb-4">Dokumen yang Diupload</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.fileName)}
                        <div>
                          <p className="font-medium text-gray-900">{file.displayName}</p>
                          <p className="text-sm text-gray-500">{file.fileName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isFileViewable(file.fileName) && (
                          <button
                            onClick={() => handleFileView(file.fileUrl, file.fileName)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleFileDownload(file.fileUrl, file.fileName)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Form Answers */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-4">Jawaban Formulir</h4>
            
            {registrant.answers && Object.keys(registrant.answers).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(registrant.answers).map(([key, value]) => {
                  // Skip basic fields and file fields
                  if (['fullName', 'emailAddress', 'phoneNumber'].includes(key)) {
                    return null;
                  }
                  
                  // Skip file fields (already shown in documents section)
                  if (value && typeof value === 'string' && 
                      (value.includes('.pdf') || value.includes('.doc') || value.includes('.jpg') || 
                       value.includes('.jpeg') || value.includes('.png') || value.includes('.gif') ||
                       value.startsWith('http') || value.startsWith('/uploads'))) {
                    return null;
                  }
                  
                  return (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1 font-medium">
                        {formatFieldName(key)}
                      </p>
                      <p className="text-gray-900">
                        {value || 'Tidak diisi'}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Tidak ada jawaban formulir tersedia</p>
              </div>
            )}
          </div>
          
          {/* Participation History */}
          {registrant.user?.participations && registrant.user.participations.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-700 mb-4">Riwayat Partisipasi</h4>
              
              <div className="space-y-3">
                {registrant.user.participations.map((participation, index) => (
                  <div key={index} className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {participation.eventName || 'Untitled Event'}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          {participation.eventDate || 'Tanggal tidak tersedia'}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          participation.status === "COMPLETED" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {participation.status === "COMPLETED" ? "Selesai" : "Sedang Berlangsung"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional Info */}
          {registrant.user && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-700 mb-4">Informasi Tambahan</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registrant.user.dateOfBirth && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Tanggal Lahir</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(registrant.user.dateOfBirth)}
                    </p>
                  </div>
                )}
                
                {registrant.user.gender && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Jenis Kelamin</p>
                    <p className="font-medium text-gray-900">
                      {registrant.user.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                )}
                
                {registrant.user.address && (
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Alamat</p>
                    <p className="font-medium text-gray-900">{registrant.user.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={reviewLoading}
              className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors ${
                reviewLoading 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
      
      {/* File Viewer Modal */}
      {fileViewerOpen && selectedFile && (
        <FileViewer
          file={selectedFile}
          onClose={() => {
            setFileViewerOpen(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
};

export default RegistrantDetail;