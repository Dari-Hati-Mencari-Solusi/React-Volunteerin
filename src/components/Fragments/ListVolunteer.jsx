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
    totalItems: 0,
  });

  const [searchTerm, setSearchTerm] = useState(searchParams.get("s") || "");
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch registrants from API
  const fetchRegistrants = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      const params = {
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 10,
        sort: searchParams.get("sort") || "desc",
      };

      // Add search term if exists
      if (searchTerm) {
        params.s = searchTerm;
      }

      // Add status filter if selected
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await partnerService.getEventRegistrants(
        eventId,
        params
      );

      if (response && response.registrants) {
        setRegistrants(response.registrants.data || []);
        setPagination({
          currentPage: response.registrants.currentPage || 1,
          totalPages: response.registrants.totalPages || 1,
          totalItems: response.registrants.totalItems || 0,
        });
      } else {
        setRegistrants([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching registrants:", error);
      toast.error("Gagal memuat data pendaftar");
      setRegistrants([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, searchParams, searchTerm, selectedStatus]);

  // Initial fetch and on dependency changes
  useEffect(() => {
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
      const response = await partnerService.getRegistrantDetail(
        eventId,
        registrantId
      );
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
  };

  // Review registrant
  const handleReviewRegistrant = async (status) => {
    if (!selectedRegistrant || !selectedRegistrant.id) return;

    try {
      await partnerService.reviewRegistrant(
        eventId,
        selectedRegistrant.id,
        status
      );
      toast.success(
        `Pendaftar berhasil ${status === "accepted" ? "diterima" : "ditolak"}`
      );

      // Update selectedRegistrant status
      setSelectedRegistrant({
        ...selectedRegistrant,
        status: status === "accepted" ? "ACCEPTED" : "REJECTED",
      });

      // Refresh registrant list
      fetchRegistrants();
    } catch (error) {
      console.error("Error reviewing registrant:", error);
      toast.error("Gagal memproses status pendaftar");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Get name from answers or user
  const getRegistrantName = (registrant) => {
    if (registrant.answers && registrant.answers.fullName) {
      return registrant.answers.fullName;
    }
    return registrant.user?.name || "Tidak tersedia";
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
                    Status Bayar
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
                {events.map((event, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-md font-medium text-gray-900">
                        {event.NamaPendaftar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.WaktuPendaftaran}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.EventDipilih}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.StatusBayar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.StatusReview === "Checklist" ? (
                        <span className="px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full bg-red-500 text-white">
                          <Icon
                            icon="mdi:check-circle"
                            width="16"
                            height="16"
                            className="mr-1"
                          />
                          Belum dikoreksi
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Icon
                            icon="mdi:clock-outline"
                            width="16"
                            height="16"
                            className="mr-1"
                          />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-x-2">
                        <button className="inline-flex items-center px-2 py-1 text-[#0A3E54]">
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
                ))}
              </tbody>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrants.map((registrant) => (
                  <tr key={registrant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-md font-medium text-gray-900">
                        {getRegistrantName(registrant)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registrant.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(registrant.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registrant.status === "ACCEPTED" ? (
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
                          className="inline-flex items-center px-3 py-1.5 bg-[#0A3E54] text-white rounded-lg hover:bg-[#072A3A] transition-colors"
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
          </div>
        </div>

        {!loading && registrants.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Menampilkan {registrants.length} dari {pagination.totalItems}{" "}
                pendaftar
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

                {getPageNumbers().map((pageNum) => (
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
