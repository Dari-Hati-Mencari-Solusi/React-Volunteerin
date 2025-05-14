import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import Banner1 from "../../assets/images/banner1.jpg";
import Banner2 from "../../assets/images/banner2.jpg";
import Banner3 from "../../assets/images/banner3.jpg";
import Banner4 from "../../assets/images/banner1.jpg";
import Banner5 from "../../assets/images/banner2.jpg";
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

  return (
    <section className="relative w-full overflow-hidden pt-16">
      <div className="container mx-auto px-4 py-6">
        <Swiper
          ref={swiperRef}
          initialSlide={1}
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={10}
          loop={true}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletClass:
              "swiper-pagination-bullet !bg-cyan-200 !opacity-50 mx-1",
            bulletActiveClass: "!opacity-90 !bg-orange-600",
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay, Navigation]}
          className="!overflow-visible h-[353px]"
        >
          {bannerData.map((banner, index) => (
            <SwiperSlide
              key={index}
              className="!w-[1122px] h-full transition-all duration-300"
            >
              <Link to={banner.link}>
                <div
                  className="w-full h-full bg-cover bg-center rounded-[12px] overflow-hidden relative group"
                  style={{ backgroundImage: `url(${banner.image})` }}
                ></div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center items-center mt-2 gap-4">
          <div className="swiper-button-prev !static !w-8 !h-8 !m-0 flex items-center justify-center"></div>
          <div className="swiper-pagination !static !w-auto"></div>
          <div className="swiper-button-next !static !w-8 !h-8 !m-0 flex items-center justify-center"></div>
        </div>
      </div>

      <style jsx global>{`
        .swiper-slide {
          opacity: 0.4;
          transition: opacity 0.3s;
        }
        .swiper-slide-active {
          opacity: 1;
        }
        .swiper-wrapper {
          align-items: center;
        }
        .swiper-pagination {
          position: relative !important;
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .swiper-pagination-bullet {
          background-color: #fff;
          opacity: 0.5;
          width: 12px;
          height: 12px;
          margin: 0 4px;
          border-radius: 50%;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background-color: #ff0000;
        }
        .swiper-button-prev {
         position: static !important;
          transform: none !important;
          width: 40px !important; 
          height: 40px !important; 
          background-color: #A5F2FC; /* Latar belakang tombol */
          border-radius: 50%; /* Membuat tombol bulat */
          display: flex;
          padding-left: 5px;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
          }
        .swiper-button-next {
          position: static !important;
          transform: none !important;
          width: 40px !important; 
          height: 40px !important; 
          background-color: #A5F2FC; /* Latar belakang tombol */
          border-radius: 50%; /* Membuat tombol bulat */
          display: flex;
           padding-right: 5px;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: #67E6F9;
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          content: "";
          width: 12px; /* Ukuran panah */
          height: 12px; /* Ukuran panah */
          border-radius: 2px;
          border-top: 3px solid #155D75;
          border-left: 3px solid #155D75;
          transform: rotate(-45deg);
        }
        .swiper-button-next::after {
          transform: rotate(135deg);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
