import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import IconVolunteer from "../../assets/images/icon.png";
import Footer from "../../components/footer/Footer";
import Marketing from "../../components/Fragments/Marketing";
import { userService } from "../../services/userService";

const RegisteredEvent = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        setLoading(true);
        const response = await userService.getEventHistories();

        if (response && response.data) {
          setRegisteredEvents(response.data);
          
        }
      } catch (err) {
        console.error("Error fetching registered events:", err);
        setError(err.message || "Gagal memuat data event terdaftar");
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [location.state]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Menunggu",
        icon: "mdi:clock-outline"
      },
      REVIEWED: { 
        bg: "bg-blue-100", 
        text: "text-blue-800", 
        label: "Direview",
        icon: "mdi:eye-outline"
      },
      ACCEPTED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Diterima",
        icon: "mdi:check-circle-outline"
      },
      REJECTED: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        label: "Ditolak",
        icon: "mdi:close-circle-outline"
      },
    };

    const statusInfo = statusMap[status] || statusMap["PENDING"];

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}
      >
        <Icon icon={statusInfo.icon} className="w-4 h-4" />
        {statusInfo.label}
      </span>
    );
  };

  const EventCard = ({ registration }) => {
    const { form, answers, status, submittedAt } = registration;
    const event = form.event;
    return (
      <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300'>
        <div className="relative">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = IconVolunteer; // Fallback image
            }}
          />
          <div className="absolute top-4 right-4">{getStatusBadge(status)}</div>
          
          {/* Badge untuk tipe event */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                event.type === "OPEN"
                  ? "bg-green-300 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {event.type}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-[#0A3E54] line-clamp-2">
              {event.title}
            </h3>
          </div>

          {/* <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {event.description}
          </p> */}

         <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Icon icon="lets-icons:date-today-light" className="w-5 h-5 mr-2 text-[#0A3E54] flex-shrink-0" />
              <span className="truncate">
                {formatDate(event.startAt)} - {formatDate(event.endAt)}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Icon icon="tdesign:location" className="w-5 h-5 mr-2 text-[#0A3E54] flex-shrink-0" />
              <span className="truncate">{event.address}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Icon icon="mdi:account-group" className="w-5 h-5 mr-2 text-[#0A3E54] flex-shrink-0" />
              <span>Max {event.maxApplicant} peserta</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Icon icon="mdi:clock-outline" className="w-5 h-5 mr-2 text-[#0A3E54] flex-shrink-0" />
              <span>Didaftar: {formatDate(submittedAt)}</span>
            </div>
          </div>

          {/* Informasi pendaftar */}
          {/* <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Data Pendaftaran:</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <strong>Nama:</strong> {answers.fullName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {answers.emailAddress}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Telepon:</strong> {answers.phoneNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Institusi:</strong> {answers.institution}
              </p>
              {answers.expectation && (
                <p className="text-sm text-gray-600">
                  <strong>Harapan:</strong> {answers.expectation}
                </p>
              )}
            </div>
          </div> */}

          {/* Action buttons */}
          <div className="pt-4 mt-4">
            <Link
              to={`/events/${event.id}`}
              className="w-full bg-[#0A3E54] text-white text-center py-2 px-4 rounded-lg text-sm hover:bg-[#0A3E54]/90 transition-colors block"
            >
              Lihat Detail Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54] mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Memuat data event terdaftar...
              </p>
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
              <Icon
                icon="mdi:alert"
                className="w-16 h-16 text-red-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Terjadi Kesalahan
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#0A3E54] text-white px-6 py-2 rounded-lg hover:bg-[#0A3E54]/90"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </section>
    );
  }

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
          <span className="text-[#0A3E54] text-xl font-medium">
            Event Terdaftar
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>

        {/* Notifikasi jika baru mendaftar */}
        {location.state?.justRegistered && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
               Yeay! Kamu berhasil daftar 🎉 Tunggu info selanjutnya, ya!
              </p>
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-semibold text-[#0A3E54]">
              Volunteer yang kamu Daftar
            </h1>
            <span className="bg-[#0A3E54] text-white rounded-full w-8 h-8 flex items-center justify-center">
              {registeredEvents.length}
            </span>
          </div>

          {registeredEvents.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-[#0A3E54]">
                  Berikut adalah daftar event volunteer yang telah kamu
                  daftarkan. Pantau status pendaftaranmu dan jangan lewatkan
                  informasi penting!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {registeredEvents.map((registration) => (
                  <EventCard
                    key={registration.id}
                    registration={registration}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[#0A3E54]">
                    Belum ada event yang kamu daftar? Jangan sampai ketinggalan!
                    Temukan event menarik dan daftarkan dirimu untuk pengalaman
                    seru!
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 py-10">
                <img
                  src={IconVolunteer}
                  alt="Volunteer illustration"
                  className="w-72 h-72 object-contain"
                />
                <h2 className="text-2xl font-semibold text-[#0A3E54] text-center">
                  Simpan event favoritmu & ikut berkontribusi!
                </h2>
                <Link
                  to="/"
                  className="bg-[#0A3E54] text-white px-8 py-3 rounded-full hover:bg-[#0A3E54]/90 transition-colors"
                >
                  Cari Volunteer
                </Link>
              </div>
            </>
          )}
        </div>
        <Marketing />
      </section>
      <Footer />
    </section>
  );
};

export default RegisteredEvent;