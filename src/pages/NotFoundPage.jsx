import React from 'react';

const ContactSection = () => {
  return (
    <div className="max-w-6xl mx-auto my-8">
      {/* Main contact header section */}
      <div className="bg-teal-800 text-white p-8 rounded-lg flex flex-col md:flex-row gap-6 justify-between items-start">
        {/* Left side heading */}
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-2">Mau Ngobrol atau Ngasih Masukan?</h2>
        </div>
        
        {/* Right side text */}
        <div className="md:w-1/2">
          <p className="text-lg">
            Kami senang banget denger masukan dari kamu! Kalo ada saran, pertanyaan, atau apapun, langsung aja hubungi kami. Let's talk!
          </p>
        </div>
      </div>

      {/* Action buttons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Chat button */}
        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition duration-300">
          <a href="#" className="text-teal-800 text-xl font-medium block">
            Curhat
          </a>
        </div>

        {/* Request feature button */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg flex justify-between items-center hover:bg-gray-50 transition duration-300">
          <a href="#" className="text-teal-800 text-xl font-medium">
            Request Fitur
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        {/* Feedback button */}
        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition duration-300">
          <a href="#" className="text-teal-800 text-xl font-medium block">
            Beri Feedback
          </a>
        </div>

        {/* Visit us button */}
        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition duration-300">
          <a href="#" className="text-teal-800 text-xl font-medium block">
            Kunjungi Kami
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;