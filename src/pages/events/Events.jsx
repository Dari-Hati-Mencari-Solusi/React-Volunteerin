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
        console.log('Events component - fetching with category ID:', selectedCategory, 'limit:', limit);
        
        // Simulasi delay untuk visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Ambil data events dengan kategori yang dipilih (jika ada)
        const response = await fetchEvents(limit, selectedCategory);
        
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        
        // Jika selectedCategory ada, filter client-side untuk memastikan hanya event dengan kategori tersebut yang ditampilkan
        let filteredEvents = response.data;
        
        if (selectedCategory) {
          // Filter untuk hanya menampilkan event yang memiliki kategori yang dipilih
          filteredEvents = filteredEvents.filter(event => {
            // Pastikan event.categories adalah array dan ada
            if (!event.categories || !Array.isArray(event.categories)) {
              return false;
            }
            
            // Cek apakah event memiliki kategori yang dipilih
            return event.categories.some(cat => cat.id === selectedCategory);
          });
          
          console.log(`Filtered to ${filteredEvents.length} events for category ID ${selectedCategory}`);
        }
        
        setEvents(filteredEvents);
        setError(null);
      } catch (err) {
        console.error('Error in Events component:', err);
        setError("Gagal mengambil data event: " + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventsData();
  }, [selectedCategory, limit]);

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

  if (!events || events.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Tidak ada event yang tersedia untuk kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
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
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80"; // Fallback image
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
                <span className="text-[14px]">
                  {`${event.registrationCount || 0} / ${event.maxApplicant} Terdaftar`}
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
      ))}
    </div>
  );
};

export default Events;