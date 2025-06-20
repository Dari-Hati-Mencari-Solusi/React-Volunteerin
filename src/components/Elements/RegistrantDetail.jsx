import React from 'react';
import { X } from 'lucide-react';

const RegistrantDetail = ({ registrant, onClose, onReview }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-[#0A3E54] p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">Detail Pendaftar</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status section */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-700">Status Pendaftar:</h4>
              <div className="mt-1">
                {registrant.status === "ACCEPTED" ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                    Diterima
                  </span>
                ) : registrant.status === "REJECTED" ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 font-medium">
                    Ditolak
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    Belum Diproses
                  </span>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => onReview('accepted')}
                disabled={registrant.status === "ACCEPTED"}
                className={`px-4 py-2 rounded-lg ${
                  registrant.status === "ACCEPTED"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Terima Pendaftar
              </button>
              <button
                onClick={() => onReview('rejected')}
                disabled={registrant.status === "REJECTED"}
                className={`px-4 py-2 rounded-lg ${
                  registrant.status === "REJECTED"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Tolak Pendaftar
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-4">Informasi Pendaftar</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nama Pendaftar</p>
                <p className="font-medium">{registrant.user?.name || 'Tidak tersedia'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{registrant.user?.email || 'Tidak tersedia'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium">{registrant.user?.phoneNumber || 'Tidak tersedia'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Waktu Pendaftaran</p>
                <p className="font-medium">{formatDate(registrant.submittedAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Form Answers */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-4">Jawaban Formulir</h4>
            
            {registrant.answers && Object.keys(registrant.answers).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(registrant.answers).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-medium">{value || 'Tidak diisi'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada jawaban formulir tersedia</p>
            )}
          </div>
          
          {/* Participation History */}
          {registrant.user?.participations && registrant.user.participations.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-700 mb-4">Riwayat Partisipasi</h4>
              
              <div className="space-y-3">
                {registrant.user.participations.map((participation, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{participation.eventName || 'Untitled Event'}</p>
                    <p className="text-sm text-gray-500">{participation.eventDate || 'Tanggal tidak tersedia'}</p>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        participation.status === "COMPLETED" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {participation.status === "COMPLETED" ? "Selesai" : "Sedang Berlangsung"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrantDetail;