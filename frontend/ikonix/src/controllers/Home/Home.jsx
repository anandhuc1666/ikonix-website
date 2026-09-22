import React from "react";
import {
  Truck,
  PackageCheck,
  Headphones,
  MapPin,
  Scissors,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import IndustryBrands from "./IndustryBrands.jsx";
import Footer from "../Footer/Footer.jsx";
import { IoLogoWhatsapp } from "react-icons/io";

function Home() {
  const image_homepage =
    "https://res.cloudinary.com/dkxluyjyz/image/upload/v1789222467/Untitled_design_11_u70gbw.png";
  const [youtubeVideo, setYoutubeVideo] = useState(null);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const urlObject = new URL(url);

      // youtube.com/watch?v=VIDEO_ID
      if (urlObject.hostname.includes("youtube.com")) {
        const videoId = urlObject.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // youtu.be/VIDEO_ID
      if (urlObject.hostname === "youtu.be") {
        const videoId = urlObject.pathname.substring(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return url;
    } catch (error) {
      console.error("Invalid YouTube URL:", error);

      return "";
    }
  };

  const fetchYoutubeVideo = async () => {
    try {
      const response = await axios.get(
        "https://ikonix-backend.vercel.app/api/Youtube/getYoutube",
      );

      console.log("YouTube Response:", response.data);

      const video = response.data.youtube || null;

      setYoutubeVideo(video);
    } catch (error) {
      console.error(
        "Error fetching YouTube video:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchYoutubeVideo();
  }, []);

  return (
    <section className="w-full bg-white font-Arimo sm:mt-10 mt-16">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <a
        href="https://wa.me/918111856618"
        target="_blank"
        rel="noopener noreferrer"
      >
         <IoLogoWhatsapp className="text-6xl animate-bounce text-green-600 fixed bottom-10 right-10" />
      </a>
      <div
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pt-8
          md:pt-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            items-center
            gap-8
            lg:gap-4
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="w-full">
            {/* MAIN HEADING */}

            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-[52px]
                xl:text-[58px]
                leading-[1.05]
                font-bold
                tracking-tight
                text-black
              "
            >
              PRECISION TESTING
            </h1>

            <h2
              className="
                mt-1
                text-4xl
                sm:text-5xl
                lg:text-[52px]
                xl:text-[58px]
                leading-[1.05]
                font-bold
                tracking-tight
                text-[#FC9D03]
              "
            >
              PERFECT RESULTS
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                sm:text-[16px]
                leading-6
                text-gray-700
              "
            >
              <span className="text-[#FC9D03] font-medium">IKONIX</span> Test
              and Measurement LLP provides reliable test and measurement
              instruments designed to support accurate testing, inspection and
              measurement across a wide range of professional and industrial
              applications.
            </p>

            {/* SMALL TAGLINE */}

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-md
                text-gray-600
              "
            >
              <Scissors size={17} strokeWidth={2} className="text-[#FC9D03]" />

              <span>
                Reliable Solutions. Professional Service. Built Around You
              </span>
            </div>
          </div>

          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <div
            className="
              w-full
              flex
              items-center
              justify-center
              lg:justify-end
            "
          >
            <img
              src={image_homepage}
              alt="IKONIX Test and Measurement Instruments"
              className="
                w-full
                max-w-[620px]
                h-auto
                object-contain
              "
            />
          </div>
        </div>

        {/* =====================================================
            SERVICE FEATURE CARDS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-3
            sm:gap-5
            mt-7
            md:mt-9
            pb-8
          "
        >
          {/* =================================================
              FREE SHIPPING
          ================================================= */}

          <div
            className="
              min-h-[100px]
              sm:min-h-[110px]
              rounded-lg
              bg-[#fafafa]
              px-3
              py-4
              flex
              flex-col
              items-center
              justify-center
              text-center
              transition
              hover:shadow-sm
            "
          >
            <Truck size={27} strokeWidth={2} className="text-black mb-3" />

            <h3
              className="
                text-xs
                sm:text-sm
                font-medium
                text-gray-900
              "
            >
              Free Shipping
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                sm:text-xs
                font-bold
                text-gray-500
              "
            >
              On orders above AED 1999
            </p>
          </div>

          {/* =================================================
              DELIVERY
          ================================================= */}

          <div
            className="
              min-h-[100px]
              sm:min-h-[110px]
              rounded-lg
              bg-[#fafafa]
              px-3
              py-4
              flex
              flex-col
              items-center
              justify-center
              text-center
              transition
              hover:shadow-sm
            "
          >
            <PackageCheck
              size={27}
              strokeWidth={2}
              className="text-black mb-3"
            />

            <h3
              className="
                text-xs
                sm:text-sm
                font-medium
                text-gray-900
              "
            >
              Delivery
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                sm:text-xs
                font-bold
                text-gray-500
              "
            >
              Fast & Free Returns
            </p>
          </div>

          {/* =================================================
              CHAT WITH US
          ================================================= */}

          <div
            className="
              min-h-[100px]
              sm:min-h-[110px]
              rounded-lg
              bg-[#fafafa]
              px-3
              py-4
              flex
              flex-col
              items-center
              justify-center
              text-center
              transition
              hover:shadow-sm
            "
          >
            <Headphones size={27} strokeWidth={2} className="text-black mb-3" />

            <h3
              className="
                text-xs
                sm:text-sm
                font-medium
                text-gray-900
              "
            >
              Chat With Us
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                sm:text-xs
                font-bold
                text-gray-500
              "
            >
              We offer 24-hour chat support
            </p>
          </div>

          {/* =================================================
              LOCATIONS
          ================================================= */}

          <div
            className="
              min-h-[100px]
              sm:min-h-[110px]
              rounded-lg
              bg-[#fafafa]
              px-3
              py-4
              flex
              flex-col
              items-center
              justify-center
              text-center
              transition
              hover:shadow-sm
            "
          >
            <MapPin size={27} strokeWidth={2} className="text-black mb-3" />

            <h3
              className="
                text-xs
                sm:text-sm
                font-medium
                text-gray-900
              "
            >
              Locations
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                sm:text-xs
                font-bold
                text-gray-500
              "
            >
              Find a store near you
            </p>
          </div>
        </div>
      </div>
      {/* =====================================================
    PRODUCT CATEGORIES SECTION
===================================================== */}

      <section className="w-full bg-white">
        <div
          className="
      max-w-7xl
      mx-auto
      px-5
      sm:px-8
      lg:px-10
      py-14
      md:py-20
    "
        >
          {/* =================================================
        SECTION HEADING
    ================================================= */}

          <div className="text-center">
            {/* SMALL TITLE */}

            <p
              className="
          text-[10px]
          sm:text-xs
          font-medium
          text-[#FC9D03]
          uppercase
          tracking-wide
        "
            >
              Our Product Categories
            </p>

            {/* MAIN TITLE */}

            <h2
              className="
          mt-3
          text-2xl
          sm:text-3xl
          md:text-4xl
          font-medium
          text-black
          tracking-tight
        "
            >
              High Quality{" "}
              <span className="text-[#FC9D03]">Test & Measurement</span>{" "}
              Instruments
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
          mt-3
          text-xs
          sm:text-lg
          text-gray-600
        "
            >
              Explore our wide range of precision instruments designed for
              accuracy, reliability and performance.
            </p>
          </div>

          {/* =================================================
        CATEGORY CARDS
    ================================================= */}

          <div
            className="
        mt-8
        md:mt-10
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
        md:gap-5
      "
          >
            {/* =================================================
          MULTIMETERS
      ================================================= */}

            <div
              className="
          group
          h-[100px]
          sm:h-[110px]
          rounded-lg
          border
          border-[#FC9D03]
          bg-white
          flex
          items-center
          px-5
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-md
        "
            >
              {/* IMAGE */}

              <div
                className="
            w-[65px]
            h-[75px]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
              >
                <img
                  src="https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/u/t/ut33d_palm_size_multimeter_with_ncv_uni-t_digital_7_.jpg"
                  alt="Multimeters"
                  className="
              max-w-full
              max-h-full
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
                />
              </div>

              {/* TEXT */}

              <div className="ml-3">
                <h3
                  className="
              text-xs
              sm:text-sm
              font-bold
              text-gray-800
            "
                >
                  Multimeters
                </h3>
              </div>
            </div>

            {/* =================================================
          CLAMP METERS
      ================================================= */}

            <div
              className="
          group
          h-[100px]
          sm:h-[110px]
          rounded-lg
          border
          border-[#FC9D03]
          bg-white
          flex
          items-center
          px-5
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-md
        "
            >
              <div
                className="
            w-[65px]
            h-[75px]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHuByWcHhL-rDmK06reEpFry4r9qukClISnxUMp0JEiVwLG7VlbEm_DDe3&s=10"
                  alt="Clamp Meters"
                  className="
              max-w-full
              max-h-full
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
                />
              </div>

              <div className="ml-3">
                <h3
                  className="
              text-xs
              sm:text-sm
              font-bold
              text-gray-800
            "
                >
                  Clamp Meters
                </h3>
              </div>
            </div>

            {/* =================================================
          POWER SUPPLIES
      ================================================= */}

            <div
              className="
          group
          h-[100px]
          sm:h-[110px]
          rounded-lg
          border
          border-[#FC9D03]
          bg-white
          flex
          items-center
          px-5
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-md
        "
            >
              <div
                className="
            w-[65px]
            h-[75px]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
              >
                <img
                  src="https://www.lifewire.com/thmb/Gb9Gx1CUa04i_-cq35BvBTEPdL0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/power-supply-5aba984fba617700376b877f.PNG"
                  alt="Power Supplies"
                  className="
              max-w-full
              max-h-full
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
                />
              </div>

              <div className="ml-3">
                <h3
                  className="
              text-xs
              sm:text-sm
              font-bold
              text-gray-800
            "
                >
                  Power Supplies
                </h3>
              </div>
            </div>

            {/* =================================================
          TEMPERATURE
      ================================================= */}

            <div
              className="
          group
          h-[100px]
          sm:h-[110px]
          rounded-lg
          border
          border-[#FC9D03]
          bg-white
          flex
          items-center
          px-5
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-md
        "
            >
              <div
                className="
            w-[65px]
            h-[75px]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
              >
                <img
                  src="https://www.hioki.com/system/files/image/2023-12/8_FT3700-20-1.jpg"
                  alt="Temperature Instruments"
                  className="
              max-w-full
              max-h-full
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
                />
              </div>

              <div className="ml-3">
                <h3
                  className="
              text-xs
              sm:text-sm
              font-bold
              text-gray-800
            "
                >
                  Temperature
                </h3>
              </div>
            </div>
          </div>
          {/* =====================================================
    COMPANY VIDEO SECTION
===================================================== */}

          <section className="w-full bg-[#fafafa]">
            <div
              className="
      max-w-7xl
      mx-auto
      px-5
      sm:px-8
      lg:px-10
      py-14
      md:py-20
    "
            >
              {/* SECTION TITLE */}

              <div className="text-center mb-8">
                <p
                  className="
          text-xs
          font-medium
          uppercase
          tracking-wide
          text-[#FC9D03]
        "
                >
                  Discover IKONIX
                </p>

                <h2
                  className="
          mt-2
          text-2xl
          sm:text-3xl
          md:text-4xl
          font-semibold
          text-black
        "
                >
                  See Our{" "}
                  <span className="text-[#FC9D03]">Products In Action</span>
                </h2>

                <p
                  className="
          mt-3
          max-w-2xl
          mx-auto
          text-sm
          text-gray-600
        "
                >
                  Explore our test and measurement solutions and learn more
                  about the products and services offered by IKONIX.
                </p>
              </div>

              {/* VIDEO */}

              <div
                className="
        max-w-4xl
        mx-auto
        aspect-video
        rounded-2xl
        overflow-hidden
        bg-gray-100
        shadow-sm
      "
              >
                {youtubeVideo?.url ? (
                  <iframe
                    className="w-full h-full"
                    src={getYoutubeEmbedUrl(youtubeVideo.url)}
                    title={youtubeVideo.title || "IKONIX Company Video"}
                    frameBorder="0"
                    allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share
          "
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="
            w-full
            h-full
            flex
            items-center
            justify-center
            text-sm
            text-gray-400
          "
                  >
                    No video added
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
      <IndustryBrands />
    </section>
  );
}

export default Home;
