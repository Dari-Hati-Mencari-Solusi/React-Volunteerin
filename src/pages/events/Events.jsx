import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { fetchEvents } from "../../services/eventService"; // Add this import

const Events = ({ selectedCategory, limit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        setLoading(true);
        const response = await fetchEvents(limit, selectedCategory);
        setEvents(response.data);
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data event.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventsData();
  }, [selectedCategory, limit]);
  

  // Filter events based on selected category
  const filteredEvents = selectedCategory
    ? events.filter((event) => 
        event.categories && 
        event.categories.some(cat => cat.name === selectedCategory)
      )
    : events;

  const limitedEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;

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

  if (limitedEvents.length === 0) {
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
                <span className="truncate text-[14px]">{event.location}</span>
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
              {/* Since we don't have maxVolunteers and registeredVolunteers in API data, 
                  I'm leaving this commented out. You can update if you have this data. */}
              {/* <div className="flex items-center gap-2">
                <Icon icon="fa6-solid:user-group" width="16" height="16" />
                <span className="truncate text-[14px]">
                  {event.registeredVolunteers}/{event.maxVolunteers} Terdaftar
                </span>
              </div> */}
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