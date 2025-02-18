import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import NotificationCard from "../../components/Elements/notification/NotificationCard";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const NotificationUser = () => {
  const [openNotificationId, setOpenNotificationId] = useState(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Penanaman pohon magrove",
      location: "Pantai cangkring, Yogyakarta",
      status: "Acara Selesai",
      isRead: true,
    },
    {
      id: 2,
      title: "Penanaman pohon magrove",
      location: "Pantai cangkring, Yogyakarta",
      status: "Acara Selesai",
      isRead: true,
    },
    {
      id: 3,
      title: "Penanaman pohon magrove",
      location: "Pantai cangkring, Yogyakarta",
      status: "Acara Selesai",
      isRead: true,
    },
    {
      id: 4,
      title: "Penanaman pohon magrove",
      location: "Pantai cangkring, Yogyakarta",
      status: "Acara Berjalan",
      isRead: false,
    },
  ];

  const handleNotificationClick = (notificationId) => {
    setOpenNotificationId(
      openNotificationId === notificationId ? null : notificationId
    );
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((notification) => !notification.isRead)
    : notifications;

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] text-xl font-medium">Notifikasi</span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Tampilkan yang belum dibaca
            </span>
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
                showUnreadOnly ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  showUnreadOnly ? "translate-x-7" : "translate-x-1"
                }`}
              ></div>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              title={notification.title}
              location={notification.location}
              status={notification.status}
              isRead={notification.isRead}
              isOpen={openNotificationId === notification.id}
              onClick={() => handleNotificationClick(notification.id)}
            />
          ))}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada notifikasi yang belum dibaca
            </div>
          )}
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default NotificationUser;
