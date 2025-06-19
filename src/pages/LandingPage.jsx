import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const MAIN_CATEGORIES = ["Lingkungan", "Sosial", "Pendidikan"];
const MAX_EVENT_COUNT = 20;
const INITIAL_MORE_EVENTS_LIMIT = 8;
const INITIAL_FREE_EVENTS_LIMIT = 4;
const EVENTS_PER_ROW = 4;
const LOADING_DELAY = 200;
const FILTER_RESET_DELAY = 300;
const STORAGE_KEY_CATEGORY = "volunteerin_selected_category";
const DEFAULT_CATEGORIES = [
  { id: null, name: "Semua Event" },
  { id: "category-lingkungan", name: "Lingkungan" },
  { id: "category-sosial", name: "Sosial" },
  { id: "category-pendidikan", name: "Pendidikan" },
];

const SearchBarSkeleton = () => (
  <div className="w-full md:w-auto flex-grow">
    <div className="h-12 bg-gray-200 animate-pulse rounded-[12px]"></div>
  </div>
);

const ButtonSkeleton = () => (
  <div className="w-32 h-12 bg-gray-200 animate-pulse rounded-[12px]"></div>
);

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk cache kategori - menghindari loading ulang saat berpindah halaman
  const [categoriesCache, setCategoriesCache] = useState(() => {
    // Coba ambil dari sessionStorage untuk menghindari flash loading saat navigasi
    const cachedCategories = sessionStorage.getItem("categoriesCache");
    return cachedCategories ? JSON.parse(cachedCategories) : DEFAULT_CATEGORIES;
  });

  // State management dengan loading states untuk semua komponen
  const [categoryState, setCategoryState] = useState({
    selectedCategory: null,
    selectedCategoryName: "Semua Event",
    categories: categoriesCache,
    isLoading: false,
    filterApplied: false,
  });

  const [eventLimits, setEventLimits] = useState({
    moreEventsLimit: INITIAL_MORE_EVENTS_LIMIT,
    freeEventsLimit: INITIAL_FREE_EVENTS_LIMIT,
    loadingMore: false,
    loadingMoreFree: false,
  });

  const [uiLoading, setUiLoading] = useState({
    searchBar: true,
    popularEvents: true,
    moreEvents: true,
    freeEvents: true,
    marketingSection: true,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedCategory,
    selectedCategoryName,
    categories,
    isLoading,
    filterApplied,
  } = categoryState;
  const { moreEventsLimit, freeEventsLimit, loadingMore, loadingMoreFree } =
    eventLimits;

  // Load saved category filter from URL or localStorage on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");
    const categoryName = params.get("name");

    // Jika tidak ada di URL, cek di localStorage
    const savedCategory = !categoryId
      ? JSON.parse(localStorage.getItem(STORAGE_KEY_CATEGORY))
      : { id: categoryId, name: categoryName || "Kategori" };

    if (savedCategory && savedCategory.id) {
      setCategoryState((prev) => ({
        ...prev,
        selectedCategory: savedCategory.id,
        selectedCategoryName: savedCategory.name || "Kategori",
      }));
    }
  }, []);

  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem("uiLoaded");

    if (isFirstVisit) {
      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, searchBar: false }));
      }, 600);

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, popularEvents: false }));
      }, 700);

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, moreEvents: false }));
      }, 800);

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, freeEvents: false }));
      }, 900);

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, marketingSection: false }));
        sessionStorage.setItem("uiLoaded", "true");
      }, 1000);
    } else {
      setUiLoading({
        searchBar: false,
        popularEvents: false,
        moreEvents: false,
        freeEvents: false,
        marketingSection: false,
      });
    }
  }, []);

  // Helper untuk mengurutkan kategori
  const sortCategories = useCallback((categories) => {
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
  }, []);

  // Fetch categories dari API - hanya sekali, tidak perlu re-fetch saat kategori berubah
  useEffect(() => {
    const getCategories = async () => {
      // Jika sudah ada kategori di cache, tidak perlu loading
      if (categoriesCache.length > DEFAULT_CATEGORIES.length) {
        setCategoryState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setCategoryState((prev) => ({ ...prev, isLoading: true }));

        const response = await fetchCategories();

        if (response?.data) {
          const formattedCategories = [
            { id: null, name: "Semua Event" },
            ...response.data.map((category) => ({
              id: category.id,
              name: category.name,
            })),
          ];

          // Urutkan kategori: "Semua Event" pertama, diikuti kategori utama, lalu kategori lainnya
          const sortedCategories = sortCategories(formattedCategories);

          // Simpan di cache
          setCategoriesCache(sortedCategories);
          sessionStorage.setItem(
            "categoriesCache",
            JSON.stringify(sortedCategories)
          );

          setCategoryState((prev) => ({
            ...prev,
            categories: sortedCategories,
            isLoading: false,
          }));

          // Jika kategori tersimpan ditemukan di kategori yang baru di-fetch
          const params = new URLSearchParams(location.search);
          const categoryId = params.get("category");

          if (categoryId) {
            const matchedCategory = sortedCategories.find(
              (cat) => cat.id === categoryId
            );
            if (matchedCategory) {
              setCategoryState((prev) => ({
                ...prev,
                selectedCategory: matchedCategory.id,
                selectedCategoryName: matchedCategory.name,
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoryState((prev) => ({
          ...prev,
          categories: DEFAULT_CATEGORIES,
          isLoading: false,
        }));
      }
    };

    getCategories();
  }, [sortCategories, categoriesCache.length]);

  // Event handlers
  const handleCategoryClick = (categoryId, categoryName) => {
    setUiLoading((prev) => ({
      ...prev,
      popularEvents: true,
      moreEvents: true,
      freeEvents: true,
    }));

    // Aktifkan filter
    setCategoryState((prev) => ({
      ...prev,
      selectedCategory: categoryId,
      selectedCategoryName: categoryName || "Semua Event",
      filterApplied: true,
    }));

    // Simpan ke localStorage
    if (categoryId) {
      localStorage.setItem(
        STORAGE_KEY_CATEGORY,
        JSON.stringify({
          id: categoryId,
          name: categoryName,
        })
      );

      // Update URL
      navigate(
        `?category=${categoryId}&name=${encodeURIComponent(categoryName)}`,
        { replace: true }
      );
    } else {
      localStorage.removeItem(STORAGE_KEY_CATEGORY);
      navigate("/", { replace: true });
    }

    setTimeout(() => {
      setCategoryState((prev) => ({ ...prev, filterApplied: false }));

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, popularEvents: false }));
      }, 300);

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, moreEvents: false }));
      }, 450);

      setTimeout(() => {
        setUiLoading((prev) => ({ ...prev, freeEvents: false }));
      }, 600);
    }, FILTER_RESET_DELAY);

    setEventLimits((prev) => ({
      ...prev,
      moreEventsLimit: INITIAL_MORE_EVENTS_LIMIT,
      freeEventsLimit: INITIAL_FREE_EVENTS_LIMIT,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearFilter = () => {
    setUiLoading((prev) => ({
      ...prev,
      popularEvents: true,
      moreEvents: true,
      freeEvents: true,
    }));

    setCategoryState((prev) => ({
      ...prev,
      selectedCategory: null,
      selectedCategoryName: "Semua Event",
    }));

    localStorage.removeItem(STORAGE_KEY_CATEGORY);
    navigate("/", { replace: true });

    setTimeout(() => {
      setUiLoading((prev) => ({ ...prev, popularEvents: false }));
    }, 300);

    setTimeout(() => {
      setUiLoading((prev) => ({ ...prev, moreEvents: false }));
    }, 450);

    setTimeout(() => {
      setUiLoading((prev) => ({ ...prev, freeEvents: false }));
    }, 600);
  };

  const handleShowMoreEvents = () => {
    setEventLimits((prev) => ({ ...prev, loadingMore: true }));

    setTimeout(() => {
      setEventLimits((prev) => ({
        ...prev,
        moreEventsLimit: Math.min(
          prev.moreEventsLimit + EVENTS_PER_ROW,
          MAX_EVENT_COUNT
        ),
        loadingMore: false,
      }));
    }, LOADING_DELAY);
  };

  const handleShowLessEvents = () => {
    setUiLoading((prev) => ({ ...prev, moreEvents: true }));

    setEventLimits((prev) => ({
      ...prev,
      moreEventsLimit: INITIAL_MORE_EVENTS_LIMIT,
    }));

    setTimeout(() => {
      setUiLoading((prev) => ({ ...prev, moreEvents: false }));
    }, 400);
  };

  const handleShowMoreFreeEvents = () => {
    setEventLimits((prev) => ({ ...prev, loadingMoreFree: true }));

    setTimeout(() => {
      setEventLimits((prev) => ({
        ...prev,
        freeEventsLimit: Math.min(
          prev.freeEventsLimit + EVENTS_PER_ROW,
          MAX_EVENT_COUNT
        ),
        loadingMoreFree: false,
      }));
    }, LOADING_DELAY);
  };

  const handleShowLessFreeEvents = () => {
    // Animate collapse by showing loading state briefly
    setUiLoading((prev) => ({ ...prev, freeEvents: true }));

    setEventLimits((prev) => ({
      ...prev,
      freeEventsLimit: INITIAL_FREE_EVENTS_LIMIT,
    }));

    setTimeout(() => {
      setUiLoading((prev) => ({ ...prev, freeEvents: false }));
    }, 400);
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

  const mainCategoriesToShow = categories.filter(
    (cat) => cat.name === "Semua Event" || MAIN_CATEGORIES.includes(cat.name)
  );

  // UI Components
  // Komponen skeleton untuk kategori
  const CategoryButtonSkeleton = () => (
    <div className="p-[10px] rounded-[12px] w-32 h-10 bg-gray-200 animate-pulse"></div>
  );

  const renderCategoryButtons = () => {
    if (isLoading) {
      return Array(4)
        .fill()
        .map((_, index) => <CategoryButtonSkeleton key={index} />);
    }

    // Setelah kategori dimuat, tampilkan tombol kategori
    return mainCategoriesToShow.map((category) => (
      <button
        key={category.id || "all"}
        onClick={() => {
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
          Menampilkan event untuk kategori
          <span className="font-bold">{selectedCategoryName}</span>
        </p>
      </div>
    );
  };

  const renderActiveFilterIndicator = () => {
    if (!selectedCategory) return null;

    return (
      <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mt-4 mb-2 flex items-center justify-between">
        <span className="font-medium">
          <span className="font-bold">Filter Aktif:</span> Kategori
          {selectedCategoryName}
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
    <div
      className={`absolute inset-0 bg-white/80 flex items-center justify-center z-10 transition-opacity duration-300 ${
        filterApplied ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
    </div>
  );

  const renderShowMoreButton = (
    limit,
    maxLimit,
    onShowMore,
    onShowLess,
    isLoading,
    label
  ) => {
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
              <Icon
                icon="material-symbols:expand-more"
                width="20"
                height="20"
              />
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
        <div className="w-full gap-2 flex flex-wrap mt-6">
          {uiLoading.searchBar ? (
            <>
              <SearchBarSkeleton />
              <ButtonSkeleton />
              <ButtonSkeleton />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="md:mt-4 lg:mt-4 mt-2">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="w-full lg:w-auto flex flex-col md:flex-row gap-4">
              <div className="flex overflow-x-auto pb-2 gap-2 md:gap-4">
                {renderCategoryButtons()}
              </div>
              <div className="w-full md:w-auto">
                <SearchDropdownCategory
                  categories={categories.map((cat) => cat.name)}
                  isLoading={isLoading}
                  onCategorySelect={(categoryName) => {
                    const category = categories.find(
                      (cat) =>
                        cat.name.toLowerCase() === categoryName.toLowerCase()
                    );

                    if (category) {
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

        {renderFilterNotification()}
        {renderActiveFilterIndicator()}

        <div className="space-y-10 py-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Event Populer {selectedCategory && `- ${selectedCategoryName}`}
            </h1>
            <div className="py-8 relative">
              {renderLoadingOverlay()}

              <Events
                key={`popular-${selectedCategory || "all"}`}
                selectedCategory={selectedCategory}
                limit={4}
                isLoading={uiLoading.popularEvents}
              />
            </div>
          </div>

          {/* More Events */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Lebih Banyak Event{" "}
              {selectedCategory && `- ${selectedCategoryName}`}
            </h1>
            <div className="py-8 relative">
              {renderLoadingOverlay()}

              <Events
                key={`more-${selectedCategory || "all"}-${moreEventsLimit}`}
                selectedCategory={selectedCategory}
                limit={moreEventsLimit}
                isLoading={uiLoading.moreEvents}
              />
              <div className="flex justify-center mt-8">
                {!uiLoading.moreEvents &&
                  renderShowMoreButton(
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
                key={`free-${selectedCategory || "all"}-${freeEventsLimit}`}
                selectedCategory={selectedCategory}
                limit={freeEventsLimit}
                isLoading={uiLoading.freeEvents}
              />
              <div className="flex justify-center mt-8">
                {!uiLoading.freeEvents &&
                  renderShowMoreButton(
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

        {/* Marketing Section */}
        {uiLoading.marketingSection ? (
          <div className="w-full h-60 bg-gray-200 animate-pulse rounded-lg my-8"></div>
        ) : (
          <Marketing />
        )}
      </div>

      <Footer />
    </section>
  );
};

export default LandingPage;
