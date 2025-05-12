import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/Fragments/HeroSection";
import SearchDropdown from "../components/Elements/search/SearchDropdownLocation";
import Events from "./events/Events";
import BtnSaveEvent from "../components/Elements/buttons/BtnSaveEvent";
import BtnHistory from "../components/Elements/buttons/BtnHistory";
import { Icon } from "@iconify/react";
import Marketing from "../components/Fragments/Marketing";
import SearchDropdownCategory from "../components/Elements/search/SearchDropdownCategory";
import { fetchCategories } from "../services/eventService";

// Konstanta
const MAIN_CATEGORIES = ["Lingkungan", "Sosial", "Pendidikan"];
const MAX_EVENT_COUNT = 20;
const INITIAL_MORE_EVENTS_LIMIT = 8;
const INITIAL_FREE_EVENTS_LIMIT = 4;
const EVENTS_PER_ROW = 4;
const LOADING_DELAY = 500;
const FILTER_RESET_DELAY = 2000;

const LandingPage = () => {
  // State management dengan grouping yang lebih logical
  const [categoryState, setCategoryState] = useState({
    selectedCategory: null,
    selectedCategoryName: "Semua Event",
    categories: [{ id: null, name: "Semua Event" }],
    isLoading: true,
    filterApplied: false
  });

  const [eventLimits, setEventLimits] = useState({
    moreEventsLimit: INITIAL_MORE_EVENTS_LIMIT,
    freeEventsLimit: INITIAL_FREE_EVENTS_LIMIT,
    loadingMore: false,
    loadingMoreFree: false
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Destructure untuk kemudahan penggunaan
  const { selectedCategory, selectedCategoryName, categories, isLoading, filterApplied } = categoryState;
  const { moreEventsLimit, freeEventsLimit, loadingMore, loadingMoreFree } = eventLimits;

  // Fetch categories dari API
  useEffect(() => {
    const getCategories = async () => {
      try {
        setCategoryState(prev => ({ ...prev, isLoading: true }));
        
        const response = await fetchCategories();
        
        if (response?.data) {
          const formattedCategories = [
            { id: null, name: "Semua Event" },
            ...response.data.map(category => ({
              id: category.id,
              name: category.name
            }))
          ];
          
          // Urutkan kategori: "Semua Event" pertama, diikuti kategori utama, lalu kategori lainnya
          const sortedCategories = sortCategories(formattedCategories);
          
          setCategoryState(prev => ({ ...prev, categories: sortedCategories }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback ke kategori default
        setCategoryState(prev => ({
          ...prev,
          categories: [
            { id: null, name: "Semua Event" },
            { id: "category-lingkungan", name: "Lingkungan" },
            { id: "category-sosial", name: "Sosial" },
            { id: "category-pendidikan", name: "Pendidikan" },
          ]
        }));
      } finally {
        setCategoryState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    getCategories();
  }, []);

  // Helper untuk mengurutkan kategori
  const sortCategories = (categories) => {
    const mainCats = [];
    const otherCats = [];
    
    for (const cat of categories) {
      if (cat.name === "Semua Event") {
        mainCats.push(cat);
      } else if (MAIN_CATEGORIES.includes(cat.name)) {
        mainCats.push(cat);
      } else {
        otherCats.push(cat);
      }
    }
    
    return [...mainCats, ...otherCats];
  };

  // Event handlers
  const handleCategoryClick = (categoryId, categoryName) => {
    // Aktifkan filter
    setCategoryState(prev => ({ 
      ...prev, 
      selectedCategory: categoryId,
      selectedCategoryName: categoryName || "Semua Event",
      filterApplied: true 
    }));

    // Reset filter indicator setelah delay
    setTimeout(() => {
      setCategoryState(prev => ({ ...prev, filterApplied: false }));
    }, FILTER_RESET_DELAY);
    
    // Reset event limits
    setEventLimits(prev => ({
      ...prev,
      moreEventsLimit: INITIAL_MORE_EVENTS_LIMIT,
      freeEventsLimit: INITIAL_FREE_EVENTS_LIMIT
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearFilter = () => {
    setCategoryState(prev => ({
      ...prev,
      selectedCategory: null,
      selectedCategoryName: "Semua Event"
    }));
    console.log("Filter kategori dihapus");
  };
  
  const handleShowMoreEvents = () => {
    setEventLimits(prev => ({ ...prev, loadingMore: true }));
    console.log("Loading more events (+4)...");
    
    // Tambahkan delay untuk UX yang lebih baik
    setTimeout(() => {
      setEventLimits(prev => ({
        ...prev,
        moreEventsLimit: Math.min(prev.moreEventsLimit + EVENTS_PER_ROW, MAX_EVENT_COUNT),
        loadingMore: false
      }));
    }, LOADING_DELAY);
  };

  const handleShowLessEvents = () => {
    setEventLimits(prev => ({
      ...prev,
      moreEventsLimit: INITIAL_MORE_EVENTS_LIMIT
    }));
  };

  const handleShowMoreFreeEvents = () => {
    setEventLimits(prev => ({ ...prev, loadingMoreFree: true }));
    console.log("Loading more free events (+4)...");
    
    setTimeout(() => {
      setEventLimits(prev => ({
        ...prev,
        freeEventsLimit: Math.min(prev.freeEventsLimit + EVENTS_PER_ROW, MAX_EVENT_COUNT),
        loadingMoreFree: false
      }));
    }, LOADING_DELAY);
  };

  const handleShowLessFreeEvents = () => {
    setEventLimits(prev => ({
      ...prev,
      freeEventsLimit: INITIAL_FREE_EVENTS_LIMIT
    }));
  };

  // Component utility functions
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

  // Derived data
  const mainCategoriesToShow = categories.filter(cat => 
    cat.name === "Semua Event" || MAIN_CATEGORIES.includes(cat.name)
  );
  
  // UI Components
  const renderCategoryButtons = () => {
    if (isLoading) {
      return Array(4).fill().map((_, index) => (
        <div 
          key={index}
          className="p-[10px] rounded-[12px] w-32 h-10 bg-gray-200 animate-pulse"
        ></div>
      ));
    }
    
    return mainCategoriesToShow.map((category) => (
      <button
        key={category.id || "all"}
        onClick={() => {
          console.log("Selected:", category.name, "ID:", category.id);
          handleCategoryClick(category.id, category.name);
        }}
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
    ));
  };

  const renderFilterNotification = () => {
    if (!filterApplied) return null;
    
    return (
      <div className="bg-[#16A1CB]/20 text-[#0A3E54] p-3 rounded-lg mt-4 mb-2 text-center animate-fade-in-down">
        <p className="font-medium">
          Menampilkan event untuk kategori <span className="font-bold">{selectedCategoryName}</span>
        </p>
      </div>
    );
  };

  const renderActiveFilterIndicator = () => {
    if (!selectedCategory) return null;
    
    return (
      <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mt-4 mb-2 flex items-center justify-between">
        <span className="font-medium">
          <span className="font-bold">Filter Aktif:</span> Kategori {selectedCategoryName}
        </span>
        <button 
          onClick={handleClearFilter}
          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-200"
        >
          <Icon icon="mdi:close" width="20" height="20" />
        </button>
      </div>
    );
  };

  const renderLoadingOverlay = () => (
    <div className={`absolute inset-0 bg-white/80 flex items-center justify-center z-10 transition-opacity duration-300 ${
      filterApplied ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
    </div>
  );

  const renderShowMoreButton = (limit, maxLimit, onShowMore, onShowLess, isLoading, label) => {
    if (limit < maxLimit) {
      return (
        <button
          onClick={onShowMore}
          className="bg-[#0A3E54] text-white px-6 py-2 rounded-[12px] hover:bg-[#094863] transition-colors duration-300 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Memuat Event...</span>
            </>
          ) : (
            <>
              <span>{label}</span>
              <Icon icon="material-symbols:expand-more" width="20" height="20" />
            </>
          )}
        </button>
      );
    }
    
    return (
      <button
        onClick={onShowLess}
        className="bg-[#0A3E54] text-white px-6 py-2 rounded-[12px] hover:bg-[#094863] transition-colors duration-300 flex items-center gap-2"
      >
        <span>Tampilkan Lebih Sedikit</span>
        <Icon icon="material-symbols:expand-less" width="20" height="20" />
      </button>
    );
  };

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />

      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8">
        {/* Search Bar & Buttons */}
        <div className="w-full gap-2 flex flex-wrap mt-6">
          <label className="relative w-full md:w-auto flex-grow">
            <input
              type="text"
              placeholder="Cari Volunteer Disini...."
              className="border-[2px] border-[#0A3E54] py-3 rounded-[12px] w-full px-6 text-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B] pr-12"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-[1px] flex items-center m-[6px] justify-center w-[3.5rem] bg-[#0A3E54] text-white rounded-[12px] transition-colors duration-300"
            >
              <Icon icon="flowbite:search-outline" width="24" height="24" />
            </button>
          </label>
          <BtnSaveEvent className="w-full md:w-auto" />
          <BtnHistory className="w-full md:w-auto" />
        </div>

        {/* Category Filters */}
        <div className="md:mt-4 lg:mt-4 mt-2">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="w-full lg:w-auto flex flex-col md:flex-row gap-4">
              <div className="flex overflow-x-auto pb-2 gap-2 md:gap-4">
                {renderCategoryButtons()}
              </div>
              <div className="w-full md:w-auto">
                <SearchDropdownCategory 
                  categories={categories.map(cat => cat.name)} 
                  isLoading={isLoading}
                  onCategorySelect={(categoryName) => {
                    const category = categories.find(
                      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
                    );
                    
                    if (category) {
                      console.log("Dropdown selection:", category.name, "ID:", category.id);
                      handleCategoryClick(category.id, category.name);
                    } else {
                      console.warn("Category not found:", categoryName);
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <SearchDropdown />
            </div>
          </div>
        </div>

        {/* Filter Notifications */}
        {renderFilterNotification()}
        {renderActiveFilterIndicator()}

        {/* Event Sections */}
        <div className="space-y-10 py-8">
          {/* Popular Events */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Event Populer {selectedCategory && `- ${selectedCategoryName}`}
            </h1>
            <div className="py-8 relative">
              {renderLoadingOverlay()}
              
              <Events 
                key={`popular-${selectedCategory || 'all'}`}
                selectedCategory={selectedCategory} 
                limit={4} 
              />
            </div>
          </div>

          {/* More Events */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Lebih Banyak Event {selectedCategory && `- ${selectedCategoryName}`}
            </h1>
            <div className="py-8 relative">
              {renderLoadingOverlay()}
              
              <Events
                key={`more-${selectedCategory || 'all'}-${moreEventsLimit}`}
                selectedCategory={selectedCategory}
                limit={moreEventsLimit}
              />
              <div className="flex justify-center mt-8">
                {renderShowMoreButton(
                  moreEventsLimit,
                  MAX_EVENT_COUNT,
                  handleShowMoreEvents,
                  handleShowLessEvents,
                  loadingMore,
                  "Lebih Banyak Event"
                )}
              </div>
            </div>
          </div>

          {/* Free Events */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Event Gratis {selectedCategory && `- ${selectedCategoryName}`}
            </h1>
            <div className="py-8 relative">
              {renderLoadingOverlay()}
              
              <Events
                key={`free-${selectedCategory || 'all'}-${freeEventsLimit}`}
                selectedCategory={selectedCategory}
                limit={freeEventsLimit}
              />
              <div className="flex justify-center mt-8">
                {renderShowMoreButton(
                  freeEventsLimit,
                  MAX_EVENT_COUNT,
                  handleShowMoreFreeEvents,
                  handleShowLessFreeEvents,
                  loadingMoreFree,
                  "Lebih Banyak Event Gratis"
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