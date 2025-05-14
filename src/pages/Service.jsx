import React from "react";
import { Link } from "react-router-dom";
import LogoHero from "../assets/images/logo-hero.png";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Marquee from "react-fast-marquee";
import Surat from "../assets/images/surat.png";
import Banner from "../assets/images/banner1.jpg";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";

const Service = () => {
  const stats = [
    { number: 50, label: "Partner" },
    { number: 55, label: "Pengguna" },
    { number: 512, label: "Event dibuat" },
  ];

  const benefitCards = [
    {
      title: "Publikasi Event Gratis",
      description:
        "Dengan bergabung di Volunteerin, Anda bisa mendapatkan publikasi gratis melalui media sosial kami!",
    },
    {
      title: "Rekrut Kandidat dengan Cepat!",
      description:
        "Dengan bergabung di Volunteerin, Anda bisa menemukan kandidat terbaik dengan lebih cepat dan efisien.",
    },
    {
      title: "Bantuan Teknis Dengan Cepat!",
      description:
        "Tim Volunteerin siap melayani anda jika membutuhkan bantuan saat event berlangsung",
    },
    {
      title: "Management Event",
      description:
        "Volunteerin menyediakan dashboard untuk management event kamu",
    },
  ];

  const logos = [
    { id: 1, src: Banner, alt: "Volunteer Needed Logo" },
    { id: 2, src: Banner, alt: "Volunteer Group Logo" },
    { id: 3, src: Banner, alt: "Lets Volunteer Logo" },
    { id: 4, src: Banner, alt: "Volunteer Needed Blue Logo" },
    { id: 5, src: Banner, alt: "Lets Volunteer Community Logo" },
    { id: 3, src: Banner, alt: "Lets Volunteer Logo" },
    { id: 4, src: Banner, alt: "Volunteer Needed Blue Logo" },
    { id: 5, src: Banner, alt: "Lets Volunteer Community Logo" },
  ];

  const topRowCards = benefitCards.slice(0, 2);
  const bottomRowCards = benefitCards.slice(2, 4);

  return (
    <section className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12 max-w-screen-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center mt-16 md:mt-16">
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#87A5B1]">
              Mau Gabung Event?
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0A3E54]">
              Di Volunteerin Aja
            </h2>
            <h3 className="text-lg md:text-xl text-[#0A3E54]">Temukan Peluangmu, Wujudkan Aksimu</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-[#0A3E54] text-white px-5 py-3 rounded-xl hover:bg-[#164D63] transition-colors w-full sm:w-auto">
                <Link to='/auth'>
                Buat Event Kamu
                </Link>
              </button>
              <button className="border-[1.5px] border-[#0A3E54] text-slate-800 px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto">
                <Link to='/'>
                Jadi Volunteer
                </Link>
              </button>
            </div>
            <div className="flex justify-center md:justify-start gap-6 md:gap-12 pt-4 md:pt-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl md:text-5xl font-bold text-[#0A3E54]">
                    <CountUp end={stat.number} duration={4} suffix="+" />
                  </div>
                  <div className="text-sm md:text-base text-[#87A5B1]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 md:mt-0">
            <div className="relative w-full max-w-xs md:max-w-md">
              <div className="flex items-end gap-4">
                <img src={LogoHero} alt="Volunteerin Logo" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-gray-50 p-4 md:p-8 rounded-xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="w-full md:w-[65%] flex flex-col justify-center items-center text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3E54] mb-2 md:mb-4">
                Gabung Volunteerin dapat Benefit apa saja Sih?
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Anda bisa menikmati berbagai benefit yang kami sediakan untuk
                mendukung kebutuhan event Anda!
              </p>
            </div>
            <div className="w-full lg:w-[65%] md:w-[50%]">
              <div className="overflow-hidden">
              <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="mb-1"
            >
              <div className="flex gap-1 py-2 cursor-default">
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`top-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`top-dup-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </Marquee>
              </div>
              <div className="overflow-hidden">
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              direction="right"
            >
              <div className="flex gap-1 py-1 cursor-default">
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`bottom-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-xl shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`bottom-dup-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-xl shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </Marquee>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Improved Mobile Layout */}
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-gray-50 p-4 md:p-8 rounded-xl">
          <div className="mb-6 md:mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3E54] mb-2 md:mb-4">
              Fitur yang Kami Tawarkan Untuk Kamu
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Anda bisa mengunakan fitur yang kami siapkan untuk mengelola event
              kamu.
            </p>
          </div>
          <div className="w-full">
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="mb-2"
            >
              <div className="flex gap-1 py-1 cursor-default">
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`top-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`top-dup-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </Marquee>
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              direction="right"
            >
              <div className="flex gap-1 py-1 cursor-default">
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`bottom-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-xl shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
                {benefitCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`bottom-dup-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-xl shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        </div>
      </div>

      {/* Templates Section - Improved Mobile Layout */}
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between rounded-xl">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 pr-0 md:pr-8 text-center md:text-left">
            <h1 className="text-xl sm:text-3xl font-semibold text-[#0A3E54] mb-3 md:mb-4">
              Gunakan Template Formulir yang Kami Sediakan!
            </h1>
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
              Dapatkan template formulir gratis dan sesuaikan formulir
              pendaftaran sesuai dengan kebutuhan Anda. Mudah, praktis, dan siap
              digunakan!
            </p>
            <button className="bg-[#0A3E54] hover:bg-[#164D63] text-white py-2 md:py-3 px-4 md:px-6 rounded-xl font-medium transition duration-300 w-full sm:w-auto">
              Lihat Template Kami
            </button>
          </div>
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="relative w-full sm:w-64 shadow-lg rounded-lg overflow-hidden bg-white mb-4 sm:mb-0 max-w-xs">
              <img
                src={Surat}
                alt="Form template screenshot 1"
                className="w-full h-auto"
              />
            </div>
            <div className="relative w-full sm:w-64 shadow-lg rounded-lg overflow-hidden bg-white max-w-xs">
              <img
                src={Surat}
                alt="Form template screenshot 2"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section - Improved Mobile Layout */}
      <section className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-gray-50 p-4 md:p-8 rounded-xl">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3E54] mb-2 md:mb-4">
              Partner Kami
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
              Beberapa event organizer telah mempercayakan platform kami untuk
              mempublikasikan event volunteer mereka, menjangkau lebih banyak
              relawan dan komunitas.
            </p>
          </div>
          <div className="mt-6 md:mt-12">
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="py-4"
            >
              {logos.map((logoPartner) => (
                <div key={logoPartner.id} className="mx-4 md:mx-8">
                  <img
                    src={logoPartner.src}
                    alt={logoPartner.alt}
                    className="h-20 w-20 md:h-32 md:w-32 rounded-full"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Contact Section - Improved Mobile Layout */}
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-[#164D63] text-white p-4 md:p-8 rounded-lg flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-start">
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Mau Ngobrol atau Ngasih Masukan?
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-sm md:text-md text-center md:text-left">
              Kami senang banget denger masukan dari kamu! Kalo ada saran,
              pertanyaan, atau apapun, langsung aja hubungi kami. Let's talk!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
          <div className="group bg-white border border-gray-200 p-4 md:p-6 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer transition duration-300">
            <a href="#" className="text-[#164D63] text-xl md:text-2xl font-reguler">
              Curhat
            </a>
            <Icon
              icon="proicons:arrow-right"
              className="text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              width="20"
              height="20"
            />
          </div>
          <div className="group bg-white border border-gray-200 p-4 md:p-6 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer transition duration-300">
            <a href="#" className="text-[#164D63] text-xl md:text-2xl font-reguler">
              Request Fitur
            </a>
            <Icon
              icon="proicons:arrow-right"
              className="text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              width="20"
              height="20"
            />
          </div>
          <div className="group bg-white border border-gray-200 p-4 md:p-6 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer transition duration-300">
            <a href="#" className="text-[#164D63] text-xl md:text-2xl font-reguler">
              Beri Feedback
            </a>
            <Icon
              icon="proicons:arrow-right"
              className="text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              width="20"
              height="20"
            />
          </div>
          <div className="group bg-white border border-gray-200 p-4 md:p-6 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer transition duration-300">
            <a href="#" className="text-[#164D63] text-xl md:text-2xl font-reguler">
              Kunjungi Kami
            </a>
            <Icon
              icon="proicons:arrow-right"
              className="text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              width="20"
              height="20"
            />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Service;