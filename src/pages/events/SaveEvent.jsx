import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import IconVolunteer from "../../assets/images/icon.png";
import Footer from "../../components/footer/Footer";
import Marketing from "../../components/Fragments/Marketing";
import Events, { EventCard, EventCardSkeleton } from "./Events";

const SaveEventSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array(count)
      .fill()
      .map((_, index) => (
        <div key={`saved-skeleton-${index}`} className="relative">
          <EventCardSkeleton />
          <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      ))}
  </div>
);

const SaveEvent = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState(true);

  const refreshSavedEvents = () => {
    setLoading(true);
    setCardLoading(true);
    
    try {
      setTimeout(() => {
        const events = JSON.parse(localStorage.getItem("savedEvents") || "[]");
        events.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        setSavedEvents(events);
        
        setTimeout(() => {
          setCardLoading(false);
        }, 300);
      }, 400);
    } catch (error) {
      console.error("Error loading saved events:", error);
      setSavedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSavedEvents();

    const handleStorageChange = () => {
      refreshSavedEvents();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const removeFromSaved = (eventId) => {
    const updatedSavedEvents = savedEvents.filter(
      (event) => event.id !== eventId
    );
    localStorage.setItem("savedEvents", JSON.stringify(updatedSavedEvents));
    setSavedEvents(updatedSavedEvents);

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] text-xl font-medium">
            Event Tersimpan
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>

        <div className="mb-12 relative">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-semibold text-[#0A3E54]">
              Volunteer yang kamu simpan
            </h1>
            <span className="bg-[#0A3E54] text-white rounded-full w-8 h-8 flex items-center justify-center">
              {loading ? "..." : savedEvents.length}
            </span>
          </div>

          {loading ? (
            <SaveEventSkeleton count={savedEvents.length || 4} />
          ) : savedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {savedEvents.map((event) => (
                <div key={event.id} className="relative" style={{ isolation: "isolate" }}>
                  <EventCard
                    event={event}
                    isLoading={cardLoading}
                    showSaveButton={true}
                  />

                  {!cardLoading && (
                    <button
                      onClick={() => removeFromSaved(event.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md z-20 text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Hapus dari tersimpan"
                      type="button"
                    >
                      <Icon icon="mdi:delete-outline" width="20" height="20" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[#0A3E54]">
                    Belum ada event yang kamu simpan? 🎟️ Segera temukan event
                    yang sesuai dengan minatmu dan jangan lewatkan kesempatan
                    untuk ikut serta!
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
                  Daftar Volunteer & ikut berkontribusi!
                </h2>
                <Link
                  to="/"
                  className="bg-[#0A3E54] text-white px-8 py-3 rounded-full hover:bg-[#094863] transition-colors"
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

export default SaveEvent;