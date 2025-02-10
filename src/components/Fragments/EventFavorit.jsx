import React from "react";
import { Calendar } from "lucide-react";

const EventFavorit = () => {
  const favoriteEvents = [
    { id: 1, title: "Event 1", date: "2023-10-15", description: "Description for Event 1" },
    { id: 2, title: "Event 2", date: "2023-11-20", description: "Description for Event 2" },
    { id: 3, title: "Event 3", date: "2023-12-25", description: "Description for Event 3" }
  ];

  return (
    <div className="space-y-4 lg:space-y-6 w-full">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Event Favorit</h1>
      
      <div className="bg-white shadow-lg rounded-xl lg:rounded-2xl p-4 lg:p-8">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Daftar Event Favorit</h2>
        </div>
        
        <div className="space-y-4">
          {favoriteEvents.map(event => (
            <div key={event.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center mt-2 text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFavorit;