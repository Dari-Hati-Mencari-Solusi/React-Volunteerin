// import React from "react";
// import { Link } from "react-router-dom";

// const NotFoundPage = () => {
//   return (
//     <div className="min-h-screen bg-[#0A3E54] flex flex-col justify-center items-center text-white">
//       <h1 className="text-9xl font-bold">404</h1>
//       <p className="text-2xl mt-4">Oops! Halaman tidak ditemukan.</p>
//       <p className="text-lg mt-2">
//         Sepertinya Anda tersesat. Mari kembali ke beranda.
//       </p>
//       <Link
//         to="/"
//         className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg"
//       >
//         Kembali ke Beranda
//       </Link>
//     </div>
//   );
// };

// export default NotFoundPage;


import React from 'react';
import { Globe, Camera } from 'lucide-react';
import Banner from '../assets/images/banner1.jpg';
import Logo from '../assets/images/Logo.png';

const VisualPoetry = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            {/* Title */}
            <h1 className="text-6xl font-black tracking-tight">
              visual<br />poetry
            </h1>

            {/* Description */}
            <p className="text-gray-700 max-w-md">
              Welcome to a visual journey that transcends time and space. Discover the artistry of moments captured in motion
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {['yt', 'ig', 'fb', 'x'].map((social) => (
                <div key={social} className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-sm">
                  {social}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold">+250k</h2>
                <p className="text-sm text-gray-600 max-w-xs">
                  Videos that reaching a wide audience and give lasting impression
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">+800k</h2>
                <p className="text-sm text-gray-600 max-w-xs">
                  Hours watched, engaging storytelling that captivates viewers
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className="relative flex-1">
            <div className="relative bg-orange-300 rounded-3xl p-8">
              {/* Main Image */}
              <div className="relative">
                <img 
                  src={Banner}
                  alt="Photographer with camera"
                  className="rounded-2xl"
                />
                
                {/* Floating Elements */}
                <div className="absolute -right-4 top-1/4 flex flex-col gap-4">
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center">
                    <img 
                      src={Logo}
                      alt="Small preview"
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center">
                    <Globe className="w-8 h-8" />
                  </div>
                </div>

                {/* Signature */}
                <div className="absolute top-4 right-4">
                  <span className="text-2xl italic">Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualPoetry;