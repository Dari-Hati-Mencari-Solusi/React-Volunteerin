import React from 'react';
import Lottie from 'lottie-react';
import { useLocation } from 'react-router-dom';

const Loading = ({ isLoading }) => {
  // Buat referensi untuk lottie
  const lottieRef = React.useRef();
  const location = useLocation();

  // Reset animasi ketika lokasi berubah atau loading state berubah
  React.useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.2); // Opsional: set kecepatan animasi
      lottieRef.current.goToAndPlay(0);
    }
  }, [location.pathname, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="w-72 h-72">
        <Lottie
          lottieRef={lottieRef}
          animationData="https://lottie.host/embed/962add23-d6a6-437e-9d1a-566ec7d5de1b/IFxf0Ch1w2.lottie"
          loop={true}
          autoplay={true}
        />
      </div>
      <p className="text-lg text-[#0A3E54] font-medium">Mohon tunggu sebentar...</p>
    </div>
  );
};

export default Loading;