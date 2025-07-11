import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import { partnerService } from "../../services/partnerService";
import RegistrantDetail from "../Elements/RegistrantDetail";

const ListVolunteer = () => {
  const { eventId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [registrants, setRegistrants] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("s") || "");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "");
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Tambahkan state untuk tracking review process
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewingRegistrantId, setReviewingRegistrantId] = useState(null);

  // ... existing fetchRegistrants function ...

  const fetchRegistrants = useCallback(async () => {
    if (!eventId) {
      console.error("❌ Event ID tidak ditemukan di ListVolunteer");
      return;
    }
    
    setLoading(true);
    console.log("🔄 ListVolunteer: Fetching registrants for event:", eventId);
    
    try {
      const params = {
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 10,
        sort: searchParams.get("sort") || "desc",
      };
      
      if (searchTerm) {
        params.s = searchTerm;
      }
      
      if (selectedStatus && selectedStatus !== 'pending') {
        params.status = selectedStatus.toLowerCase();
      }
      
      console.log("📋 Using params:", params);
      
      const response = await partnerService.getEventRegistrants(eventId, params);
      console.log("📦 ListVolunteer response:", response);
      
      if (response?.registrants?.data) {
        let filteredData = response.registrants.data;
        
        // Handle pending filter client-side
        if (selectedStatus === 'pending') {
          filteredData = filteredData.filter(r => 
            r.status !== "ACCEPTED" && r.status !== "REJECTED"
          );
          console.log("🔄 Filtered pending data:", filteredData);
        }
        
        console.log("✅ Setting registrants data:", filteredData.length, "items");
        setRegistrants(filteredData);
        setPagination({
          currentPage: response.registrants.currentPage || 1,
          totalPages: response.registrants.totalPages || 1,
          totalItems: response.registrants.totalItems || 0
        });
        
        // Log sample data structure
        if (filteredData.length > 0) {
          console.log("📝 Sample registrant data:", {
            id: filteredData[0].id,
            status: filteredData[0].status,
            hasAnswers: !!filteredData[0].answers,
            hasUser: !!filteredData[0].user,
            answersKeys: filteredData[0].answers ? Object.keys(filteredData[0].answers) : [],
            userKeys: filteredData[0].user ? Object.keys(filteredData[0].user) : []
          });
        }
        
      } else {
        console.error("❌ Unexpected response structure:", response);
        console.error("❌ Response keys:", response ? Object.keys(response) : 'null response');
        
        toast.error("Format respons server tidak sesuai");
        setRegistrants([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        });
      }
    } catch (error) {
      console.error("❌ Error fetching registrants:", error);
      
      if (error.response?.status === 401) {
        toast.error("Sesi login telah berakhir. Silakan login ulang.");
        window.location.href = '/login-partner';
      } else if (error.response?.status === 404) {
        toast.error("Data pendaftar tidak ditemukan.");
      } else if (error.response?.status === 403) {
        toast.error("Anda tidak memiliki akses ke data ini.");
      } else {
        toast.error("Gagal memuat data pendaftar: " + (error.message || "Terjadi kesalahan"));
      }
      
      setRegistrants([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, searchParams, searchTerm, selectedStatus]);

  // ... existing useEffect hooks ...

  // Initial fetch and on dependency changes
  useEffect(() => {
    console.log("Effect triggered, fetching registrants...");
    fetchRegistrants();
  }, [fetchRegistrants]);
  
  // Update URL params when search term or filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set("s", searchTerm);
    } else {
      params.delete("s");
    }
    
    if (selectedStatus) {
      params.set("status", selectedStatus);
    } else {
      params.delete("status");
    }
    
    setSearchParams(params);
  }, [searchTerm, selectedStatus, setSearchParams, searchParams]);
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Apply search after debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("s", searchTerm);
      } else {
        params.delete("s");
      }
      params.set("page", "1"); // Reset to page 1 when searching
      setSearchParams(params);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, setSearchParams]);
  
  // Handle status filter
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("status", e.target.value);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // Reset to page 1 when filtering
    setSearchParams(params);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };
  
  // Open registrant detail
  const handleViewRegistrant = async (registrantId) => {
    setDetailLoading(true);
    try {
      console.log(`Fetching detail for registrant: ${registrantId}`);
      const response = await partnerService.getRegistrantDetail(eventId, registrantId);
      console.log("Registrant detail response:", response);
      
      if (response && response.data) {
        setSelectedRegistrant(response.data);
      } else {
        toast.error("Gagal memuat detail pendaftar");
      }
    } catch (error) {
      console.error("Error fetching registrant detail:", error);
      toast.error("Gagal memuat detail pendaftar");
    } finally {
      setDetailLoading(false);
    }
  };
  
  // Close registrant detail
  const handleCloseDetail = () => {
    setSelectedRegistrant(null);
    setReviewLoading(false);
    setReviewingRegistrantId(null);
  };
  
  // Review registrant - IMPROVED VERSION
  const handleReviewRegistrant = async (status) => {
    if (!selectedRegistrant || !selectedRegistrant.id) return;
    
    setReviewLoading(true);
    setReviewingRegistrantId(selectedRegistrant.id);
    
    // Show loading toast
    const loadingToast = toast.loading(
      `Sedang memproses ${status === 'accepted' ? 'penerimaan' : 'penolakan'} pendaftar...`
    );
    
    try {
      console.log(`Reviewing registrant ${selectedRegistrant.id} with status: ${status}`);
      
      const response = await partnerService.reviewRegistrant(eventId, selectedRegistrant.id, status);
      console.log("Review response:", response);
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: `Pendaftar berhasil ${status === 'accepted' ? 'diterima' : 'ditolak'}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Update selectedRegistrant status
      setSelectedRegistrant({
        ...selectedRegistrant,
        status: status === 'accepted' ? 'ACCEPTED' : 'REJECTED'
      });
      
      // Update registrants list locally untuk immediate feedback
      setRegistrants(prevRegistrants => 
        prevRegistrants.map(registrant => 
          registrant.id === selectedRegistrant.id 
            ? { ...registrant, status: status === 'accepted' ? 'ACCEPTED' : 'REJECTED' }
            : registrant
        )
      );
      
      // Refresh registrant list in background
      setTimeout(() => {
        fetchRegistrants();
      }, 1000);
      
    } catch (error) {
      console.error("Error reviewing registrant:", error);
      
      // Update loading toast to error
      toast.update(loadingToast, {
        render: `Gagal memproses status pendaftar: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setReviewLoading(false);
      setReviewingRegistrantId(null);
    }
  };
  
  // ... existing helper functions ...

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Get name from answers or user (sesuai dengan struktur response BE)
  const getRegistrantName = (registrant) => {
    if (registrant.answers && registrant.answers.fullName) {
      return registrant.answers.fullName;
    }
    return registrant.user?.name || 'Tidak tersedia';
  };
  
  // Get email from answers or user (sesuai dengan struktur response BE)
  const getRegistrantEmail = (registrant) => {
    if (registrant.answers && registrant.answers.emailAddress) {
      return registrant.answers.emailAddress;
    }
    return registrant.user?.email || 'Tidak tersedia';
  };
  
  // Generate pages array for pagination
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftOffset = Math.floor(maxPagesToShow / 2);
    let start = currentPage - leftOffset;
    
    if (start < 1) {
      start = 1;
    }
    
    let end = start + maxPagesToShow - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <section className="pt-4">
      <div className="border border-gray-200 rounded-lg">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-t-xl px-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg text-white font-medium">Daftar Pendaftar</h2>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full md:w-72 flex items-center">
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
                placeholder="Cari nama pendaftar..."
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full sm:w-auto py-2.5 px-4"
            >
              <option value="">Semua Status</option>
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
              <option value="pending">Belum Diproses</option>
            </select>
          </div>
        </div>

        <div>
          <div className="relative min-h-[400px] w-full overflow-auto rounded-none scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
              </div>
            ) : registrants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Icon icon="mdi:file-document-outline" width="48" height="48" />
                <p className="mt-2 text-lg">Tidak ada data pendaftar</p>
                <p className="text-sm">Silakan coba filter pencarian lain atau periksa event Anda</p>
              </div>
            ) : (
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
                      Status Review
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrants.map((registrant) => (
                    <tr key={registrant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-md font-medium text-gray-900">
                          {getRegistrantName(registrant)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getRegistrantEmail(registrant)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(registrant.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Show loading spinner if this registrant is being reviewed */}
                        {reviewingRegistrantId === registrant.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#0A3E54] mr-2"></div>
                            <span className="text-sm text-gray-600">Memproses...</span>
                          </div>
                        ) : registrant.status === "ACCEPTED" ? (
                          <span className="px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full bg-green-100 text-green-800">
                            <Icon
                              icon="mdi:check-circle"
                              width="16"
                              height="16"
                              className="mr-1"
                            />
                            Diterima
                          </span>
                        ) : registrant.status === "REJECTED" ? (
                          <span className="px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full bg-red-100 text-red-800">
                            <Icon
                              icon="mdi:close-circle"
                              width="16"
                              height="16"
                              className="mr-1"
                            />
                            Ditolak
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <Icon
                              icon="mdi:clock-outline"
                              width="16"
                              height="16"
                              className="mr-1"
                            />
                            Belum Diproses
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-x-2">
                          <button 
                            onClick={() => handleViewRegistrant(registrant.id)}
                            disabled={reviewingRegistrantId === registrant.id}
                            className={`inline-flex items-center px-3 py-1.5 text-white rounded-lg transition-colors ${
                              reviewingRegistrantId === registrant.id 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#0A3E54] hover:bg-[#072A3A]'
                            }`}
                          >
                            <Icon
                              icon="mdi:eye"
                              width="18"
                              height="18"
                              className="mr-1.5"
                            />
                            Lihat Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {!loading && registrants.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Menampilkan {registrants.length} dari {pagination.totalItems} pendaftar
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    pagination.currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon icon="mdi:chevron-left" width="16" height="16" />
                </button>
                
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === pagination.currentPage
                        ? "bg-[#0A3E54] text-white border border-[#0A3E54]" 
                        : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded-md ${
                    pagination.currentPage === pagination.totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon icon="mdi:chevron-right" width="16" height="16" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Registrant Detail Modal */}
      {selectedRegistrant && (
        <RegistrantDetail
          registrant={selectedRegistrant}
          onClose={handleCloseDetail}
          onReview={handleReviewRegistrant}
          reviewLoading={reviewLoading}
        />
      )}
      
      {detailLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
            <p className="mt-4 text-gray-700">Memuat data pendaftar...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ListVolunteer;