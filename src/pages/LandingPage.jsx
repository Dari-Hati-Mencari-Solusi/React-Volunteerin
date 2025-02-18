import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/Fragments/HeroSection";
import SearchDropdown from "../components/Elements/search/SearchDropdown";
import Events from "./events/Events";
import BtnSaveEvent from "../components/Elements/buttons/BtnSaveEvent";
import BtnHistory from "../components/Elements/buttons/BtnHistory";
import { Icon } from "@iconify/react";
import IconMarket from "../assets/images/icon.png";
import Marketing from "../components/Fragments/Marketing";

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [moreEventsLimit, setMoreEventsLimit] = useState(8);
  const [freeEventsLimit, setFreeEventsLimit] = useState(4);

  const categories = [
    { id: null, name: "Semua Event" },
    { id: "Lingkungan", name: "Lingkungan" },
    { id: "Sosial", name: "Sosial" },
    { id: "Pendidikan", name: "Pendidikan" },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const getCategoryButtonClass = (categoryId) => {
    const baseClasses =
      "p-[10px] rounded-[12px] text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 border flex items-center gap-2 px-5 relative group";
    const isSelected = selectedCategory === categoryId;

    return `${baseClasses} ${
      isSelected
        ? "bg-gradient-to-br from-[#16A1CB] to-[#094863] text-white font-medium border-[1.5px] border-gradient-to-br from-[#16A1CB] to-[#094863]"
        : "bg-[#fff] text-[#0A3E54] border-[1.5px] border-[#0A3E54]"
    }`;
  };

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />

      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full gap-2 flex flex-wrap mt-6">
          <label className="relative w-full md:w-auto flex-grow">
            <input
              type="text"
              placeholder="Cari Volunteer Disini...."
              className="border-[2px] border-[#0A3E54] py-3 rounded-[12px] w-full px-6 text-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B] pr-12"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-5 flex items-center m-2 justify-center w-[3.5rem] bg-[#0A3E54] text-white rounded-full transition-colors duration-300"
            >
              <Icon icon="flowbite:search-outline" width="24" height="24" />
            </button>
          </label>
          <BtnSaveEvent className="w-full md:w-auto" />
          <BtnHistory className="w-full md:w-auto" />
        </div>

        <div className="mt-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex overflow-x-auto gap-2 md:gap-4 pb-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.id)}
                  className={getCategoryButtonClass(category.id)}
                >
                  {category.name}
                  <span
                    className={`absolute left-5 bottom-2 h-[2px] bg-white transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "w-[40px] opacity-100"
                        : "w-0 opacity-0"
                    }`}
                  ></span>
                </button>
              ))}
            </div>

            <div className="w-full md:w-auto">
              <SearchDropdown />
            </div>
          </div>
        </div>

        <div className="space-y-10 py-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Event Populer</h1>
            <div className="py-8">
              <Events selectedCategory={selectedCategory} limit={4} />
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Lebih Banyak Event
            </h1>
            <div className="py-8">
              <Events
                selectedCategory={selectedCategory}
                limit={moreEventsLimit}
              />
              <div className="flex justify-center mt-8">
                {moreEventsLimit === 8 ? (
                  <button
                    onClick={() => setMoreEventsLimit(Infinity)}
                    className="bg-[#0A3E54] text-white px-4 py-2 rounded-[12px] hover:bg-[#094863] transition-colors duration-300"
                  >
                    Lebih Banyak Event
                  </button>
                ) : (
                  <button
                    onClick={() => setMoreEventsLimit(8)}
                    className="bg-[#0A3E54] text-white px-4 py-2 rounded-[12px] hover:bg-[#094863] transition-colors duration-300"
                  >
                    Lebih Sedikit Event
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold">Event Gratis</h1>
            <div className="py-8">
              <Events
                selectedCategory={selectedCategory}
                limit={freeEventsLimit}
              />
              <div className="flex justify-center mt-8">
                {freeEventsLimit === 4 ? (
                  <button
                    onClick={() => setFreeEventsLimit(Infinity)}
                    className="bg-[#0A3E54] text-white px-4 py-2 rounded-[12px] hover:bg-[#094863] transition-colors duration-300"
                  >
                    Lebih Banyak Event
                  </button>
                ) : (
                  <button
                    onClick={() => setFreeEventsLimit(4)}
                    className="bg-[#0A3E54] text-white px-4 py-2 rounded-[12px] hover:bg-[#094863] transition-colors duration-300"
                  >
                    Lebih Sedikit Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Marketing />
      </div>

      <Footer />
    </section>
  );
};

export default LandingPage;
