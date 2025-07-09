import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Footer } from "../../pages/partners/layouts/Footer";
import BtnWhatsapp from "../Elements/buttons/BtnWhatsapp";
import CreateEvent from "../../pages/partners/CreateEvent";
import { partnerService } from "../../services/partnerService";
import Swal from "sweetalert2";
import defaultBanner from "../../assets/images/banner1.jpg"; // Impor banner lokal sebagai default

const ListEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportPage, setShowReportPage] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  // Fungsi untuk memproses URL banner
  const processBannerUrl = (event) => {
    // Base URL dari API
    const BASE_URL = import.meta.env.VITE_BE_BASE_URL || 'http://localhost:3000';
    
    // Gunakan defaultBanner (banner1.jpg yang diimpor) sebagai fallback
    const DEFAULT_BANNER = defaultBanner;
    
    if (!event) return DEFAULT_BANNER;
    
    // Cek berbagai kemungkinan field banner
    const bannerValue = 
      event.banner || 
      event.bannerUrl || 
      event.image ||
      event.imageUrl ||
      event.media?.banner ||
      event.images?.[0]?.url ||
      null;
    
    console.log(`Processing banner for ${event.title}:`, bannerValue);
    
    if (!bannerValue) return DEFAULT_BANNER;
    
    // Jika sudah URL lengkap, gunakan langsung
    if (bannerValue.startsWith('http')) {
      return bannerValue;
    }
    
    // Jika path relatif, tambahkan base URL
    const path = bannerValue.startsWith('/') ? bannerValue : `/${bannerValue}`;
    return `${BASE_URL}${path}`;
  };

  // Fungsi untuk memuat data event dari API
  const fetchEvents = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await partnerService.getPartnerEvents({ page, limit });
      
      console.log("Raw API response:", response);
      
      if (response && response.data) {
        // Ambil data events dari response
        const eventData = response.data.events || [];
        
        console.log("Event data from API:", eventData);
        
        // Format data untuk tampilan
        const formattedEvents = eventData.map(event => {
          const bannerUrl = processBannerUrl(event);
          
          return {
            id: event.id,
            banner: bannerUrl,
            name: event.title,
            startDate: new Date(event.startAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            endDate: event.endAt ? new Date(event.endAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : '-',
            publish: event.isRelease ? "Checklist" : "Pending"
          };
        });
        
        console.log("Formatted events:", formattedEvents);
        
        setEvents(formattedEvents);
        
        // Update pagination jika ada
        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page || 1,
            limit: response.data.pagination.limit || 10,
            totalPages: response.data.pagination.totalPages || 1,
            totalItems: response.data.pagination.totalItems || eventData.length
          });
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Tidak dapat memuat data event. ' + (error.message || 'Silakan coba lagi nanti.'),
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Panggil API saat komponen dimount
  useEffect(() => {
    fetchEvents(pagination.page, pagination.limit);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    
    // Filter dari data yang sudah diambil
    // Jika perlu pencarian server-side, bisa implementasikan dengan fetchEvents(1, pagination.limit, e.target.value)
    if (e.target.value.trim() === "") {
      fetchEvents(pagination.page, pagination.limit);
    } else {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setEvents(filtered);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({...pagination, page: newPage});
      fetchEvents(newPage, pagination.limit);
    }
  };

  const handleCreateEvent = () => {
    setShowReportPage(true);
  };

  const handleBack = () => {
    setShowReportPage(false);
    // Refresh data setelah kembali dari halaman create
    fetchEvents(pagination.page, pagination.limit);
  };

  const handleViewEvent = (eventId) => {
    // Navigasi ke halaman detail event
    window.location.href = `/partner/events/${eventId}`;
  };

  const handleEditEvent = (eventId) => {
    // Navigasi ke halaman edit event
    window.location.href = `/partner/events/${eventId}/edit`;
  };

  return (
    <div className="flex flex-col gap-y-7">
      {showReportPage ? (
        <CreateEvent onBack={handleBack} />
      ) : (
        <>
          <h1 className="title">Events</h1>

          <div className="flex justify-end">
            <button
              onClick={handleCreateEvent}
              className="bg-[#0A3E54] py-3 px-4 flex items-center gap-x-2 text-white rounded-xl"
            >
              <span>
                <Icon
                  icon="material-symbols:event-note-rounded"
                  width="24"
                  height="24"
                />
              </span>
              Buat Event
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-t-xl px-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg text-white font-medium">
                  Daftar Event
                </h2>
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
                  placeholder="Cari event kamu..."
                />
                <Icon
                  icon="line-md:filter"
                  width="38"
                  height="38"
                  className="text-white"
                />
              </div>
            </div>

            <div>
              <div className="relative h-[500px] w-full overflow-auto rounded-none scrollbar-thin">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="mb-4 w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Memuat data event...</p>
                    </div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <Icon icon="mdi:event-off" className="mx-auto text-gray-400" width="48" height="48" />
                      <p className="text-gray-600 mt-2">Belum ada event yang dibuat</p>
                      <button
                        onClick={handleCreateEvent}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      >
                        Buat Event Pertama
                      </button>
                    </div>
                  </div>
                ) : (
                  <table className="w-full min-w-full table-auto">
                    <thead className="bg-[#F2F2F2] text-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Banner
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Mulai
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Selesai
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Publish
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Formulir
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-16 w-36 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                              <img
                                src={event.banner}
                                alt={`Banner for ${event.name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.log(`Using default local banner for: ${event.name}`);
                                  e.target.src = defaultBanner; // Gunakan banner lokal jika terjadi error
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-md font-medium text-gray-900">
                              {event.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.startDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.endDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {event.publish === "Checklist" ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                <Icon
                                  icon="mdi:check-circle"
                                  width="16"
                                  height="16"
                                  className="mr-1"
                                />
                                Published
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
                              <button 
                                onClick={() => handleViewEvent(event.id)}
                                className="inline-flex items-center px-2 py-1 text-[#0A3E54]"
                              >
                                <Icon
                                  icon="mdi:eye"
                                  width="20"
                                  height="20"
                                  className="mr-1"
                                />
                                Lihat Event
                              </button>
                              <button 
                                onClick={() => handleEditEvent(event.id)}
                                className="inline-flex items-center px-2 py-1 text-[#0A3E54]"
                              >
                                <Icon
                                  icon="mdi:pencil"
                                  width="20"
                                  height="20"
                                  className="mr-1"
                                />
                                Ubah Event
                              </button>
                            </div>
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
                                Lihat Formulir
                              </button>
                              <button className="inline-flex items-center px-2 py-1 text-[#0A3E54]">
                                <Icon
                                  icon="mdi:pencil"
                                  width="20"
                                  height="20"
                                  className="mr-1"
                                />
                                Ubah Formulir
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

            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Menampilkan {events.length} dari {pagination.totalItems} event
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className={`px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 ${pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <Icon icon="mdi:chevron-left" width="16" height="16" />
                  </button>
                  
                  {/* Tampilkan nomor halaman */}
                  {[...Array(pagination.totalPages).keys()].map(pageNum => (
                    <button
                      key={pageNum + 1}
                      onClick={() => handlePageChange(pageNum + 1)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.page === pageNum + 1
                          ? 'bg-blue-500 text-white border border-blue-500'
                          : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))}
                  
                  <button 
                    className={`px-3 py-1 rounded-md bg-white text-gray-500 border border-gray-300 ${pagination.page >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    <Icon icon="mdi:chevron-right" width="16" height="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <BtnWhatsapp />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ListEvents;