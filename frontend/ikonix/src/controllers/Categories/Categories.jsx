import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, ArrowRight, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://ikonix-backend.vercel.app/api";
const sections = [
  "Featured Categories",
  "Main Categories",
  "New Arrivals",
  "Popular Categories",
];
import { IoLogoWhatsapp } from "react-icons/io";
function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("All");
  const [Brand, setBrand] = useState([]);
  const navigate = useNavigate();
  const process = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brands/getAllBrands`);
      setBrand(response.data?.brands || []);
    } catch (err) {
      console.error("Fetch brands error:", err.response?.data || err.message);
    }
  };
  useEffect(() => {
    process();
  }, []);
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
        category.brandName?.toLowerCase().includes(search.toLowerCase());

      const matchesSection =
        activeSection === "All" || category.section === activeSection;

      return matchesSearch && matchesSection;
    });
  }, [categories, search, activeSection]);

  // Group categories by section
  const groupedCategories = useMemo(() => {
    return sections
      .map((section) => ({
        section,
        items: filteredCategories.filter(
          (category) => category.section === section,
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredCategories]);

  const handleCategoryClick = (category) => {
    console.log("Selected category:", category);
    navigate(`/category-products/${category._id}`);
    // Connect your product listing page here.
  };

  return (
    <main className="min-h-screen bg-white mt-15">
      <a
        href="https://wa.me/918111856618"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IoLogoWhatsapp className="sm:text-6xl text-5xl animate-bounce text-green-600 fixed bottom-10 right-10" />
      </a>
      {/* Hero Section */}
      <section className="bg-orange-50 px-4 pt-16 sm:mt-20">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-orange-600">
            Explore IKONIX
          </span>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-5xl">
            Explore Our Categories
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Discover precision instruments and measurement solutions for every
            application.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-500">
            <Search size={20} className="shrink-0 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories or brands..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* animation loop for the brand section */}
        <div className="w-full items-center justify-center h-15 py-2 flex box-content">
          <div className="w-full h-20 py-2 overflow-hidden">
            <div className="flex w-max animate-brand-scroll hover:[animation-play-state:paused]">
              {/* First set */}
              <div className="flex shrink-0">
                {Brand.map((brand) => (
                  <div
                    key={brand._id}
                    className="w-[200px] h-16 shadow-sm mx-2 rounded-lg flex items-center justify-center"
                  >
                    <img
                      src={brand.Image}
                      alt={brand.brandName}
                      className="max-h-[90%] max-w-[90%] object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* dublication of the first set to make the loop smooth */}

              <div className="flex shrink-0">
                {Brand.map((brand) => (
                  <div
                    key={brand._id}
                    className="w-[200px] h-16 shadow-sm mx-2 rounded-lg flex items-center justify-center"
                  >
                    <img
                      src={brand.Image}
                      alt={brand.brandName}
                      className="max-h-[90%] max-w-[90%] object-contain"
                    />
                  </div>
                ))}
              </div>
              <div className="flex shrink-0">
                {Brand.map((brand) => (
                  <div
                    key={brand._id}
                    className="w-[200px] h-16 shadow-sm mx-2 rounded-lg flex items-center justify-center"
                  >
                    <img
                      src={brand.Image}
                      alt={brand.brandName}
                      className="max-h-[90%] max-w-[90%] object-contain"
                    />
                  </div>
                ))}
              </div>
              <div className="flex shrink-0">
                {Brand.map((brand) => (
                  <div
                    key={brand._id}
                    className="w-[200px] h-16 shadow-sm mx-2 rounded-lg flex items-center justify-center"
                  >
                    <img
                      src={brand.Image}
                      alt={brand.brandName}
                      className="max-h-[90%] max-w-[90%] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Filters */}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
          {["All", ...sections].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeSection === section
                  ? "bg-orange-500 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {section === "All" ? "All Categories" : section}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

            <p className="mt-4 text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-24 text-center">
            <Layers size={45} className="mx-auto text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or select a different section.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {groupedCategories.map((group) => (
              <div key={group.section}>
                {/* Section Heading */}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    IKONIX COLLECTION
                  </span>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {group.section}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Browse our {group.section.toLowerCase()}.
                  </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                  {group.items.map((category) => (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className="group overflow-hidden rounded-xl border border-gray-100 bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-50">
                        {category.categoryImage ? (
                          <img
                            src={category.categoryImage}
                            alt={category.categoryName}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Layers size={40} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 transition group-hover:text-orange-600 sm:text-base">
                          {category.categoryName}
                        </h3>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {category.brandName}
                        </p>

                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
                          Explore
                          <ArrowRight
                            size={14}
                            className="transition group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Banner */}
      <section className="bg-gray-900 px-4 py-14 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Find the Right Instrument for Your Needs
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-300">
            Explore our range of measurement and calibration instruments for
            reliable results.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Categories;
