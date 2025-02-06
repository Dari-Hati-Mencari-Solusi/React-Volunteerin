import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Calendar, Instagram, MapPin, Dock, Gem } from "lucide-react";
import BtnDaftarVolunteer from "../../components/Elements/buttons/BtnDaftarVolunteer";
import SyaratKetentuan from "../../components/Fragments/SyaratKetentuan";
import Fasilitas from "../../components/Fragments/Fasilitas";
import WhatsAppButton from "../../components/Elements/buttons/BtnWhatsapp";
import logo from "../../assets/images/logo-title.png";

const EventDetail = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const eventData = {
    title: "Program Relawan Pengajar di Desa Terpencil",
    image:
      "https://images.unsplash.com/photo-1484959014842-cd1d967a39cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    categories: ["Pendidikan", "Sosial", "Kesehatan"],
    instagram: "volunteeredu",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum amet voluptates reiciendis facilis nobis sed cum? Numquam magni reiciendis officiis aut repudiandae, et fugit. In consectetur aut molestias aliquam consequuntur veniam? Non iste nam tempore excepturi, tempora eius! Voluptatem, quas. Sed vitae mollitia deserunt explicabo tenetur dolor quasi inventore laboriosam perspiciatis nihil accusamus possimus esse nemo eveniet, expedita necessitatibus nostrum blanditiis reprehenderit ullam maiores cupiditate. Quibusdam, beatae vitae! Quisquam nulla dicta earum assumenda doloribus modi cum sint minus corporis consequuntur provident exercitationem quod.",
    location:
      "Desa Sukamaju, Kecamatan Cipta Karya, Kabupaten Sukabumi, Jawa Barat",
    organizer: {
      name: "Komunitas Pendidikan Indonesia",
      logo: logo,
    },
    details: {
      registration: {
        label: "Pendaftaran",
        date: "23 Februari 2025 - 01 Maret 2025",
        icon: <Calendar size={32} className="text-blue-600" />,
        bgColor: "bg-blue-50",
      },
      announcement: {
        label: "Pengumuman Lolos",
        date: "20.00 WIB 02-03-2025",
        icon: <Calendar size={32} className="text-green-600" />,
        bgColor: "bg-green-50",
      },
      quota: {
        label: "Kuota Pendaftar",
        value: "100",
        icon: <Calendar size={32} className="text-purple-600" />,
        bgColor: "bg-purple-50",
      },
    },
    buttonWA: {
      contact: {
        whatsapp: "628123456789",
      },
    },
  };

  const getTruncatedText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const [activeSection, setActiveSection] = useState("syarat"); // Default to "syarat"

  // Add this function inside your EventDetail component
  const toggleSection = (section) => {
    setActiveSection(section);
  };

  return (
    <section className="flex flex-col space-y-20">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl space-y-5">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-[40px] lg:text-[44px] md:leading-10 font-bold py-3">
              {eventData.title}
            </h1>

            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={eventData.image}
                    alt={eventData.title}
                    className="w-full h-auto aspect-video object-cover"
                  />
                </div>

                {/* Categories, Organizer, and Location for mobile/tablet */}
                <div className="lg:hidden space-y-6 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-y-4">
                    <div className="flex flex-wrap gap-2 cursor-default">
                      {eventData.categories.map((category, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2 w-fit">
                        <Instagram size={16} className="text-gray-700" />
                        {eventData.instagram}
                      </span>
                    </div>
                  </div>

                  {/* Organizer for mobile */}
                  <div className="flex items-center gap-5 pt-5 md:pt-8">
                    <div className="bg-gray-200 rounded-full">
                      <img
                        src={eventData.organizer.logo}
                        alt="logo penyelenggara"
                        className="lg:w-[70px] lg:h-[55px] md:w-[60px] md:h-[60px] w-[60px] h-[60px] p-4 "
                      />
                    </div>
                    <span>
                      <h1 className="text-sm text-gray-400 font-medium">
                        Penyelenggara
                      </h1>
                      <p className="text-[20px] font-semibold">
                        {eventData.organizer.name}
                      </p>
                    </span>
                  </div>

                  {/* Location for mobile */}
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex-shrink-0">
                      <MapPin size={40} className="text-gray-500" />
                    </div>
                    <h1 className="text-base font-medium text-gray-700 line-clamp-2 px-5">
                      {eventData.location}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Right Column - Event Details */}
              <div className="lg:col-span-4 md:pt-5">
                <div className="bg-white rounded-2xl p-6 lg:p-8 h-full flex flex-col">
                  <h2 className="text-xl md:text-2xl font-bold mb-6">
                    Detail Event
                  </h2>

                  <div className="space-y-6 flex-1">
                    {Object.entries(eventData.details).map(([key, detail]) => (
                      <div key={key} className="flex items-start gap-4">
                        <div className={`${detail.bgColor} p-2 rounded-lg`}>
                          {detail.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {detail.label}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {detail.date || detail.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <BtnDaftarVolunteer />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories, Organizer, and Location for desktop */}
            <div className="hidden lg:flex lg:flex-col gap-6">
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-6 flex gap-4 cursor-default">
                  {eventData.categories.map((category, index) => (
                    <div
                      key={index}
                      className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium text-[#0A3E54]"
                    >
                      {category}
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-6 flex">
                  <a
                    href="https://www.instagram.com/whyuanang__/"
                    className="text-sm font-medium text-[#0A3E54] bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2 w-fit"
                  >
                    <Instagram size={16} className="text-[#0A3E54]" />
                    {eventData.instagram}
                  </a>
                </div>
              </div>

              {/* Organizer for desktop */}
              <div className="flex items-center gap-5 lg:pt-6  ">
                <div className="bg-gray-200 rounded-full">
                  <img
                    src={eventData.organizer.logo}
                    alt="logo penyelenggara"
                    className="w-[60px] h-[60px] p-4"
                  />
                </div>
                <span>
                  <h1 className="text-sm text-gray-400 font-medium">
                    Penyelenggara
                  </h1>
                  <p className="text-[20px] font-semibold">
                    {eventData.organizer.name}
                  </p>
                </span>
              </div>

              {/* Location for desktop */}
              <div className="flex items-center gap-3 px-2">
                <div className="flex-shrink-0">
                  <MapPin size={40} className="text-gray-500" />
                </div>
                <h1 className="text-xl font-medium text-gray-500 px-5">
                  {eventData.location}
                </h1>
              </div>
            </div>

            <div class="border-b-2 border-dashed border-gray-400 pt-5 md:pt-8"></div>
          </div>

          <div className="py-5 space-y-3">
            <h1 className="text-xl md:text-2xl font-bold">
              Tentang Event Volunteer
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {isExpanded
                ? eventData.description
                : getTruncatedText(eventData.description)}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              {isExpanded ? "Tutup" : "Selengkapnya"}
            </button>
          </div>

          {/* syarat & ketentuan, Fasilitas */}
          <div className="space-y-4 md:pt-5 pt-5">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleSection("syarat")}
                className={`flex items-center gap-2 py-2 rounded-[12px] p-2 transition-all duration-300 ${
                  activeSection === "syarat"
                    ? "bg-[#0A3E54] text-white"
                    : "bg-gray-200 text-[#0A3E54] hover:bg-gray-300"
                }`}
              >
                <Dock
                  size={24}
                  className={
                    activeSection === "syarat" ? "text-white" : "text-[#0A3E54]"
                  }
                />
                <h1 className="font-medium text-[15px]">Syarat & Ketentuan</h1>
              </button>

              <button
                onClick={() => toggleSection("fasilitas")}
                className={`flex items-center gap-2 py-2 rounded-[12px] p-2 transition-all duration-300 ${
                  activeSection === "fasilitas"
                    ? "bg-[#0A3E54] text-white"
                    : "bg-gray-200 text-[#0A3E54] hover:bg-gray-300"
                }`}
              >
                <Gem
                  size={24}
                  className={
                    activeSection === "fasilitas"
                      ? "text-white"
                      : "text-[#0A3E54]"
                  }
                />
                <h1 className="font-medium  text-[15px]">Fasilitas</h1>
              </button>
            </div>
            <div class="border-b-2 border-gray-400"></div>
            {activeSection === "syarat" && <SyaratKetentuan />}
            {activeSection === "fasilitas" && <Fasilitas />}
          </div>
        </div>
      </main>
      <WhatsAppButton phoneNumber={eventData.buttonWA.contact.whatsapp} />
      <Footer />
    </section>
  );
};

export default EventDetail;
