import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import BtnSearch from "../../components/Elements/buttons/BtnSearch";
import Lingkungan from "../../components/Categories/Lingkungan";
import Pendidikan from "../../components/Categories/Pendidikan";
import Sosial from "../../components/Categories/Sosial";
import PantiAsuhan from "../../components/Categories/PantiAsuhan";

const EventPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOpenDropdown(null);
  };

  return (
    <section>
      <Navbar />
      <div className="overflow-hidden sm:grid sm:grid-cols-2 sm:items-center py-10">
        <div className="p-8 md:p-12 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-xl text-start ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit
            </h2>

            <p className="hidden text-gray-500 md:mt-4 md:block">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
              egestas tempus tellus etiam sed. Quam a scelerisque amet
              ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
              quisque ut interdum tincidunt duis.
            </p>

            <div className="mt-4 md:mt-8">
              <a
                href="#"
                className="inline-block rounded bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring focus:ring-yellow-400"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>

        <img
          alt=""
          src="https://images.unsplash.com/photo-1484959014842-cd1d967a39cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
        />
      </div>
      <div className="w-full gap-4 flex px-8">
        <input
          type="text"
          placeholder="Cari Volunteer Disini...."
          className="border-2 py-3 rounded-[12px] w-full focus:border-white px-6 text-md focus:outline-none focus focus:ring focus:ring-[#0A3E54]"
        />
        <BtnSearch />
      </div>
      <div className="px-8 py-5">
        <div className="relative">
          <button
            onClick={() => toggleDropdown("filter")}
            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring focus:border-white focus:ring-[#0A3E54]"
          >
            <span>Kategori</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${
                openDropdown === "filter" ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {openDropdown === "filter" && (
            <div className="absolute z-10 mt-2 bg-white border-gray-300 rounded-lg shadow-lg">
              <ul className="py-2">
                <li>
                  <h1
                    onClick={() => handleCategorySelect("Lingkungan")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Lingkungan
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => handleCategorySelect("Pendidikan")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Pendidikan
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => handleCategorySelect("Sosial")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Sosial
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => handleCategorySelect("Panti Asuhan")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Panti Asuhan
                  </h1>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-6">
        {selectedCategory === "Lingkungan" && <Lingkungan />}
        {selectedCategory === "Pendidikan" && <Pendidikan />}
        {selectedCategory === "Sosial" && <Sosial />}
        {selectedCategory === "Panti Asuhan" && <PantiAsuhan />}
      </div>

      <Footer />
    </section>
  );
};

export default EventPage;
