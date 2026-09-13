import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
} from "react-router-dom";

import {
  Search,
  ChevronRight,
  Tag,
} from "lucide-react";

function Brands() {
  // ======================================================
  // STATES
  // ======================================================

  const [brands, setBrands] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH BRANDS
  // ======================================================

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/brands/getAllBrands"
      );

      console.log(
        "Brands Response:",
        response.data
      );

      const allBrands =
        response.data.brands || [];

      // Only show active brands
      const activeBrands =
        allBrands.filter(
          (brand) =>
            brand.status === "Active"
        );

      setBrands(activeBrands);

    } catch (error) {
      console.error(
        "Fetch Brands Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {
    fetchBrands();
  }, []);

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredBrands = useMemo(() => {
    const value =
      search.toLowerCase().trim();

    if (!value) {
      return brands;
    }

    return brands.filter((brand) => {
      const brandName =
        brand.brandName
          ?.toLowerCase() || "";

      const categories =
        Array.isArray(brand.category)
          ? brand.category
              .join(" ")
              .toLowerCase()
          : String(
              brand.category || ""
            ).toLowerCase();

      return (
        brandName.includes(value) ||
        categories.includes(value)
      );
    });
  }, [
    brands,
    search,
  ]);

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-white
      "
    >

      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pt-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            sm:text-[10px]
            uppercase
            text-gray-400
          "
        >

          <Link
            to="/"
            className="
              hover:text-[#FC9D03]
              transition
            "
          >
            Home
          </Link>

          <ChevronRight size={11} />

          <span className="text-gray-700">
            Brands
          </span>

        </div>

      </div>


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pt-8
          pb-6
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-5
          "
        >

          {/* TITLE */}

          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-wide
                text-[#FC9D03]
                font-medium
              "
            >
              Our Partners
            </p>

            <h1
              className="
                mt-2
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-semibold
                text-gray-900
              "
            >
              Leading{" "}
              <span className="text-[#FC9D03]">
                Brands
              </span>
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-xs
                sm:text-sm
                leading-5
                text-gray-500
              "
            >
              Explore trusted test and measurement
              brands available through IKONIX.
              Discover reliable instruments and
              professional measurement solutions
              from leading manufacturers.
            </p>

          </div>


          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              md:w-[250px]
            "
          >

            <Search
              size={15}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search brands..."
              className="
                w-full
                h-10
                pl-9
                pr-3
                rounded-md
                border
                border-gray-200
                text-xs
                text-gray-700
                outline-none
                focus:border-[#FC9D03]
                transition
              "
            />

          </div>

        </div>

      </section>


      {/* ==================================================
          BRAND SECTION
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pb-14
        "
      >

        {/* BRAND COUNT */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <div className="flex items-center gap-2">

            <Tag
              size={14}
              className="text-[#FC9D03]"
            />

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              {filteredBrands.length}{" "}
              {filteredBrands.length === 1
                ? "Brand"
                : "Brands"}
            </p>

          </div>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div
            className="
              min-h-[400px]
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                w-8
                h-8
                border-4
                border-orange-100
                border-t-[#FC9D03]
                rounded-full
                animate-spin
              "
            />

          </div>

        )}


        {/* ==================================================
            NO BRANDS
        ================================================== */}

        {!loading &&
          filteredBrands.length === 0 && (

            <div
              className="
                min-h-[350px]
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >

              <Tag
                size={40}
                className="text-gray-200"
              />

              <h2
                className="
                  mt-4
                  text-base
                  font-medium
                  text-gray-700
                "
              >
                No brands found
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Try searching for another
                brand.
              </p>

            </div>

          )}


        {/* ==================================================
            BRAND GRID
        ================================================== */}

        {!loading &&
          filteredBrands.length > 0 && (

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                gap-5
                md:gap-6
              "
            >

              {filteredBrands.map(
                (brand) => (

                  <Link
                    key={brand._id}
                    to={`/brands/page/${encodeURIComponent(
                      brand.brandName
                    )}`}
                    className="
                      group
                      h-[145px]
                      sm:h-[155px]
                      md:h-[165px]
                      rounded-lg
                      border
                      border-[#FC9D03]
                      bg-white
                      flex
                      flex-col
                      items-center
                      justify-center
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-md
                    "
                  >

                    {/* LOGO */}

                    <div
                      className="
                        w-full
                        h-[85px]
                        flex
                        items-center
                        justify-center
                      "
                    >

                      {brand.Image ? (

                        <img
                          src={brand.Image}
                          alt={
                            brand.brandName ||
                            "Brand"
                          }
                          className="
                            max-w-[150px]
                            max-h-[75px]
                            w-auto
                            h-auto
                            object-contain
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div
                          className="
                            w-14
                            h-14
                            rounded-full
                            bg-orange-50
                            flex
                            items-center
                            justify-center
                            text-[#FC9D03]
                          "
                        >
                          <Tag
                            size={24}
                          />
                        </div>

                      )}

                    </div>


                    {/* BRAND NAME */}

                    <h2
                      className="
                        mt-3
                        text-xs
                        sm:text-sm
                        font-medium
                        text-gray-800
                        text-center
                        truncate
                        max-w-full
                        group-hover:text-[#FC9D03]
                        transition
                      "
                    >
                      {brand.brandName}
                    </h2>

                  </Link>

                )
              )}

            </div>

          )}

      </section>


      {/* ==================================================
          BRAND CTA
      ================================================== */}

      <section
        className="
          bg-[#fafafa]
          border-t
          border-gray-100
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            lg:px-10
            py-12
            text-center
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              text-[#FC9D03]
              font-medium
            "
          >
            Test & Measurement Solutions
          </p>

          <h2
            className="
              mt-2
              text-xl
              sm:text-2xl
              font-semibold
              text-gray-900
            "
          >
            Looking for a Specific{" "}
            <span className="text-[#FC9D03]">
              Brand?
            </span>
          </h2>

          <p
            className="
              mt-2
              max-w-xl
              mx-auto
              text-xs
              sm:text-sm
              leading-5
              text-gray-500
            "
          >
            Contact our team for product
            availability, specifications,
            technical assistance and
            quotations.
          </p>

          <Link
            to="/contact/page"
            className="
              mt-5
              inline-flex
              items-center
              justify-center
              px-6
              py-3
              rounded-md
              bg-[#FC9D03]
              text-white
              text-xs
              font-medium
              hover:bg-orange-500
              transition
            "
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Brands;