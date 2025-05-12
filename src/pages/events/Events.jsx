import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { fetchEvents } from "../../services/eventService";

// Konstanta untuk nilai-nilai yang digunakan berulang kali
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80";
const PRIMARY_COLOR = "#0A3E54";
const CATEGORY_BG_COLOR = "#22D0EE";

// Komponen untuk menampilkan status loading
const LoadingIndicator = () => (
  <div className="flex justify-center items-center p-12">
    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[${PRIMARY_COLOR}]`}></div>
  </div>
);

// Komponen untuk menampilkan pesan error
const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 p-4">
    {message}
  </div>
);

// Komponen untuk menampilkan pesan ketika tidak ada event
const EmptyEventMessage = () => (
  <div className="text-center p-8">
    <p className="text-gray-500">Tidak ada event yang tersedia untuk kategori ini.</p>
  </div>
);

// Komponen untuk menampilkan category badge
const CategoryBadge = ({ categories }) => (
  <div className={`text-[${PRIMARY_COLOR}] bg-[${CATEGORY_BG_COLOR}] p-2 rounded-full px-4 font-semibold text-xs`}>
    {categories && categories.length > 0 ? (
      categories[0].name
    ) : (
      "Event Berjalan"
    )}
  </div>
);

// Komponen untuk menampilkan satu event card
const EventCard = ({ event }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  
  return (
    <div
      key={event.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
    >
      {/* Membuat keseluruhan card dapat diklik */}
      <Link 
        to={`/event/${event.id}`}
        className="block h-full w-full absolute top-0 left-0 z-10"
        aria-label={`View details for ${event.title}`}
      />
      
      <img
        alt={event.title}
        src={event.bannerUrl}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
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
              {`${event.registrationCount || 0} / ${event.maxApplicant} Terdaftar`}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <CategoryBadge categories={event.categories} />
            
            {/* Save button dengan z-index lebih tinggi untuk tetap dapat diklik */}
            <Link 
              to={`/save-event/${event.id}`} 
              className="relative z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon="akar-icons:ribbon" width="24" height="24" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Events = ({ selectedCategory, limit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch events data
        const response = await fetchEvents(limit, selectedCategory);
        
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        
        let filteredEvents = response.data;
        
        // Filter events by category if needed
        if (selectedCategory) {
          filteredEvents = filteredEvents.filter(event => 
            event.categories && 
            Array.isArray(event.categories) &&
            event.categories.some(cat => cat.id === selectedCategory)
          );
        }
        
        setEvents(filteredEvents);
      } catch (err) {
        setError(`Gagal mengambil data event: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventsData();
  }, [selectedCategory, limit]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;
  if (!events || events.length === 0) return <EmptyEventMessage />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default Events;