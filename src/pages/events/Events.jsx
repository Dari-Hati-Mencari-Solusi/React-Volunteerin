import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { fetchEvents } from "../../services/eventService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80";

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
  <div className="text-[#0A3E54] bg-[#22D0EE] p-2 rounded-full px-4 font-semibold text-xs">
    {categories && categories.length > 0
      ? categories[0].name
      : "Event Berjalan"}
  </div>
);

const EventCard = ({ event, isLoading }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

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
            <Icon icon="tdesign:location" width="24" height="24" />
            <span className="truncate text-[14px]">{event.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Icon icon="lets-icons:date-today-light" width="18" height="18" />
            <span className="truncate text-[14px]">
              {formatDate(event.startAt)} - {formatDate(event.endAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Icon icon="fa6-solid:user" width="16" height="16" />
            <span className="text-[14px]">
              {`${event.registrationCount || 0} / ${
                event.maxApplicant
              } Terdaftar`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <CategoryBadge categories={event.categories} />

            <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
              <button className="text-[#0A3E54] hover:text-[#126D8A] transition-colors focus:outline-none">
                <Icon icon="akar-icons:ribbon" width="24" height="24" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

        // Loading skeleton untuk fetch data
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

        // Loading skeleton untuk card individu
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

  // loading placeholder khusus untuk card saja
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

export default Events;
