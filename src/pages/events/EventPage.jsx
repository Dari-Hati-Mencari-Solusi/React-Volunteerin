import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import BannerEvent from "../../assets/images/banner1.jpg";
import { Icon } from "@iconify/react";
import BtnDaftarVolunteer from "../../components/Elements/buttons/BtnDaftarVolunteer";
import Marketing from "../../components/Fragments/Marketing";

const EventPage = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Existing benefits and criteria arrays remain unchanged
  const benefits = [
    {
      id: 1,
      title: "Uang Saku",
      icon: "tabler:wallet",
    },
    {
      id: 2,
      title: "Sertifikat",
      icon: "tabler:certificate",
    },
    {
      id: 3,
      title: "Snack",
      icon: "fluent-mdl2:eat-drink",
    },
    {
      id: 4,
      title: "Koneksi",
      icon: "ic:round-connect-without-contact",
    },
  ];

  // Existing eventDetails object remains unchanged
  const eventDetails = {
    title: "Aksi Peduli Bencana",
    date: "Sabtu, 20 Okt - Minggu, 21 Okt 2026 • 07:30 - 11:50 WIB",
    category: "Sosial",
    location: "Pantai Cangkring, Poncosari, Srandakan, Bantul, Yogyakarta",
    organizer: {
      name: "Peduli Lingkungan",
      logo: BannerEvent,
      instagram: "Aksipeduli",
    },
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Habitant cras morbi hendrerit nunc vel sapien. In habitasse at diam suspendisse non vitae fermentum, pharetra arcu. Viverra a morbi ut donec in. Ac diam, at sed eras nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Habitant cras morbi hendrerit nunc vel sapien. In habitasse at diam suspendisse non vitae fermentum, pharetra arcu. Viverra a morbi ut donec in. Ac diam, at sed eras nisi.",
    quota: "30 / 50 Kuota",
  };

  const activities = [
    {
      id: 1,
      description:
        "Membantu dalam perencanaan kegiatan, seperti menyusun daftar peralatan yang dibutuhkan (sarung tangan, kantong sampah, penjepit sampah, dll).",
    },
    {
      id: 2,
      description:
        "Mengikuti briefing awal mengenai prosedur pembersihan dan pembagian tugas di area pantai yang akan dibersihkan.",
    },
    {
      id: 3,
      description:
        "Mengumpulkan sampah dengan hati-hati dan memilahnya berdasarkan jenisnya, seperti plastik, kaca, dan logam, untuk didaur ulang jika memungkinkan.",
    },
    {
      id: 4,
      description:
        "Menjaga keselamatan dengan menggunakan perlengkapan yang sesuai dan memperhatikan lingkungan sekitar, terutama benda tajam atau berbahaya.",
    },
  ];

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex flex-col lg:flex-row gap-4 py-6 lg:py-10">
          {/* Main Content Column */}
          <div className="w-full lg:w-8/12 space-y-4">
            <div className="mb-6 lg:mb-0">
              <img
                src={BannerEvent}
                alt="Banner detail volunteer"
                className="w-full h-48 sm:h-60 object-cover rounded-t-[12px]"
              />
              <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-4 sm:p-6 rounded-b-xl">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-medium">
                    {eventDetails.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center font-medium bg-[#22D0EE] text-[#0A3E54] px-3 py-[6px] rounded-full">
                      <Icon icon="mdi:users" className="w-4 h-4 mr-1" />
                      <span className="text-sm sm:text-md">
                        {eventDetails.quota}
                      </span>
                    </div>
                    <button>
                      <Icon
                        icon="meteor-icons:share"
                        className="w-6 h-6 text-[#0A3E54]"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-500 text-sm sm:text-[18px]">
                    {eventDetails.date}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="font-medium bg-[#22D0EE] text-[#0A3E54] px-4 sm:px-7 py-[6px] rounded-full text-sm sm:text-md">
                    {eventDetails.category}
                  </span>
                </div>

                <div className="flex items-start sm:items-center gap-2 mb-6 text-[#343E46]">
                  <Icon
                    icon="weui:location-filled"
                    className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0"
                  />
                  <span className="text-[#0A3E54] text-base sm:text-xl">
                    {eventDetails.location}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-4">
                      <img
                        src={eventDetails.organizer.logo}
                        alt="Organizer"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="text-sm text-gray-500">
                          Penyelenggara event:
                        </p>
                        <p className="font-medium text-lg sm:text-xl">
                          {eventDetails.organizer.name}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center justify-center bg-[#22D0EE] px-4 py-2 rounded-full text-[#0A3E54] sm:hidden">
                      <Icon icon="ph:instagram-logo-bold" className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="hidden md:block md:ml-auto">
                    <button className="flex items-center gap-1 bg-[#22D0EE] px-4 py-2 rounded-full text-[#0A3E54]">
                      <Icon icon="ph:instagram-logo-bold" className="w-5 h-5" />
                      <span className="text-[#0A3E54] font-medium">
                        {eventDetails.organizer.instagram}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">
                    Tentang Event Volunteer
                  </h2>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    {showFullDescription
                      ? eventDetails.description
                      : `${eventDetails.description.substring(0, 250)}...`}
                  </p>
                  <button
                    onClick={toggleDescription}
                    className="text-[#0A3E54] font-medium text-sm sm:text-base"
                  >
                    {showFullDescription ? "Tutup" : "Selengkapnya"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#FBFBFB] border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="gg:notes"
                  width="28"
                  height="28"
                  className="text-[#0A3E54]"
                />
                <h2 className="text-xl font-medium text-[#0A3E54]">
                  Deskripsi Kegiatan
                </h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <span className="text-[#0A3E54] font-medium">
                      {activity.id}.
                    </span>
                    <p className="text-gray-700">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="w-full lg:w-4/12">
            <div className="space-y-4">
              {/* Benefits Section */}
              <div>
                <div className="bg-[#0A3E54] text-white py-2 sm:py-3 rounded-t-xl">
                  <h1 className="text-lg sm:text-xl font-medium px-4 sm:px-6">
                    Manfaat Event
                  </h1>
                </div>
                <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 p-4 sm:p-6 rounded-b-xl">
                  <div className="grid grid-cols-2 gap-2">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="bg-white p-2 rounded-xl shadow-sm flex text-center items-center gap-2 cursor-default"
                      >
                        <Icon
                          icon={benefit.icon}
                          className="w-[15px] h-[15px] text-[#0A3E54]"
                        />
                        <div className="flex flex-col">
                          <span className="text-[#0A3E54] font-normal text-sm">
                            {benefit.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criteria Section */}
              <div>
                <div className="bg-[#0A3E54] text-white py-2 sm:py-3 rounded-t-xl">
                  <h1 className="text-lg sm:text-xl font-medium px-4 sm:px-6">
                    Kriteria
                  </h1>
                </div>
                <div className="bg-[#FBFBFB] border-b border-l border-r border-gray-200 rounded-b-lg shadow-sm p-6">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <span className="text-[#0A3E54] font-medium">
                          {activity.id}.
                        </span>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <BtnDaftarVolunteer />
            </div>
          </div>
        </div>
       <Marketing />
      </section>
      <Footer />
    </section>
  );
};

export default EventPage;
