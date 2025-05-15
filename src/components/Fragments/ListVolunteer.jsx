import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import { userRegistrationService } from "../../services/userResgistrationService";
import VolunteerReviewModal from "../../components/Elements/Alert/VolunteerReviewModal";
import { format } from "date-fns";
import { id } from 'date-fns/locale';

const ListVolunteer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch registrations data when component mounts
    fetchRegistrations();
  }, [currentPage]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      // Perbaikan: ganti uuserRegistrationService menjadi userRegistrationService
      const response = await userRegistrationService.getVolunteerRegistrations();
      if (response && response.data) {
        setRegistrations(response.data);
        // Set pagination if available in response
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      setError(err.message || "Gagal memuat data pendaftar");
      Swal.fire({
        title: 'Error',
        text: err.message || "Gagal memuat data pendaftar",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter registrations locally based on search term
    if (e.target.value.trim() === "") {
      fetchRegistrations(); // Reset to original data if search term is empty
    } else {
      const filtered = registrations.filter((reg) => 
        reg.user?.fullName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        reg.user?.email?.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setRegistrations(filtered);
    }
  };

  const handleReviewClick = async (registration) => {
    try {
      setLoading(true);
      const response = await userRegistrationService.getRegistrationDetails(registration.id);
      if (response && response.data) {
        setSelectedVolunteer(response.data);
        setShowModal(true);
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message || "Gagal memuat detail pendaftaran",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, status, notes = '') => {
    try {
      setLoading(true);
      await userRegistrationService.updateRegistrationStatus(registrationId, status, notes);
      
      Swal.fire({
        title: 'Berhasil',
        text: `Status pendaftaran berhasil diubah menjadi ${status === 'APPROVED' ? 'diterima' : 'ditolak'}`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
      
      setShowModal(false);
      fetchRegistrations(); // Refresh data
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message || "Gagal mengubah status pendaftaran",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0A3E54'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVolunteer(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Icon icon="mdi:clock-outline" width="16" height="16" className="mr-1" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <Icon icon="mdi:check-circle" width="16" height="16" className="mr-1" />
            Diterima
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <Icon icon="mdi:close-circle" width="16" height="16" className="mr-1" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            <Icon icon="mdi:help-circle" width="16" height="16" className="mr-1" />
            {status || 'Unknown'}
          </span>
        );
    }
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
      </div>
    );
  }

  if (error && registrations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Icon icon="mdi:alert-circle" className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={fetchRegistrations}
            className="mt-4 px-4 py-2 bg-[#0A3E54] text-white rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="border border-gray-200 rounded-lg">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-t-xl px-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg text-white font-medium">Daftar Relawan</h2>
          </div>
          <div className="relative w-full md:w-72 flex items-center gap-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon
                icon="flowbite:search-outline"
                width="24"
                height="24"
                className="text-[#667085]"
              />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Cari nama relawan..."
            />
            <Icon
              icon="line-md:filter"
              width="38"
              height="38"
              className="text-white cursor-pointer"
            />
          </div>
        </div>

        <div>
          <div className="relative h-[500px] w-full overflow-auto rounded-none scrollbar-thin">
            <table className="w-full min-w-full table-auto">
              <thead className="bg-[#F2F2F2] text-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pendaftar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Pendaftaran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Dipilih
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Review
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formulir
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.length > 0 ? (
                  registrations.map((registration, index) => (
                    <tr key={registration.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-md font-medium text-gray-900">
                          {registration.user?.fullName || "Nama tidak tersedia"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(registration.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {registration.event?.title || "Event tidak tersedia"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {registration.user?.email || "Email tidak tersedia"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-x-2">
                          <button 
                            className="inline-flex items-center px-2 py-1 text-[#0A3E54] hover:bg-blue-50 rounded-md"
                            onClick={() => handleReviewClick(registration)}
                          >
                            <Icon
                              icon="mdi:eye"
                              width="20"
                              height="20"
                              className="mr-1"
                            />
                            Review Formulir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Belum ada data pendaftar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Menampilkan {registrations.length} pendaftar
            </div>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon icon="mdi:chevron-left" width="16" height="16" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white border border-blue-500"
                        : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon icon="mdi:chevron-right" width="16" height="16" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal untuk review formulir */}
      {showModal && selectedVolunteer && (
        <VolunteerReviewModal
          volunteer={selectedVolunteer}
          onClose={closeModal}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </section>
  );
};

export default ListVolunteer;