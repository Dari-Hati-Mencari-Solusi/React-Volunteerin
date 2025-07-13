import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Marketing from "./Marketing";
import { userService } from "../../services/userService";

const RegistrationStatus = () => {
  const { eventId } = useParams();
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        setLoading(true);
        
        console.log('Starting fetch with eventId:', eventId);
        
        // Fetch user registrations to find the specific event
        const response = await userService.getEventHistories();
        
        console.log('Full API Response:', response);
        
        if (response && response.data && response.data.length > 0) {
          console.log('All registrations:', response.data.map(reg => ({
            eventId: reg.form.event.id,
            eventTitle: reg.form.event.title,
            status: reg.status,
            eventIdType: typeof reg.form.event.id
          })));
          
          // Convert eventId to number for comparison
          const eventIdNumber = parseInt(eventId, 10);
          
          console.log('Looking for eventId:', eventId, 'as number:', eventIdNumber);
          
          // Find the registration for this specific event
          const eventRegistration = response.data.find(reg => {
            const match = reg.form.event.id === eventIdNumber || 
                         reg.form.event.id === eventId ||
                         String(reg.form.event.id) === eventId;
            
            console.log('Checking registration:', {
              regEventId: reg.form.event.id,
              regEventIdType: typeof reg.form.event.id,
              paramEventId: eventId,
              paramEventIdNumber: eventIdNumber,
              match: match
            });
            
            return match;
          });
          
          console.log('Found registration:', eventRegistration);
          
          if (eventRegistration) {
            setRegistrationData(eventRegistration);
          } else {
            console.log('No matching registration found');
            setError("Data pendaftaran tidak ditemukan untuk event ini");
          }
        } else {
          console.log('No data or empty data from API');
          setError("Tidak ada data pendaftaran ditemukan");
        }
      } catch (err) {
        console.error("Error fetching registration status:", err);
        setError(err.message || "Gagal memuat status pendaftaran");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      console.log('eventId exists:', eventId);
      fetchRegistrationStatus();
    } else {
      console.log('No eventId provided');
      setError("Event ID tidak valid");
      setLoading(false);
    }
  }, [eventId]);

  const StatusCard = ({ icon, title, isActive, bgColor, iconColor, textColor }) => (
    <div
      className={`${bgColor} rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] transition-all duration-300`}
    >
      <div
        className={`${iconColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3
        className={`text-lg font-semibold ${textColor}`}
      >
        {title}
      </h3>
    </div>
  );

  const getStatusData = (currentStatus) => {
    const statusMap = {
      PENDING: {
        bg: "bg-blue-100",
        iconColor: "bg-blue-500",
        textColor: "text-blue-800",
        label: "Direview",
        icon: "streamline-plump:file-search",
        message: "Pendaftaran Anda sedang dalam tahap review akhir. Tim kami sedang mengevaluasi aplikasi Anda. Hasil akan diumumkan dalam waktu dekat.",
        messageColor: "text-blue-700"
      },
      REVIEWED: {
        bg: "bg-blue-100",
        iconColor: "bg-blue-500",
        textColor: "text-blue-800",
        label: "Direview",
        icon: "streamline-plump:file-search",
        message: "Pendaftaran Anda sedang dalam tahap review akhir. Tim kami sedang mengevaluasi aplikasi Anda. Hasil akan diumumkan dalam waktu dekat.",
        messageColor: "text-blue-700"
      },
      ACCEPTED: {
        bg: "bg-green-100",
        iconColor: "bg-green-500",
        textColor: "text-green-800",
        label: "Diterima",
        icon: "mdi:check-circle-outline",
        message: "Selamat, Pendaftaran Berhasil! Anda telah diterima sebagai relawan. Silakan periksa email Anda untuk informasi lengkap mengenai langkah berikutnya dan jadwal pengarahan.",
        messageColor: "text-green-700"
      },
      REJECTED: {
        bg: "bg-red-100",
        iconColor: "bg-red-500",
        textColor: "text-red-800",
        label: "Ditolak",
        icon: "mdi:close-circle-outline",
        message: "Maaf, pendaftaran Anda belum dapat diterima kali ini. Jangan menyerah! Masih banyak kesempatan lain untuk berkontribusi sebagai relawan.",
        messageColor: "text-red-700"
      }
    };

    return statusMap[currentStatus] || statusMap.REVIEWED;
  };

  const getStatusCards = (currentStatus) => {
    // Hanya menampilkan 2 cards: Direview dan Final Status/Hasil
    const cards = [];
    
    // Card 1: Direview
    const reviewStatusData = getStatusData('REVIEWED');
    cards.push({
      ...reviewStatusData,
      isActive: currentStatus === 'PENDING' || currentStatus === 'REVIEWED',
      bgColor: (currentStatus === 'PENDING' || currentStatus === 'REVIEWED') ? reviewStatusData.bg : "bg-gray-100",
      iconColor: (currentStatus === 'PENDING' || currentStatus === 'REVIEWED') ? reviewStatusData.iconColor : "bg-gray-300",
      textColor: (currentStatus === 'PENDING' || currentStatus === 'REVIEWED') ? reviewStatusData.textColor : "text-gray-500"
    });

    // Card 2: Final Status (Diterima/Ditolak) atau Hasil (jika masih review)
    if (currentStatus === 'ACCEPTED') {
      const acceptedStatusData = getStatusData('ACCEPTED');
      cards.push({
        ...acceptedStatusData,
        isActive: true,
        bgColor: acceptedStatusData.bg,
        iconColor: acceptedStatusData.iconColor,
        textColor: acceptedStatusData.textColor
      });
    } else if (currentStatus === 'REJECTED') {
      const rejectedStatusData = getStatusData('REJECTED');
      cards.push({
        ...rejectedStatusData,
        isActive: true,
        bgColor: rejectedStatusData.bg,
        iconColor: rejectedStatusData.iconColor,
        textColor: rejectedStatusData.textColor
      });
    } else {
      // Jika masih dalam tahap review, tampilkan card "Hasil"
      cards.push({
        label: "Hasil",
        icon: "mdi:help-circle-outline",
        isActive: false,
        bgColor: "bg-gray-100",
        iconColor: "bg-gray-300",
        textColor: "text-gray-500"
      });
    }

    return cards;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54] mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat status pendaftaran...</p>
            </div>
          </div>
        </section>
        <Footer />
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Icon icon="mdi:alert" className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Terjadi Kesalahan</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Event ID: {eventId}</p>
                <Link
                  to="/regis-event"
                  className="inline-block bg-[#0A3E54] text-white px-6 py-2 rounded-lg hover:bg-[#0A3E54]/90 transition-colors"
                >
                  Kembali ke Event Terdaftar
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </section>
    );
  }

  if (!registrationData) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Icon icon="mdi:file-search" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
              <p className="text-gray-600 mb-4">Status pendaftaran untuk event ini tidak ditemukan</p>
              <Link
                to="/regis-event"
                className="bg-[#0A3E54] text-white px-6 py-2 rounded-lg hover:bg-[#0A3E54]/90 transition-colors"
              >
                Kembali ke Event Terdaftar
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </section>
    );
  }

  const { form, status, submittedAt } = registrationData;
  const event = form.event;
  const currentStatusData = getStatusData(status);
  const statusCards = getStatusCards(status);

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <Link to="/regis-event" className="text-[#0A3E54] text-sm md:text-xl lg:text-xl font-medium hover:underline">
            Event Terdaftar
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] md:text-xl lg:text-xl text-sm font-medium">
            Status Pendaftaran
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>

        {/* Event Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0A3E54] mb-4">Detail Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Icon icon="lets-icons:date-today-light" className="w-4 h-4 mr-2" />
                  <span>{formatDate(event.startAt)} - {formatDate(event.endAt)}</span>
                </div>
                <div className="flex items-center">
                  <Icon icon="tdesign:location" className="w-4 h-4 mr-2" />
                  <span>{event.address}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-2" />
                  <span>Didaftar: {formatDate(submittedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Icon icon="mdi:account-group" className="w-4 h-4 mr-2" />
                  <span>Max {event.maxApplicant} peserta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {/* Status Cards - Hanya 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {statusCards.map((card, index) => (
              <StatusCard
                key={index}
                icon={<Icon icon={card.icon} width="36" height="36" style={{ color: "#ffffff" }} />}
                title={card.label}
                isActive={card.isActive}
                bgColor={card.bgColor}
                iconColor={card.iconColor}
                textColor={card.textColor}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#0A3E54] mb-6">
              Hallo, Kang Rantau
            </h1>

            <p className={`text-lg leading-relaxed mb-8 md:max-w-2xl lg:max-w-4xl mx-auto ${currentStatusData.messageColor}`}>
              {currentStatusData.message}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/regis-event"
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#0A3E54] text-[#0A3E54] font-semibold rounded-full hover:bg-[#0A3E54] hover:text-white transition-colors"
              >
                <Icon icon="mdi:arrow-left" width="24" height="24" />
                Kembali
              </Link>

              <Link
                to="/"
                className="bg-[#0A3E54] text-white px-8 py-3 rounded-full hover:bg-[#0A3E54]/90 transition-colors"
              >
                Cari Volunteer Lainnya
              </Link>
            </div>
          </div>
        </div>

        <Marketing />
      </section>
    </section>
  );
};

export default RegistrationStatus;