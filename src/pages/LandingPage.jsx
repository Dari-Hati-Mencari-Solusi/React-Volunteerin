import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/Fragments/HeroSection";
import BtnSearch from "../components/Elements/buttons/BtnSearch";
import SearchDropdown from "../components/Elements/search/SearchDropdown";
import ColaborateWith from "../components/Fragments/ColaborateWith";
import { Menu, Search } from "lucide-react";
import IconAll from "../assets/images/icon-all.svg";
import IconLing from "../assets/images/icon-lingkungan.svg";
import IconSos from "../assets/images/icon-sosial.svg";
import IconPend from "../assets/images/icon-pendidikan.svg";
import Events from "./events/Events";
import Marquee from "react-fast-marquee";

const LandingPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: null, name: "Semua Event", icon: IconAll },
    { id: "Lingkungan", name: "Lingkungan", icon: IconLing },
    { id: "Sosial", name: "Sosial", icon: IconSos },
    { id: "Pendidikan", name: "Pendidikan", icon: IconPend },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsFilterOpen(false);
  };

  const getCategoryButtonClass = (categoryId) => {
    const baseClasses =
      "p-[10px] rounded-[12px] text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 border flex items-center gap-2 px-5";
    const isSelected = selectedCategory === categoryId;

    return `${baseClasses} ${
      isSelected
        ? "bg-[#145B76] text-white font-medium"
        : "bg-[#F5F8FE] text-[#0A3E54]"
    }`;
  };

  return (
    <section className="flex flex-col">
      <Navbar />
      <HeroSection />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-4 lg:px-4 max-w-screen-xl space-y-5">
          {/* Search Bar */}
          <div className="w-full gap-4 flex px-4 md:px-4 lg:px-4">
            <label className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari Volunteer Disini...."
                className="border-[1.5px] py-3 rounded-[12px] w-full focus:border-white px-6 text-md focus:outline-none focus:ring focus:ring-[#0A3E54] pl-10"
              />
            </label>
            <BtnSearch />
          </div>

          {/* Filter Button (Mobile) */}
          <div className="md:hidden px-4 py-3">
            <button
              className="bg-[#0A3E54] text-white px-4 py-2 rounded-[12px] flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Menu size={20} />
              <span>Filter</span>
            </button>
          </div>

          {/* Filter Section */}
          <div
            className={`px-4 lg:px-4 md:px-4 py-5 ${
              isFilterOpen ? "block" : "hidden"
            } md:block`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Category Buttons */}
              <div className="flex flex-wrap gap-2 md:gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.id)}
                      className={getCategoryButtonClass(category.id)}
                    >
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-8 h-8"
                      />
                      {category.name}
                    </button>
                  );
                })}
              </div>

              {/* Dropdown Search */}
              <div className="w-full md:w-auto">
                <SearchDropdown />
              </div>
            </div>
          </div>

          {/* Category Content */}
          <div className="px-4 lg:px-4 md:px-4 space-y-5 py-4 flex-grow">
            <h1 className="text-xl md:text-2xl font-bold">Event Terdekat</h1>
            <Events selectedCategory={selectedCategory} />
          </div>

          {/* marketing content */}
          {/* <div className="px-4 md:px-8 space-y-5 py-4 flex-grow">
        <h1 className="text-xl md:text-2xl font-bold text-center">
          Masih Bingung Nyari Volunteer Terpercaya?
        </h1>
      </div> */}

          {/* Colaborate with */}
          <div className="px-4 md:px-8 space-y-5 py-4 flex-grow">
            <h1 className="text-3xl lg:text-4xl md:text-4xl font-bold text-center text-black">
              Dipercayai Oleh?
            </h1>
            <ColaborateWith />
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
};

export default LandingPage;
