import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import BannerEvent from "../../assets/images/banner1.jpg"; 
import { Icon } from "@iconify/react";
import BtnDaftarVolunteer from "../../components/Elements/buttons/BtnDaftarVolunteer";
import Marketing from "../../components/Fragments/Marketing";
import { useAuth } from "../../context/AuthContext";
import { fetchEventById } from "../../services/eventService";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  // Check authentication status dan fetch data event
  useEffect(() => {
    // Jika belum login, redirect ke halaman login
    if (!isAuthenticated) {
      // Simpan URL tujuan agar setelah login bisa kembali ke halaman ini
      const returnUrl = `/event/${id}`;
      
      // Gunakan localStorage untuk menyimpan URL tempat user ingin pergi
      localStorage.setItem("returnUrl", returnUrl);
      
      // Redirect ke halaman login dengan pesan
      navigate("/login", { 
        state: { 
          message: "Silakan login untuk melihat detail event",
          returnUrl: returnUrl 
        } 
      });
    } else {
      // User sudah login, fetch data event dari API
      const getEventData = async () => {
        try {
          setIsLoading(true);
          // Ambil token dari localStorage
          const token = localStorage.getItem("token");
          
          // Panggil fungsi dari eventService
          const eventData = await fetchEventById(id, token);
          
          if (eventData && eventData.data) {
            setEvent(eventData.data);
          } else {
            setError("Format respons API tidak valid");
          }
        } catch (err) {
          console.error("Error fetching event:", err);
          setError(err.message || "Terjadi kesalahan saat mengambil data event");
        } finally {
          setIsLoading(false);
        }
      };
      
      getEventData();
    }
  }, [isAuthenticated, id, navigate]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Tampilkan loading spinner saat memuat data
  if (isLoading) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
        </div>
        <Footer />
      </section>
    );
  }

  // Tampilkan error jika ada
  if (error) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="max-w-md w-full bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <h2 className="font-bold text-lg mb-2">Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate("/events")}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Kembali ke Daftar Event
            </button>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  // Tampilkan pesan jika tidak ada data event
  if (!event) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Data event tidak tersedia</p>
            <button 
              onClick={() => navigate("/events")}
              className="bg-[#0A3E54] text-white px-4 py-2 rounded-lg hover:bg-[#0A3E54]/90 transition"
            >
              Lihat Event Lainnya
            </button>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  // Format tanggal dan waktu
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('id-ID', options);
  };

  const eventDetails = {
    title: event.title,
    date: `${formatDate(event.startAt)} - ${formatDate(event.endAt)} • ${formatTime(event.startAt)} - ${formatTime(event.endAt)} WIB`,
    category: event.categories && event.categories.length > 0 ? event.categories[0].name : "Event",
    location: event.address,
    organizer: {
      name: event.user?.name || "Penyelenggara Event",
      logo: event.user?.profilePictureUrl || BannerEvent,
      instagram: event.user?.partner.instagram || "Aksipeduli",
    },
    description: event.description,
    quota: `${event.registrationCount || 0} / ${event.maxApplicant} Terdaftar`,
  };

  // Parse requirements dari respons API
  const activities = event.requirement
    ? event.requirement.split('\n')
        .filter(req => req.trim() !== '')
        .map((req, index) => ({
          id: index + 1,
          description: req.replace(/^\d+\.\s*/, '').trim() || req // Hapus nomor jika ada
        }))
    : [
        {
          id: 1,
          description: "Tidak ada persyaratan khusus untuk event ini.",
        },
      ];

  // Ubah benefits dari API ke format yang sesuai dengan UI
  const benefits = event.benefits && event.benefits.length > 0
    ? event.benefits.map((benefit, index) => ({
        id: index + 1,
        title: benefit.name,
        icon: getBenefitIcon(benefit.icon || benefit.name)
      }))
    : [
        { id: 1, title: "Uang Saku", icon: "tabler:wallet" },
        { id: 2, title: "Sertifikat", icon: "tabler:certificate" },
        { id: 3, title: "Snack", icon: "fluent-mdl2:eat-drink" },
        { id: 4, title: "Koneksi", icon: "ic:round-connect-without-contact" },
      ];

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex flex-col lg:flex-row gap-4 py-6 lg:py-10">
          <div className="w-full lg:w-8/12 space-y-4">
            <div className="mb-6 lg:mb-0">
              <img
                src={event.bannerUrl || BannerEvent}
                alt="Banner detail volunteer"
                className="w-full h-48 sm:h-60 object-cover rounded-t-[12px]"
                onError={(e) => {
                  e.target.src = BannerEvent;
                }}
              />
              <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-4 sm:p-6 rounded-b-xl">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-medium">
                    {eventDetails.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center font-medium bg-[#22D0EE] text-[#0A3E54] px-3 py-[6px] rounded-full">
                      <Icon icon="mdi:users" className="w-4 h-4 mr-1" />
                      <span className="text-sm sm:text-md">
                        {eventDetails.quota}
                      </span>
                    </div>
                    <button onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: event.description?.substring(0, 100) + '...',
                          url: window.location.href
                        }).catch(err => console.log('Error sharing:', err));
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('URL copied to clipboard!');
                      }
                    }}>
                      <Icon
                        icon="meteor-icons:share"
                        className="w-6 h-6 text-[#0A3E54]"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-500 text-sm sm:text-[18px]">
                    {eventDetails.date}
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {event.categories && event.categories.map(category => (
                    <span key={category.id} className="font-medium bg-[#22D0EE] text-[#0A3E54] px-4 sm:px-7 py-[6px] rounded-full text-sm sm:text-md">
                      {category.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-start sm:items-center gap-2 mb-6 text-[#343E46]">
                  <Icon
                    icon="weui:location-filled"
                    className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0"
                  />
                  <span className="text-[#0A3E54] text-base sm:text-xl">
                    {eventDetails.location}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-4">
                      <img
                        src={eventDetails.organizer.logo}
                        alt="Organizer"
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                          e.target.src = BannerEvent;
                        }}
                      />
                      <div>
                        <p className="text-sm text-gray-500">
                          Penyelenggara event:
                        </p>
                        <p className="font-medium text-lg sm:text-xl">
                          {eventDetails.organizer.name}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center justify-center bg-[#22D0EE] px-4 py-2 rounded-full text-[#0A3E54] sm:hidden">
                      <Icon icon="ph:instagram-logo-bold" className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="hidden md:block md:ml-auto">
                    <button className="flex items-center gap-1 bg-[#22D0EE] px-4 py-2 rounded-full text-[#0A3E54]">
                      <Icon icon="ph:instagram-logo-bold" className="w-5 h-5" />
                      <span className="text-[#0A3E54] font-medium">
                        {eventDetails.organizer.instagram}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">
                    Tentang Event Volunteer
                  </h2>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    {showFullDescription
                      ? eventDetails.description
                      : `${eventDetails.description.substring(0, 250)}...`}
                  </p>
                  <button
                    onClick={toggleDescription}
                    className="text-[#0A3E54] font-medium text-sm sm:text-base"
                  >
                    {showFullDescription ? "Tutup" : "Selengkapnya"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#FBFBFB] border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="gg:notes"
                  width="28"
                  height="28"
                  className="text-[#0A3E54]"
                />
                <h2 className="text-xl font-medium text-[#0A3E54]">
                  Deskripsi Kegiatan
                </h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <span className="text-[#0A3E54] font-medium">
                      {activity.id}.
                    </span>
                    <p className="text-gray-700">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-4/12">
            <div className="space-y-4">
              <div>
                <div className="bg-[#0A3E54] text-white py-2 sm:py-3 rounded-t-xl">
                  <h1 className="text-lg sm:text-xl font-medium px-4 sm:px-6">
                    Manfaat Event
                  </h1>
                </div>
                <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-4 sm:p-6 rounded-b-xl">
                  <div className="grid grid-cols-2 gap-2">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="bg-white p-2 rounded-xl shadow-sm flex text-center items-center gap-2 cursor-default"
                      >
                        <Icon
                          icon={benefit.icon}
                          className="w-[15px] h-[15px] text-[#0A3E54]"
                        />
                        <div className="flex flex-col">
                          <span className="text-[#0A3E54] font-normal text-sm">
                            {benefit.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#0A3E54] text-white py-2 sm:py-3 rounded-t-xl">
                  <h1 className="text-lg sm:text-xl font-medium px-4 sm:px-6">
                    Kriteria
                  </h1>
                </div>
                <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 rounded-b-lg shadow-sm p-6">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <span className="text-[#0A3E54] font-medium">
                          {activity.id}.
                        </span>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <BtnDaftarVolunteer eventId={id} />
            </div>
          </div>
        </div>
       <Marketing />
      </section>
      <Footer />
    </section>
  );
};

// Helper function untuk menentukan icon berdasarkan nama benefit
function getBenefitIcon(benefitName) {
  // Define mapping of keyword patterns to icon names
  const BENEFIT_ICON_MAP = {
    'akomodasi': 'mdi:hotel',
    'hotel': 'mdi:hotel',
    'penghargaan': 'mdi:trophy-award',
    'award': 'mdi:trophy-award',
    'sertifikat': 'tabler:certificate',
    'uang': 'tabler:wallet',
    'saku': 'tabler:wallet',
    'makan': 'fluent-mdl2:eat-drink',
    'snack': 'fluent-mdl2:eat-drink',
    'koneksi': 'ic:round-connect-without-contact',
    'network': 'ic:round-connect-without-contact',
    'kaos': 'mdi:tshirt-crew',
    'baju': 'mdi:tshirt-crew',
    'pengalaman': 'tabler:medal'
  };
  
  // Default icon if no match found
  const DEFAULT_ICON = 'mdi:gift-outline';
  
  if (!benefitName) return DEFAULT_ICON;
  
  const name = benefitName.toLowerCase();
  
  // Find the first keyword that matches in the benefit name
  const matchedKeyword = Object.keys(BENEFIT_ICON_MAP).find(keyword => 
    name.includes(keyword)
  );
  
  // Return matched icon or default
  return matchedKeyword ? BENEFIT_ICON_MAP[matchedKeyword] : DEFAULT_ICON;
}

export default EventPage;