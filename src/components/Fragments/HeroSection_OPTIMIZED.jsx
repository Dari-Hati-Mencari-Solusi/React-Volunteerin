import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import Banner1 from "../../assets/images/banner1.jpg";
import Banner2 from "../../assets/images/banner2.jpg";
import Banner3 from "../../assets/images/banner3.jpg";
import Banner4 from "../../assets/images/banner1.jpg";
import Banner5 from "../../assets/images/banner2.jpg";

// Import only core Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const bannerData = [
  {
    image: Banner1,
    link: "/event/1",
  },
  {
    image: Banner2,
    link: "/event/2",
  },
  {
    image: Banner3,
    link: "/event/3",
  },
  {
    image: Banner4,
    link: "/event/4",
  },
  {
    image: Banner5,
    link: "/event/5",
  },
];

const HeroSection = () => {
  const swiperRef = useRef(null);
  const [deviceType, setDeviceType] = useState(() => {
    // ============================================
    // OPTIMASI CLS: Set initial state based on screen
    // ============================================
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (width < 768) return "mobile";
    if (width >= 768 && width < 1024) return "tablet";
    return "desktop";
  });

  // ============================================
  // OPTIMASI LCP: Banner1 sudah di-preload di index.html
  // Tidak perlu lagi preload di sini
  // ============================================

  // Deteksi ukuran layar untuk responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width >= 768 && width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    
    // Add event listener dengan passive untuk better performance
    window.addEventListener("resize", handleResize, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Helper variables
  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  
  // ============================================
  // OPTIMASI CLS: Fixed heights untuk prevent layout shift
  // ============================================
  const getSwiperHeight = () => {
    switch (deviceType) {
      case "mobile": return "260px";
      case "tablet": return "320px";
      default: return "400px";
    }
  };

  const getSlideHeight = () => {
    switch (deviceType) {
      case "mobile": return "240px";
      case "tablet": return "300px";
      default: return "380px";
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-16 md:pt-16 lg:pt-16">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* ============================================ */}
        {/* OPTIMASI CLS: Fixed height container */}
        {/* ============================================ */}
        <div style={{ height: getSwiperHeight() }}>
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={20}
            loop={true}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass:
                "swiper-pagination-bullet !bg-cyan-200 !opacity-50 mx-1",
              bulletActiveClass: "!opacity-90 !bg-[#0A3E54]",
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            speed={800}
            modules={[Pagination, Autoplay, Navigation]}
            className="w-full h-full"
          >
            {bannerData.map((banner, index) => (
              <SwiperSlide key={index} className="!w-full" style={{ height: getSlideHeight() }}>
                <Link to={banner.link} className="block h-full">
                  <div className="w-full h-full rounded-lg shadow-md overflow-hidden relative group">
                    {/* ============================================ */}
                    {/* OPTIMASI LCP: Eager load + High Priority untuk banner pertama */}
                    {/* OPTIMASI CLS: Fixed aspect ratio dengan object-cover */}
                    {/* ============================================ */}
                    <img 
                      src={banner.image} 
                      alt={`Banner ${index + 1}`} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchpriority={index === 0 ? "high" : "low"}
                      decoding={index === 0 ? "sync" : "async"}
                      // ============================================
                      // OPTIMASI CLS: Explicit dimensions
                      // ============================================
                      width="1200"
                      height="675"
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex justify-center items-center mt-4 gap-4">
          {/* Tombol navigasi */}
          <div className={`swiper-button-prev !static !w-8 !h-8 !m-0 flex items-center justify-center ${isMobile ? 'scale-75' : ''}`}></div>
          <div className="swiper-pagination !static !w-auto"></div>
          <div className={`swiper-button-next !static !w-8 !h-8 !m-0 flex items-center justify-center ${isMobile ? 'scale-75' : ''}`}></div>
        </div>
      </div>

      {/* ============================================ */}
      {/* OPTIMASI CLS: Inline styles dengan fixed values */}
      {/* ============================================ */}
      <style jsx global>{`
        .swiper {
          width: 100% !important;
          border-radius: ${isMobile ? '12px' : isTablet ? '14px' : '16px'};
          overflow: hidden;
          height: ${getSwiperHeight()} !important;
        }
        
        .swiper-slide {
          opacity: 1;
          height: ${getSlideHeight()} !important;
          border-radius: ${isMobile ? '12px' : isTablet ? '14px' : '16px'};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .swiper-slide img {
          min-height: 100%;
          width: 100%;
        }
        
        /* Pagination styling */
        .swiper-pagination {
          position: relative !important;
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 4px;
        }
        
        .swiper-pagination-bullet {
          background-color: #A5F2FC;
          opacity: 0.5;
          width: ${isMobile ? '8px' : '10px'};
          height: ${isMobile ? '8px' : '10px'};
          margin: 0 4px;
          border-radius: 50%;
          transition: all 0.3s;
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1;
          background-color: #0A3E54;
          width: ${isMobile ? '10px' : '12px'};
          height: ${isMobile ? '10px' : '12px'};
        }
        
        /* Navigation buttons */
        .swiper-button-prev, .swiper-button-next {
          position: static !important;
          transform: none !important;
          width: ${isMobile ? '32px' : '40px'} !important; 
          height: ${isMobile ? '32px' : '40px'} !important; 
          background-color: #A5F2FC;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        
        .swiper-button-prev {
          padding-left: ${isMobile ? '3px' : '5px'};
        }
        
        .swiper-button-next {
          padding-right: ${isMobile ? '3px' : '5px'};
        }
        
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: #67E6F9;
        }
        
        .swiper-button-prev::after,
        .swiper-button-next::after {
          content: "";
          width: ${isMobile ? '10px' : '12px'};
          height: ${isMobile ? '10px' : '12px'};
          border-radius: 2px;
          border-top: ${isMobile ? '2px' : '3px'} solid #0A3E54;
          border-left: ${isMobile ? '2px' : '3px'} solid #0A3E54;
          transform: rotate(-45deg);
        }
        
        .swiper-button-next::after {
          transform: rotate(135deg);
        }
        
        /* Media queries untuk content fitting */
        @media (max-width: 767px) {
          .container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .container {
           max-width: 97%;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 97%;
          }
          
          .swiper {
            max-width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
