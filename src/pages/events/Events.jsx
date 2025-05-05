import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { fetchEvents } from "../../services/eventService"; 

const Events = ({ selectedCategory, limit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        setLoading(true);
        // Log nilai parameter untuk debugging
        console.log('Fetching with params:', { limit, selectedCategory });
        
        // Tambahkan delay kecil untuk memastikan loading state terlihat
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await fetchEvents(limit, selectedCategory);
        console.log('Response received:', response);
        
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error in component:', err);
        setError("Gagal mengambil data event: " + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventsData();
  }, [selectedCategory, limit]);
  
  // Hindari double filtering - karena sudah difilter di service
  // Gunakan events langsung dari response
  const limitedEvents = events;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!limitedEvents || limitedEvents.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Tidak ada event yang tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {limitedEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            alt={event.title}
            src={event.bannerUrl}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80"; // Fallback image
            }}
          />
          <div className="p-4 flex flex-col gap-3">
            <Link to={`/event/${event.id}`}>
              <h2 className="text-xl font-bold text-[#0A3E54] truncate">
                {event.title}
              </h2>
            </Link>
            <div className="space-y-3 text-sm font-normal text-[#0A3E54]">
              <div className="flex items-center gap-2">
                <Icon icon="tdesign:location" width="18" height="18" />
                <span className="truncate text-[14px]">{event.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="lets-icons:date-today-light"
                  width="18"
                  height="18"
                />
                <span className="truncate text-[14px]">
                  {new Date(event.startAt).toLocaleDateString()} - {new Date(event.endAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="fa6-solid:user" width="16" height="16" />
                <span className="truncate text-[14px]">
                  By: {event.user?.name || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[#0A3E54] bg-[#22D0EE] p-2 rounded-full px-4 font-semibold text-xs">
                  {event.categories && event.categories.length > 0 ? (
                    <h1>{event.categories[0].name}</h1>
                  ) : (
                    <h1>Event Berjalan</h1>
                  )}
                </div>
                <Link to={`/save-event/${event.id}`}>
                  <Icon icon="stash:save-ribbon" width="18" height="18" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;