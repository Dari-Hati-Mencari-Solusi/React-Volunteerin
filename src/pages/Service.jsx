import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoHero from "../assets/images/logo-hero.png";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Marquee from "react-fast-marquee";
import Surat from "../assets/images/surat.png";
import Banner from "../assets/images/partner2.jpg";
import partner1 from "../assets/images/partner1.jpg";
import partner2 from "../assets/images/partner2.jpg";
import partner3 from "../assets/images/partner3.jpg";
import partner4 from "../assets/images/partner4.jpg";
import partner5 from "../assets/images/partner1.jpg";
import partner6 from "../assets/images/partner2.jpg";
import partner7 from "../assets/images/partner3.jpg";
import partner8 from "../assets/images/partner4.jpg";
import users from "../assets/images/market.jpg";
import user from "../assets/images/user.png";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";

import ReactGA from "react-ga4";

const Service = () => {
  const navigate = useNavigate();
  const handleBuatEventClick = () => {
    ReactGA.event({
      category: "Tombol CTA",
      action: "Klik Tombol 'Buat Event Kamu'",
      label: "Halaman Layanan - Hero Section",
    });
    navigate("/auth");
  };

  const handleJadiVolunteerClick = () => {
    ReactGA.event({
      category: "Tombol CTA",
      action: "Klik Tombol 'Jadi Volunteer'",
      label: "Halaman Layanan - Hero Section",
    });
    navigate("/");
  };

  const handleGabungPartnerClick = () => {
    ReactGA.event({
      category: "Tombol CTA",
      action: "Klik Tombol 'Gabung menjadi Partner'",
      label: "Halaman Layanan - Trust Section",
    });
    navigate("/auth");
  };

  const stats = [
    { number: 10, label: "Partner" },
    { number: 50, label: "Pengguna" },
    { number: 5, label: "Event dibuat" },
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

  const CardFitur = [
    {
      title: "Gamifikasi Point",
      description:
        "Volunteer dapat melihat point yang didapatkan dengan cara mendaftar event, login selama 10 menit, dan mengikuti event hingga selesai!",
    },
    {
      title: "Ai Rekomendasi",
      description:
        "Volunteerin merekomendasikan event yang cocok untuk kamu dalam memilih event!",
    },
    {
      title: "Pelacakan Lokasi",
      description:
        "Volunteerin dapat mendeteksi lokasi kamu berdasarkan jarak event dilaksanakan.",
    },
    {
      title: "Dapatkan Informasi Real-time",
      description:
        "Volunteerin memberikan informasi pendaftaran secara jelas dan real-time, dengan track record riwayat pendaftaran event.",
    },
    {
      title: "Custom Formulir Pendaftaran",
      description:
        "Volunteerin menyediakan custom formulir pendaftaran evetn organizer, sehingga event organizer dapat menyesuaikan formulir pendaftaran sesuai dengan kebutuhan event.",
    },
    {
      title: "Transaksi dan withdraw",
      description:
        "Volunteerin menyediakan fitur transaksi dan withdraw untuk event organizer, sehingga event organizer dapat melakukan transaksi dengan mudah.",
    },
  ];

  const logos = [
    { id: 1, src: partner1, alt: "Volunteer Needed Logo" },
    { id: 2, src: partner2, alt: "Volunteer Group Logo" },
    { id: 3, src: partner3, alt: "Lets Volunteer Logo" },
    { id: 4, src: partner4, alt: "Volunteer Needed Blue Logo" },
    { id: 5, src: partner5, alt: "Lets Volunteer Community Logo" },
    { id: 6, src: partner6, alt: "Lets Volunteer Logo" },
    { id: 7, src: partner7, alt: "Volunteer Needed Blue Logo" },
    { id: 8, src: partner8, alt: "Lets Volunteer Community Logo" },
  ];

  // Data untuk testimonial
  const testimonials = [
    {
      id: 1,
      name: "Haris Haris",
      role: "Tim Lead di Perusahaan",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolutpat, rhoncus, et consequat quis lorem ligula.",
      avatar: user,
    },
    {
      id: 2,
      name: "Jhojan Alvara",
      role: "CEO de Gara Garcia",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolutpat, rhoncus, et consequat quis lorem ligula.",
      avatar: user,
    },
    {
      id: 3,
      name: "Toyya Ebheri",
      role: "Community Lead di Jembersa",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolutpat, rhoncus, et consequat quis lorem ligula.",
      avatar: user,
    },
    {
      id: 4,
      name: "Fuji Permata",
      role: "Representatif di Jarak",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolutpat, rhoncus, et consequat quis lorem ligula.",
      avatar: user,
    },
  ];

  // Data untuk trusted partners
  const trustedPartners = [
    { id: 1, src: Banner, alt: "PUANI Logo" },
    { id: 2, src: Banner, alt: "Universidad Logo" },
    { id: 3, src: Banner, alt: "Company Logo" },
    { id: 4, src: Banner, alt: "Organization Logo" },
    { id: 5, src: Banner, alt: "Partner Logo" },
  ];

  // Data untuk event organizers
  const eventOrganizers = [
    "Organisasi",
    "Komunitas & NGO",
    "Event Organizer",
    "Corporate & CSR",
    "Kampus, Pemerintah, atau Institut",
  ];

  // Data untuk steps
  const steps = [
    { number: 1, title: "Buat Event", description: "" },
    { number: 2, title: "Lengkapi Detail Event", description: "" },
    { number: 3, title: "Atur Pendaftaran dan Deadline", description: "" },
    { number: 4, title: "Publish Event", description: "" },
    { number: 5, title: "Pantau & Kelola Pendaftar", description: "" },
  ];

  return (
    <section className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12 max-w-screen-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center mt-16 md:mt-16">
          <div className="space-y-4 md:space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#87A5B1]">
              Butuh Relawan untuk Event Kamu?
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0A3E54]">
              di Volunteerin Aja
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Jangkau lebih banyak relawan,
              <br />
              Tingkatkan dampak aksi sosialmu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleBuatEventClick}
                className="bg-[#0A3E54] text-white px-5 py-3 rounded-xl hover:bg-[#164D63] transition-colors w-full sm:w-auto"
              >
                Gabung menjadi Partner
              </button>
            </div>
            <div className="flex justify-center md:justify-start gap-6 md:gap-12 pt-4 md:pt-8">
              <div>
                <div className="text-3xl md:text-5xl font-bold text-[#0A3E54]">
                  <CountUp end={5} duration={4} suffix="+" />
                </div>
                <div className="text-sm md:text-base text-[#87A5B1]">
                  Penyelenggara
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-bold text-[#0A3E54]">
                  <CountUp end={50} duration={4} suffix="+" />
                </div>
                <div className="text-sm md:text-base text-[#87A5B1]">
                  Pengguna
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-bold text-[#0A3E54]">
                  <CountUp end={25} duration={4} suffix="+" />
                </div>
                <div className="text-sm md:text-base text-[#87A5B1]">
                  Event dibuat
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6 md:mt-0">
            <div className="relative w-full max-w-xs md:max-w-md">
              <div className="flex items-end gap-4">
                <img
                  src={LogoHero}
                  alt="Volunteerin Logo"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Partners Section */}
      <section className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className=" p-4 md:p-8 rounded-xl">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3E54] mb-4">
              Mereka Sudah Percaya
              <br />
              Sekarang Giliran Anda!
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-8">
              Banyak penyelenggara event telah menggunakan Volunteerin untuk
              <br />
              mempublikasikan kegiatan dan menemukan relawan terbaik. Kini,
              giliran Anda
              <br />
              menjangkau lebih banyak orang, membangun komunitas, dan
              menciptakan
              <br />
              dampak yang lebih besar bersama kami.
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
                    className="h-20 w-20 md:h-32 md:w-32 rounded-full object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-[#0A3E54] text-white p-6 md:p-12 rounded-xl text-center">
          <h2 className="text-xl md:text-3xl font-semibold mb-3 md:mb-4">
            Buat Event Kamu
            <br />
            dalam Hitungan Menit
          </h2>
          <p className="text-gray-200 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Cuma butuh beberapa langkah, event sosial kamu bisa tayang dan
            dijangkau lebih banyak relawan lewat Volunteerin.
          </p>

          <div className="flex flex-wrap gap-4 md:gap-5 justify-items-center max-w-6xl mx-auto md:justify-center justify-center">
            {[
              { number: 1, title: "Buat Event" },
              { number: 2, title: "Lengkapi Detail Event" },
              { number: 3, title: "Atur Pendaftaran dan Deadline" },
              { number: 4, title: "Publish Event" },
              { number: 5, title: "Pantau & Kelola Pendaftar" },
            ].map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className="border-2 border-[#CFF9FE] white rounded-2xl p-4 w-72 h-28 md:w-40 md:h-32 lg:w-44 lg:h-36 flex flex-col items-center justify-center bg-transparent">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-[#CFF9FE] text-[#2C5F6F] rounded-full flex items-center justify-center mb-2 md:mb-3">
                    <span className="text-base sm:text-lg md:text-lg lg:text-lg font-bold">
                      {step.number}
                    </span>
                  </div>
                  <p className="text-xs sm:text-xs md:text-xs lg:text-sm text-center font-medium leading-tight text-[#CFF9FE] px-2">
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
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
                    {benefitCards.slice(0, 2).map((card, index) => (
                      <div
                        key={`top-${index}`}
                        className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                      >
                        <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm">
                          {card.description}
                        </p>
                      </div>
                    ))}
                    {benefitCards.slice(0, 2).map((card, index) => (
                      <div
                        key={`top-dup-${index}`}
                        className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                      >
                        <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm">
                          {card.description}
                        </p>
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
                        <p className="text-gray-600 text-xs md:text-sm">
                          {card.description}
                        </p>
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
                        <p className="text-gray-600 text-xs md:text-sm">
                          {card.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
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
                {CardFitur.slice(0, 3).map((card, index) => (
                  <div
                    key={`top-feature-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {card.description}
                    </p>
                  </div>
                ))}
                {CardFitur.slice(0, 3).map((card, index) => (
                  <div
                    key={`top-feature-dup-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-lg shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {card.description}
                    </p>
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
                {CardFitur.slice(3, 6).map((card, index) => (
                  <div
                    key={`bottom-feature-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-xl shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {card.description}
                    </p>
                  </div>
                ))}
                {CardFitur.slice(3, 6).map((card, index) => (
                  <div
                    key={`bottom-feature-dup-${index}`}
                    className="w-64 sm:w-80 flex-shrink-0 bg-white p-3 md:p-4 rounded-xl shadow-sm mx-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#0A3E54] mb-2 md:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between rounded-xl">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 pr-0 md:pr-8 text-center md:text-left">
            <h1 className="text-xl sm:text-3xl font-semibold text-[#0A3E54] mb-3 md:mb-4">
              Ribet dalam Menyusun Formulir? Pakai Template Kami, Gratis
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

      {/* Event Organizers Section */}
      <div className="bg-white py-12 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10 md:gap-16">
            {/* Kolom Teks & Daftar Penyelenggara */}
            <div className="w-full md:w-5/12 text-center md:text-left">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4">
                Siapapun Kamu,
                <br />
                Acara Kerelawananmu Bisa
                <br />
                <span className="text-[#155D75]">Tayang di Sini!</span>
              </h2>

              <div className="space-y-4 md:space-y-5">
                {eventOrganizers.map((organizer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start md:justify-start gap-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-[#155D75] rounded-full flex items-center justify-center">
                      {/* Opsi: Ikon centang untuk visual yang lebih baik */}
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-gray-700 text-lg">{organizer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Gambar/Ilustrasi */}
            <div className="w-full md:w-6/12">
              <img
                src={users} // Pastikan variabel 'users' mengarah ke gambar yang relevan
                alt="Ilustrasi berbagai kalangan event organizer"
                className="w-full h-auto  "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3E54] mb-4">
            Apa yang mereka katakan?
          </h2>
        </div>
        <div className="mt-8">
          <Marquee gradient={false} speed={40} pauseOnHover={true}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="mx-4">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
                  <div className="mb-4">
                    <Icon
                      icon="mdi:format-quote-open"
                      className="text-4xl text-gray-500 mb-2"
                    />
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-[#0A3E54] text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Partners Section */}
      {/* <section className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
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
                    className="h-20 w-20 md:h-32 md:w-32 rounded-full object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
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
            <a
              href="#"
              className="text-[#164D63] text-xl md:text-2xl font-reguler"
            >
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
            <a
              href="#"
              className="text-[#164D63] text-xl md:text-2xl font-reguler"
            >
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
            <a
              href="#"
              className="text-[#164D63] text-xl md:text-2xl font-reguler"
            >
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
            <a
              href="#"
              className="text-[#164D63] text-xl md:text-2xl font-reguler"
            >
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
