import React, { useState, useEffect } from "react";
import { MessageSquareMore } from "lucide-react";

const WhatsAppButton = ({ phoneNumber }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const toggleExpansion = () => {
      setIsExpanded((prev) => !prev);
    };

    const expandInterval = setInterval(toggleExpansion, 5000);

    return () => {
      clearInterval(expandInterval);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${+6285343037191}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`fixed right-3 bottom-4 lg:bottom-8 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-500 flex items-center ${
        isExpanded ? "pr-4" : "pr-0"
      }`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 flex items-center justify-center">
          <MessageSquareMore size={24} />
        </div>
        <span
          className={`whitespace-nowrap overflow-hidden transition-all duration-500 ${
            isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Butuh bantuan?
        </span>
      </div>
    </button>
  );
};

export default WhatsAppButton;
