import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { partnerService } from "../../services/partnerService";
import ListVolunteer from "./ListVolunteer";

const VolunteerPage = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrants: 0,
    totalFee: 0,
    acceptedRegistrants: 0,
    rejectedRegistrants: 0,
    pendingRegistrants: 0
  });

  console.log("VolunteerPage - eventId from useParams:", eventId);

  useEffect(() => {
    if (!eventId) {
      console.log("VolunteerPage - No eventId found, user needs to select an event");
      setLoading(false);
      return;
    }

    const fetchRegistrantsStats = async () => {
      setLoading(true);
      try {
        console.log("🚀 Starting to fetch registrants stats for event:", eventId);
        
        // Step 1: Cek event details
        console.log("📋 Step 1: Fetching event details...");
        const eventDetails = await partnerService.getEventDetails(eventId);
        console.log("✅ Event details received:", eventDetails);
        
        if (!eventDetails?.data) {
          console.error("❌ Event details tidak ditemukan");
          toast.error("Data event tidak ditemukan");
          return;
        }
        
        // Step 2: Ambil semua registrants
        console.log("👥 Step 2: Fetching all registrants...");
        const allRegistrants = await partnerService.getEventRegistrants(eventId);
        console.log("✅ All registrants response:", allRegistrants);
        
        // Step 3: Ambil accepted registrants
        console.log("✅ Step 3: Fetching accepted registrants...");
        const acceptedRegistrants = await partnerService.getEventRegistrants(eventId, { status: 'accepted' });
        console.log("✅ Accepted registrants response:", acceptedRegistrants);
        
        // Step 4: Ambil rejected registrants
        console.log("❌ Step 4: Fetching rejected registrants...");
        const rejectedRegistrants = await partnerService.getEventRegistrants(eventId, { status: 'rejected' });
        console.log("❌ Rejected registrants response:", rejectedRegistrants);
        
        // Extract data dengan safe checking
        const totalItems = allRegistrants?.registrants?.totalItems || 0;
        const acceptedItems = acceptedRegistrants?.registrants?.totalItems || 0;
        const rejectedItems = rejectedRegistrants?.registrants?.totalItems || 0;
        const registrationFee = eventDetails.data.registrationFee || 0;
        
        console.log("📊 Calculated stats:", {
          totalItems,
          acceptedItems,
          rejectedItems,
          registrationFee,
          pendingItems: totalItems - acceptedItems - rejectedItems
        });
        
        setStats({
          totalRegistrants: totalItems,
          totalFee: totalItems * registrationFee,
          acceptedRegistrants: acceptedItems,
          rejectedRegistrants: rejectedItems,
          pendingRegistrants: Math.max(0, totalItems - acceptedItems - rejectedItems)
        });
        
      } catch (error) {
        console.error("❌ Error fetching registrants stats:", error);
        
        // Specific error handling
        if (error.response?.status === 401) {
          toast.error("Sesi login telah berakhir. Silakan login ulang.");
          window.location.href = '/login-partner';
        } else if (error.response?.status === 404) {
          toast.error("Event tidak ditemukan atau Anda tidak memiliki akses.");
        } else if (error.response?.status === 403) {
          toast.error("Anda tidak memiliki akses ke event ini.");
        } else {
          toast.error("Gagal memuat statistik pendaftar: " + (error.message || "Terjadi kesalahan"));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrantsStats();
  }, [eventId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Jika tidak ada eventId, tampilkan pesan untuk memilih event
  if (!eventId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Event Terlebih Dahulu</h3>
          <p className="text-gray-600 mb-4">Silakan pilih event dari dropdown di header untuk melihat daftar pendaftar.</p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-800 text-sm">Gunakan dropdown "Pilih Event Kamu" di pojok kiri atas</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pendaftar</h1>
        <p className="text-gray-600 mt-1">Kelola dan review pendaftar untuk event Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pendaftar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diterima</p>
              <p className="text-2xl font-bold text-gray-900">{stats.acceptedRegistrants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejectedRegistrants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Belum Diproses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRegistrants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* List Volunteer Component */}
      <ListVolunteer />
    </div>
  );
};

export default VolunteerPage;