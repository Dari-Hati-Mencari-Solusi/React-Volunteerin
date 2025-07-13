import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { fetchEvents } from "../../services/eventService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80";

const EventCard = ({ event, isLoading, showSaveButton = true }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = () => {
      const savedEvents = JSON.parse(
        localStorage.getItem("savedEvents") || "[]"
      );
      const isEventSaved = savedEvents.some(
        (savedEvent) => savedEvent.id === event.id
      );
      setIsSaved(isEventSaved);
    };

    checkIfSaved();

    window.addEventListener("storage", checkIfSaved);

    return () => {
      window.removeEventListener("storage", checkIfSaved);
    };
  }, [event.id]);

  const toggleSaveEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const savedEvents = JSON.parse(localStorage.getItem("savedEvents") || "[]");

    if (isSaved) {
      // Hapus dari saved events
      const updatedSavedEvents = savedEvents.filter(
        (savedEvent) => savedEvent.id !== event.id
      );
      localStorage.setItem("savedEvents", JSON.stringify(updatedSavedEvents));

      // Trigger storage event untuk sinkronisasi
      window.dispatchEvent(new Event("storage"));

    
    } else {
      // Tambah ke saved events
      const eventToSave = {
        id: event.id,
        title: event.title,
        bannerUrl: event.bannerUrl,
        address: event.address,
        startAt: event.startAt,
        endAt: event.endAt,
        registrationCount: event.registrationCount,
        maxApplicant: event.maxApplicant,
        categories: event.categories,
        savedAt: new Date().toISOString(),
      };

      savedEvents.push(eventToSave);
      localStorage.setItem("savedEvents", JSON.stringify(savedEvents));

      // Trigger storage event untuk sinkronisasi
      window.dispatchEvent(new Event("storage"));

     
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className =
      "fixed bottom-4 right-4 bg-[#0A3E54] text-white py-2 px-4 rounded-md z-50";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.className += " opacity-0 transition-opacity duration-500";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 2500);
  };

  // const formatEventDate = (dateString) => {
  //   if (!dateString) return "";
  //   try {
  //     return new Date(dateString).toLocaleDateString();
  //   } catch (error) {
  //     return "";
  //   }
  // };

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);

      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Ags",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${dayName}, ${day} ${month} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  if (isLoading) {
    return <EventCardSkeleton />;
  }

  return (
    <div
      key={event.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
    >
      <Link
        to={`/event/${event.id}`}
        className="block h-full w-full absolute top-0 left-0 z-10"
        aria-label={`View details for ${event.title}`}
      />

      <img
        alt={event.title}
        src={event.bannerUrl}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = FALLBACK_IMAGE;
        }}
      />

      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#0A3E54] truncate">
          {event.title}
        </h2>
        <div className="space-y-3 text-sm font-normal text-[#0A3E54]">
          <div className="flex items-center gap-2">
            <Icon
              icon="tdesign:location"
              width="20"
              height="20"
              className="flex-shrink-0"
            />
            <span className="truncate text-[14px]">{event.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Icon icon="lets-icons:date-today-light" width="22" height="22" />
            <span className=" text-[14px]">
              {formatEventDate(event.startAt)} - {formatEventDate(event.endAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Icon icon="fa6-solid:user" width="20" height="20" />
            <span className="text-[14px]">
              {`${event.registrationCount || 0} / ${
                event.maxApplicant
              } Terdaftar`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <CategoryBadge categories={event.categories} />

           {showSaveButton && (
  <button
    className={`${
      isSaved ? "text-[#16A1CB]" : "text-[#0A3E54]"
    } hover:text-[#16A1CB] transition-colors focus:outline-none relative group p-2 z-30`}
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleSaveEvent(e);
    }}
    aria-label={isSaved ? "Hapus dari tersimpan" : "Simpan event"}
    type="button"
  >
    <Icon
      icon={
        isSaved ? "gravity-ui:bookmark-fill" : "akar-icons:ribbon"
      }
      width="24"
      height="24"
      className={`pointer-events-none transition-all duration-300 ${
        isSaved ? "scale-110" : "scale-100"
      }`}
    />

    <span className="absolute -top-10 right-0 bg-[#0A3E54] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-40 shadow-lg">
      {isSaved ? "Hapus dari tersimpan" : "Simpan event"}
    </span>
  </button>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>

    <div className="p-4 flex flex-col gap-3">
      <div className="h-6 bg-gray-200 rounded-md w-full"></div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-6 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-44"></div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-3/5"></div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <div className="h-7 bg-gray-200 rounded-full w-28 px-4"></div>
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
);

const EventsSkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array(count)
      .fill()
      .map((_, index) => (
        <EventCardSkeleton key={`skeleton-${index}`} />
      ))}
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 p-4 bg-red-50 border border-red-200 rounded-lg">
    <Icon
      icon="material-symbols:error-outline"
      className="inline-block mr-2 text-xl"
    />
    {message}
  </div>
);

const EmptyEventMessage = () => (
  <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
    <Icon
      icon="material-symbols:event-busy-outline"
      className="text-4xl text-gray-400 mb-2 mx-auto"
    />
    <p className="text-gray-500">
      Tidak ada event yang tersedia untuk kategori ini.
    </p>
    <Link
      to="/?category=null&name=Semua%20Event"
      className="text-[#0A3E54] font-medium mt-2 inline-block hover:underline"
      onClick={(e) => {
        e.preventDefault();
        localStorage.removeItem("volunteerin_selected_category");
        window.location.href = "/";
      }}
    >
      Kembali ke Semua Event
    </Link>
  </div>
);

const CategoryBadge = ({ categories }) => (
  <div className="bg-[#2196F3] text-white p-2 rounded-full px-4 font-semibold text-xs">
    {categories && categories.length > 0
      ? categories[0].name
      : "Event Berjalan"}
  </div>
);

const Events = ({ selectedCategory, limit, isLoading: externalLoading }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardLoading, setCardLoading] = useState(true);

  useEffect(() => {
    const fetchEventsData = async () => {
      if (externalLoading) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 200));

        const response = await fetchEvents(limit, selectedCategory);

        if (!response || !response.data) {
          throw new Error("Invalid response format");
        }

        let filteredEvents = response.data;

        if (selectedCategory) {
          filteredEvents = filteredEvents.filter(
            (event) =>
              event.categories &&
              Array.isArray(event.categories) &&
              event.categories.some((cat) => cat.id === selectedCategory)
          );
        }

        setEvents(filteredEvents);

        setCardLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 200));
        setCardLoading(false);
      } catch (err) {
        setError(
          `Gagal mengambil data event: ${err.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, [selectedCategory, limit, externalLoading]);

  if (loading || externalLoading) {
    return <EventsSkeletonGrid count={limit && limit <= 8 ? limit : 8} />;
  }

  if (error) return <ErrorMessage message={error} />;
  if (!events || events.length === 0) return <EmptyEventMessage />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isLoading={cardLoading} />
      ))}
    </div>
  );
};

export { EventCard, CategoryBadge, EventCardSkeleton };
export default Events;
