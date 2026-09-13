import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  // ==========================================
  // STATES
  // ==========================================

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // YouTube video from database
  const [youtubeVideo, setYoutubeVideo] = useState(null);

  // YouTube form
  const [youtubepost, setYoutubePost] = useState({
    url: "",
    title: "",
  });

  // ==========================================
  // GET BRANDS + PRODUCTS
  // ==========================================

  const datapassed = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      // ------------------------------------------
      // GET ALL BRANDS
      // ------------------------------------------

      const response = await axios.get(
        "https://ikonix-backend.vercel.app/api/brands/getAllBrands",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ------------------------------------------
      // GET ALL PRODUCTS
      // ------------------------------------------

      const productsResponse = await axios.get(
        "https://ikonix-backend.vercel.app/api/products/getAllProducts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Brand Response:", response.data);
      console.log("Products Response:", productsResponse.data);

      // ------------------------------------------
      // SET DATA
      // ------------------------------------------

      setBrands(response.data.brands || []);

      setProducts(productsResponse.data.products || []);
    } catch (error) {
      console.log(
        "Dashboard API Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // GET YOUTUBE VIDEO
  // ==========================================

  const fetchYoutubeVideo = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        "https://ikonix-backend.vercel.app/api/Youtube/getYoutube",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("YouTube Response:", response.data);

      const video = response.data.youtube || null;

      // Save video
      setYoutubeVideo(video);

      // Put existing video data into form
      if (video) {
        setYoutubePost({
          url: video.url || "",
          title: video.title || "",
        });
      }
    } catch (error) {
      console.error(
        "Error fetching YouTube video:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // SAVE / UPDATE YOUTUBE VIDEO
  // ==========================================

  const saveYoutubeVideo = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      // Validate
      if (!youtubepost.url || !youtubepost.title) {
        alert("Please enter YouTube URL and title");
        return;
      }

      const response = await axios.post(
        "https://ikonix-backend.vercel.app/api/Youtube/createYoutube",
        youtubepost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("YouTube Saved:", response.data);

      // Update displayed video
      setYoutubeVideo(response.data.youtube);

      // Update form
      setYoutubePost({
        url: response.data.youtube?.url || youtubepost.url,
        title:
          response.data.youtube?.title || youtubepost.title,
      });

      alert(
        response.data.message ||
          "YouTube video saved successfully"
      );
    } catch (error) {
      console.error(
        "Error saving YouTube video:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to save YouTube video"
      );
    }
  };

  // ==========================================
  // YOUTUBE URL → EMBED URL
  // ==========================================

  const getYoutubeEmbedUrl = (url) => {
    if (!url) {
      return "";
    }

    // ------------------------------------------
    // Already embed URL
    // ------------------------------------------

    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // ------------------------------------------
    // youtube.com/watch?v=VIDEO_ID
    // ------------------------------------------

    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url
        .split("watch?v=")[1]
        .split("&")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // ------------------------------------------
    // youtu.be/VIDEO_ID
    // ------------------------------------------

    if (url.includes("youtu.be/")) {
      const videoId = url
        .split("youtu.be/")[1]
        .split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    return "";
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        datapassed(),
        fetchYoutubeVideo(),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  // ==========================================
  // BRAND COUNTS
  // ==========================================

  const totalBrands = brands.length;

  const activeBrands = brands.filter(
    (brand) => brand.status === "Active"
  ).length;

  const inactiveBrands = brands.filter(
    (brand) => brand.status === "Inactive"
  ).length;

  // ==========================================
  // BRAND PERCENTAGES
  // ==========================================

  const activePercentage =
    totalBrands > 0
      ? Math.round(
          (activeBrands / totalBrands) * 100
        )
      : 0;

  const inactivePercentage =
    totalBrands > 0
      ? Math.round(
          (inactiveBrands / totalBrands) * 100
        )
      : 0;

  // ==========================================
  // CATEGORY DATA
  //
  // Categories are stored inside Brand.category[]
  // ==========================================

  const categoryCounts = {};

  brands.forEach((brand) => {
    if (Array.isArray(brand.category)) {
      brand.category.forEach((category) => {
        if (category) {
          categoryCounts[category] =
            (categoryCounts[category] || 0) + 1;
        }
      });
    }
  });

  // Convert object to array
  const categoryList = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const totalCategories = categoryList.length;

  // ==========================================
  // CATEGORY PERCENTAGE
  // ==========================================

  const getCategoryPercentage = (count) => {
    if (totalBrands === 0) {
      return 0;
    }

    return Math.round(
      (count / totalBrands) * 100
    );
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="w-full min-h-screen font-Arimo p-3 flex flex-col gap-3 bg-[#F5F5F5]">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="w-full h-20 flex items-center px-5 text-2xl bg-white rounded-2xl">

        <h1>
          Dashboard
        </h1>

      </div>


      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="w-full flex flex-wrap gap-3">

        {/* TOTAL PRODUCTS */}

        <div className="w-50 h-30 rounded-2xl text-center flex flex-col justify-center bg-white">

          <p className="text-gray-500">
            Total Products
          </p>

          <span className="text-2xl font-bold">
            {loading
              ? "..."
              : products.length}
          </span>

        </div>


        {/* TOTAL BRANDS */}

        <div className="w-50 h-30 rounded-2xl text-center flex flex-col justify-center bg-white">

          <p className="text-gray-500">
            Total Brands
          </p>

          <span className="text-2xl font-bold">
            {loading
              ? "..."
              : totalBrands}
          </span>

        </div>


        {/* TOTAL CATEGORIES */}

        <div className="w-50 h-30 rounded-2xl text-center flex flex-col justify-center bg-white">

          <p className="text-gray-500">
            Total Categories
          </p>

          <span className="text-2xl font-bold">
            {loading
              ? "..."
              : totalCategories}
          </span>

        </div>

      </div>


      {/* ========================================
          DASHBOARD CONTENT
      ======================================== */}

      <div className="w-full flex flex-wrap gap-3">


        {/* ========================================
            BRAND OVERVIEW
        ======================================== */}

        <div className="w-[400px] min-h-[300px] bg-white rounded-2xl p-5 shadow-sm">

          <h2 className="text-sm font-semibold text-gray-800 mb-5">
            Brand Overview
          </h2>


          <div className="flex items-center gap-6">


            {/* DONUT CHART */}

            <div className="relative w-40 h-40 flex-shrink-0">

              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    totalBrands === 0
                      ? "#e5e7eb"
                      : `conic-gradient(
                          #22c55e 0% ${activePercentage}%,
                          #ef4444 ${activePercentage}% 100%
                        )`,
                }}
              >

                {/* INNER CIRCLE */}

                <div className="absolute inset-[25px] bg-white rounded-full flex flex-col items-center justify-center">

                  <span className="text-xl font-bold text-gray-800">
                    {loading
                      ? "..."
                      : totalBrands}
                  </span>

                  <span className="text-[10px] text-gray-500">
                    Total Brands
                  </span>

                </div>

              </div>

            </div>


            {/* BRAND STATUS */}

            <div className="flex-1 space-y-5">


              {/* ACTIVE */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

                  <span className="text-xs text-gray-600">
                    Active
                  </span>

                </div>

                <span className="text-xs font-medium text-gray-700">
                  {activeBrands} ({activePercentage}%)
                </span>

              </div>


              {/* INACTIVE */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>

                  <span className="text-xs text-gray-600">
                    Inactive
                  </span>

                </div>

                <span className="text-xs font-medium text-gray-700">
                  {inactiveBrands} ({inactivePercentage}%)
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            CATEGORY OVERVIEW
        ======================================== */}

        <div className="w-[400px] min-h-[300px] bg-white rounded-2xl p-5 shadow-sm">


          {/* HEADER */}

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-sm font-semibold text-gray-800">
                Category Overview
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Categories used by brands
              </p>

            </div>


            <span className="text-xl font-bold text-gray-800">
              {loading
                ? "..."
                : totalCategories}
            </span>

          </div>


          {/* CATEGORY LIST */}

          <div className="space-y-4">

            {loading ? (

              <div className="text-center text-sm text-gray-400 py-10">
                Loading categories...
              </div>

            ) : categoryList.length === 0 ? (

              <div className="text-center text-sm text-gray-400 py-10">
                No categories found
              </div>

            ) : (

              categoryList
                .slice(0, 5)
                .map((category) => {

                  const percentage =
                    getCategoryPercentage(
                      category.count
                    );

                  return (
                    <div
                      key={category.name}
                      className="space-y-1"
                    >

                      {/* NAME + COUNT */}

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>

                          <span className="text-xs font-medium text-gray-700">
                            {category.name}
                          </span>

                        </div>


                        <span className="text-xs text-gray-500">
                          {category.count}
                        </span>

                      </div>


                      {/* PROGRESS BAR */}

                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })

            )}

          </div>


          {/* FOOTER */}

          {categoryList.length > 5 && (

            <div className="mt-5 pt-3 border-t border-gray-100">

              <p className="text-xs text-gray-400 text-center">
                Showing top 5 of{" "}
                {totalCategories} categories
              </p>

            </div>

          )}

        </div>


        {/* ========================================
            YOUTUBE VIDEO
        ======================================== */}

        <div className="w-[400px] min-h-[300px] bg-white p-4 rounded-2xl shadow-sm">


          {/* TITLE */}

          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Company Video
          </h2>


          <div className="flex flex-col gap-3 w-full">


            {/* VIDEO */}

            <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">

              {youtubeVideo?.url ? (

                <iframe
                  className="w-full h-full"
                  src={getYoutubeEmbedUrl(
                    youtubeVideo.url
                  )}
                  title={
                    youtubeVideo.title ||
                    "Company Video"
                  }
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

              ) : (

                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">

                  No video added

                </div>

              )}

            </div>


            {/* URL INPUT */}

            <input
              type="text"
              placeholder="Enter YouTube URL"
              value={youtubepost.url}
              onChange={(e) =>
                setYoutubePost({
                  ...youtubepost,
                  url: e.target.value,
                })
              }
              className="w-full bg-gray-100 text-gray-800 placeholder:text-gray-500 border border-gray-300 rounded-xl p-2 outline-none"
            />


            {/* TITLE INPUT */}

            <input
              type="text"
              placeholder="Enter video title"
              value={youtubepost.title}
              onChange={(e) =>
                setYoutubePost({
                  ...youtubepost,
                  title: e.target.value,
                })
              }
              className="w-full bg-gray-100 text-gray-800 placeholder:text-gray-500 border border-gray-300 rounded-xl p-2 outline-none"
            />


            {/* SAVE BUTTON */}

            <button
              onClick={saveYoutubeVideo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
            >
              Save Video
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;