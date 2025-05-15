import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import { id } from 'date-fns/locale';

const VolunteerReviewModal = ({ volunteer, onClose, onUpdateStatus }) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onUpdateStatus(volunteer.id, "accepted", notes);
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    await onUpdateStatus(volunteer.id, "rejected", notes);
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
    } catch (e) {
      console.warn("Date format error:", e);
      return dateString;
    }
  };

  // Rendering fungsi untuk memudahkan debugging
  console.log("Volunteer data:", volunteer);
  
  // Extract data dengan fallback
  const userData = volunteer.user || {};
  const answers = volunteer.answers || {};
  
  // Nilai-nilai yang akan ditampilkan
  const name = userData.name || userData.fullName || answers.fullName || "-";
  const email = userData.email || answers.emailAddress || "-";
  const phoneNumber = userData.phoneNumber || answers.phoneNumber || "-";
  const submittedDate = volunteer.submittedAt || volunteer.createdAt || "-";
  const status = (volunteer.status || "").toUpperCase();

  // Render jawaban formulir
  const renderAnswers = () => {
    const answerFields = answers ? Object.entries(answers) : [];
    
    if (answerFields.length === 0) {
      return <p className="text-gray-500 italic">Tidak ada data jawaban formulir</p>;
    }

    return answerFields.map(([key, value], index) => (
      <div key={index} className="border rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">
          {formatFieldLabel(key)}
        </p>
        <div className="font-medium">
          {value || <span className="text-gray-400">Tidak diisi</span>}
        </div>
      </div>
    ));
  };

  // Format field key to a more readable label
  const formatFieldLabel = (key) => {
    const labelMap = {
      'fullName': 'Nama Lengkap',
      'emailAddress': 'Alamat Email',
      'phoneNumber': 'Nomor Telepon',
      'institution': 'Institusi',
      'education': 'Pendidikan',
      'reason': 'Alasan Bergabung',
      'motivation': 'Motivasi',
      'expectation': 'Harapan',
      'experience': 'Pengalaman',
      'skills': 'Keterampilan'
    };
    
    return labelMap[key] || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="py-4 px-6 bg-[#0A3E54] text-white flex justify-between items-center">
          <h3 className="text-xl font-semibold">Review Formulir Pendaftaran</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <Icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-lg text-[#0A3E54] mb-2">Informasi Pendaftar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor Telepon</p>
                <p className="font-medium">{phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Pendaftaran</p>
                <p className="font-medium">{formatDate(submittedDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status Saat Ini</p>
                <p className={`font-medium ${
                  status === 'ACCEPTED' || status === 'APPROVED' ? 'text-green-600' : 
                  status === 'REJECTED' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {status === 'ACCEPTED' || status === 'APPROVED' ? 'Diterima' : 
                   status === 'REJECTED' ? 'Ditolak' : 
                   status === 'PENDING' ? 'Menunggu' : status || 'Belum ditentukan'}
                </p>
              </div>
            </div>
          </div>
          
          <h4 className="font-semibold text-lg text-[#0A3E54] mb-4">Jawaban Formulir</h4>
          
          <div className="space-y-4">
            {renderAnswers()}
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-lg text-[#0A3E54] mb-2">Catatan (Opsional)</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Berikan catatan untuk pendaftar ini..."
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end items-center space-x-3 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Batal
          </button>
          
          {/* Tampilkan tombol Tolak jika status belum Rejected */}
          {status !== 'REJECTED' && (
            <button 
              onClick={handleReject}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Tolak Pendaftar"}
            </button>
          )}
          
          {/* Tampilkan tombol Terima jika status belum Approved/Accepted */}
          {status !== 'APPROVED' && status !== 'ACCEPTED' && (
            <button 
              onClick={handleApprove}
              className="px-4 py-2 bg-[#0A3E54] text-white rounded-lg hover:bg-[#0c4f6c]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Terima Pendaftar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerReviewModal;