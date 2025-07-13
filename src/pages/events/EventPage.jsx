import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import BannerEvent from "../../assets/images/banner1.jpg";
import { Icon } from "@iconify/react";
import BtnDaftarVolunteer from "../../components/Elements/buttons/BtnDaftarVolunteer";
import Marketing from "../../components/Fragments/Marketing";
import { useAuth } from "../../context/AuthContext";
import { fetchEventById } from "../../services/eventService";
import Swal from "sweetalert2";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
} from "react-share";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const getEventData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
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
  }, [id]);

  // Share configuration
  const shareUrl = window.location.href;
  const shareTitle = event ? event.title : "Event Volunteer";
  const shareDescription = event 
    ? `${event.description?.substring(0, 150)}...`
    : "Bergabunglah dengan event volunteer ini!";
  const shareImage = event?.bannerUrl || BannerEvent;

  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return `${window.location.origin}${BannerEvent}`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${window.location.origin}${imageUrl}`;
  };

  const absoluteShareImage = getAbsoluteImageUrl(shareImage);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Link berhasil disalin',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'swal2-small'
        }
      });
      setShowShareModal(false);
    } catch (err) {
      console.error("Failed to copy: ", err);
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal menyalin link',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'swal2-small'
        }
      });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("id-ID", options);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Loading state
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

  // Error state
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

  // No event data state
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

  // Event data processing
  const eventDetails = {
    title: event.title,
    date: `${formatDate(event.startAt)} - ${formatDate(event.endAt)} • ${formatTime(event.startAt)} - ${formatTime(event.endAt)} WIB`,
    location: event.address,
    organizer: {
      name: event.user?.name || "Penyelenggara Event",
      logo: event.user?.profilePictureUrl || BannerEvent,
      instagram: event.user?.partner?.instagram || "Aksipeduli",
    },
    description: event.description,
    quota: `${event.registrationCount || 0} / ${event.maxApplicant} Terdaftar`,
  };

  const activities = event.requirement
    ? event.requirement
        .split("\n")
        .filter((req) => req.trim() !== "")
        .map((req, index) => ({
          id: index + 1,
          description: req.replace(/^\d+\.\s*/, "").trim() || "Tidak ada persyaratan khusus",
        }))
    : [{ id: 1, description: "Tidak ada persyaratan khusus untuk event ini." }];

  const benefits = event.benefits && event.benefits.length > 0
    ? event.benefits.map((benefit, index) => ({
        id: index + 1,
        title: benefit.name,
        icon: getBenefitIcon(benefit.icon || benefit.name),
      }))
    : [
        { id: 1, title: "Uang Saku", icon: "tabler:wallet" },
        { id: 2, title: "Sertifikat", icon: "tabler:certificate" },
        { id: 3, title: "Snack", icon: "fluent-mdl2:eat-drink" },
        { id: 4, title: "Koneksi", icon: "ic:round-connect-without-contact" },
      ];

  return (
    <section className="min-h-screen flex flex-col">
      <Helmet>
        <title>{shareTitle} - Volunteerin</title>
        <meta name="description" content={shareDescription} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={absoluteShareImage} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Volunteerin" />
        <meta property="og:locale" content="id_ID" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        <meta name="twitter:image" content={absoluteShareImage} />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="author" content="Volunteerin" />
        <meta name="keywords" content="volunteer, event, social, community" />
        <link rel="canonical" href={shareUrl} />
      </Helmet>

      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex flex-col lg:flex-row gap-4 py-6 lg:py-10">
          {/* Left Column - Event Details */}
          <div className="w-full lg:w-8/12 space-y-4">
            <div className="mb-6 lg:mb-0">
              <img
                src={event.bannerUrl || BannerEvent}
                alt="Banner detail volunteer"
                className="w-full h-72 md:h-96 lg:h-96 object-cover rounded-t-[12px]"
                onError={(e) => { e.target.src = BannerEvent; }}
              />
              
              <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-4 sm:p-6 rounded-b-xl">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-medium">{eventDetails.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex text-center items-center font-medium bg-[#2196F3] text-white px-5 py-[5px] rounded-full">
                      <Icon icon="mdi:users" className="w-8 h-8 mr-1" />
                      <span className="text-md whitespace-nowrap">{eventDetails.quota}</span>
                    </div>
                    
                    {/* Share Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowShareModal(!showShareModal)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Icon icon="meteor-icons:share" className="w-7 h-7 text-[#164D63]" />
                      </button>

                      {/* Share Modal */}
                      {showShareModal && (
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:mt-2 lg:p-0">
                          <div className="w-full max-w-sm lg:max-w-none lg:w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-medium text-[#0A3E54]">Bagikan Event</h3>
                                <button
                                  onClick={() => setShowShareModal(false)}
                                  className="lg:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-5 gap-3 mb-4">
                                <WhatsappShareButton url={shareUrl} title={`${shareTitle}\n\n${shareDescription}`} separator="" className="flex justify-center">
                                  <WhatsappIcon size={40} round />
                                </WhatsappShareButton>
                                <FacebookShareButton url={shareUrl} quote={`${shareTitle}\n\n${shareDescription}`} hashtag="#volunteer" className="flex justify-center">
                                  <FacebookIcon size={40} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={shareUrl} title={`${shareTitle}\n\n${shareDescription}`} hashtags={["volunteer", "event", "community"]} className="flex justify-center">
                                  <TwitterIcon size={40} round />
                                </TwitterShareButton>
                                <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription} source="Volunteerin" className="flex justify-center">
                                  <LinkedinIcon size={40} round />
                                </LinkedinShareButton>
                                <TelegramShareButton url={shareUrl} title={`${shareTitle}\n\n${shareDescription}`} className="flex justify-center">
                                  <TelegramIcon size={40} round />
                                </TelegramShareButton>
                              </div>

                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <input type="text" value={shareUrl} readOnly className="flex-1 bg-transparent text-sm text-gray-600 outline-none" />
                                <button onClick={copyToClipboard} className="px-3 py-1 bg-[#0A3E54] text-white text-sm rounded hover:bg-[#0A3E54]/90 transition-colors">
                                  Salin
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Date */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-500 text-sm sm:text-[18px]">{eventDetails.date}</span>
                </div>

                {/* Event Categories */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {event.categories && event.categories.map((category) => (
                    <span key={category.id} className="font-medium bg-[#2196F3] text-white px-4 sm:px-7 py-[6px] rounded-full text-sm sm:text-md">
                      {category.name}
                    </span>
                  ))}
                </div>

                {/* Event Location */}
                <div className="flex items-start sm:items-center gap-2 mb-6 text-[#343E46]">
                  <Icon icon="weui:location-filled" className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
                  <span className="text-[#0A3E54] text-base sm:text-xl">{eventDetails.location}</span>
                </div>

                {/* Event Organizer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-4">
                      <img
                        src={eventDetails.organizer.logo}
                        alt="Organizer"
                        className="w-12 h-12 rounded-full"
                        onError={(e) => { e.target.src = BannerEvent; }}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Penyelenggara event:</p>
                        <p className="font-medium text-lg sm:text-xl">{eventDetails.organizer.name}</p>
                      </div>
                    </div>
                    <button className="flex items-center justify-center bg-[#2196F3] px-4 py-2 rounded-full text-white sm:hidden">
                      <Icon icon="ph:instagram-logo-bold" className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="hidden md:block md:ml-auto">
                    <button className="flex items-center gap-1 bg-[#2196F3] px-4 py-2 rounded-full text-white">
                      <Icon icon="ph:instagram-logo-bold" className="w-5 h-5" />
                      <span className="text-white font-medium">{eventDetails.organizer.instagram}</span>
                    </button>
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">Tentang Event Volunteer</h2>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    {showFullDescription ? eventDetails.description : `${eventDetails.description.substring(0, 250)}...`}
                  </p>
                  <button onClick={toggleDescription} className="text-[#0A3E54] font-medium text-sm sm:text-base">
                    {showFullDescription ? "Tutup" : "Selengkapnya"}
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Description */}
            <div className="bg-[#FBFBFB] border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="gg:notes" width="28" height="28" className="text-[#0A3E54]" />
                <h2 className="text-xl font-medium text-[#0A3E54]">Deskripsi Kegiatan</h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <span className="text-[#0A3E54] font-medium">{activity.id}.</span>
                    <p className="text-gray-700">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Benefits and Criteria */}
          <div className="w-full lg:w-4/12">
            <div className="space-y-4">
              {/* Benefits */}
              <div>
                <div className="bg-[#0A3E54] text-white py-2 sm:py-3 rounded-t-xl">
                  <h1 className="text-lg sm:text-xl font-medium px-4 sm:px-6">Manfaat Event</h1>
                </div>
                <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-4 sm:p-6 rounded-b-xl">
                  <div className="grid grid-cols-2 gap-2">
                    {benefits.map((benefit) => (
                      <div key={benefit.id} className="bg-white p-2 rounded-xl shadow-sm flex text-center items-center gap-2 cursor-default">
                        <Icon icon={benefit.icon} className="w-[15px] h-[15px] text-[#0A3E54]" />
                        <span className="text-[#0A3E54] font-normal text-sm">{benefit.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criteria */}
              <div>
                <div className="bg-[#0A3E54] text-white py-2 sm:py-3 rounded-t-xl">
                  <h1 className="text-lg sm:text-xl font-medium px-4 sm:px-6">Kriteria</h1>
                </div>
                <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 rounded-b-lg shadow-sm p-6">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <span className="text-[#0A3E54] font-medium">{activity.id}.</span>
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

      {/* Backdrop */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden" onClick={() => setShowShareModal(false)} />
      )}
    </section>
  );
};

function getBenefitIcon(benefitName) {
  const BENEFIT_ICON_MAP = {
    akomodasi: "mdi:hotel",
    hotel: "mdi:hotel",
    penghargaan: "mdi:trophy-award",
    award: "mdi:trophy-award",
    sertifikat: "tabler:certificate",
    uang: "tabler:wallet",
    saku: "tabler:wallet",
    makan: "fluent-mdl2:eat-drink",
    snack: "fluent-mdl2:eat-drink",
    koneksi: "ic:round-connect-without-contact",
    network: "ic:round-connect-without-contact",
    kaos: "mdi:tshirt-crew",
    baju: "mdi:tshirt-crew",
    pengalaman: "tabler:medal",
  };

  const DEFAULT_ICON = "mdi:gift-outline";

  if (!benefitName) return DEFAULT_ICON;

  const name = benefitName.toLowerCase();
  const matchedKeyword = Object.keys(BENEFIT_ICON_MAP).find((keyword) => name.includes(keyword));
  
  return matchedKeyword ? BENEFIT_ICON_MAP[matchedKeyword] : DEFAULT_ICON;
}

export default EventPage;