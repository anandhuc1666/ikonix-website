import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

function ProductsPage() {
  // ======================================================
  // STATES
  // ======================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All Categories");

  const [availability, setAvailability] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 12;

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/products/getAllProducts"
      );

      console.log(
        "Products:",
        response.data
      );

      setProducts(
        response.data.products || []
      );

    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ======================================================
  // CATEGORIES
  // ======================================================

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return [
      "All Categories",
      ...new Set(values),
    ];
  }, [products]);

  // ======================================================
  // FILTER PRODUCTS
  // ======================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        product.productName
          ?.toLowerCase()
          .includes(searchValue) ||
        product.brandName
          ?.toLowerCase()
          .includes(searchValue) ||
        product.modelNumber
          ?.toLowerCase()
          .includes(searchValue);

      // -----------------------------------------------
      // CATEGORY
      // -----------------------------------------------

      const matchesCategory =
        category === "All Categories" ||
        product.category === category;

      // -----------------------------------------------
      // AVAILABILITY
      // -----------------------------------------------

      const stock =
        Number(product.stock) || 0;

      let matchesAvailability = true;

      if (availability === "In Stock") {
        matchesAvailability = stock > 0;
      }

      if (availability === "Out of Stock") {
        matchesAvailability = stock <= 0;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    products,
    search,
    category,
    availability,
  ]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const displayedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  // ======================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ======================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    availability,
  ]);

  // ======================================================
  // IMAGE
  // ======================================================

  const getProductImage = (product) => {
    if (
      Array.isArray(product.Image) &&
      product.Image.length > 0
    ) {
      return product.Image[0];
    }

    if (
      typeof product.Image === "string" &&
      product.Image
    ) {
      return product.Image;
    }

    return "/placeholder-product.png";
  };

  // ======================================================
  // PRICE
  // ======================================================

  const formatPrice = (price) => {
    const value = Number(price) || 0;

    return `AED ${value.toLocaleString(
      "en-AE",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return (
    <div className="w-full bg-white">

      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div
        className="
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pt-5
        "
      >
        <p
          className="
            text-[9px]
            sm:text-[10px]
            text-gray-500
            uppercase
          "
        >
          <Link
            to="/"
            className="hover:text-[#FC9D03]"
          >
            Home
          </Link>

          <span className="mx-2">
            &gt;
          </span>

          <span className="text-gray-800">
            Product All
          </span>
        </p>
      </div>


      {/* ==================================================
          FILTER / SEARCH BAR
      ================================================== */}

      <div
        className="
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          mt-5
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            items-stretch
            md:items-center
            gap-3
          "
        >

          {/* CATEGORY */}

          <div className="relative w-full md:w-[190px]">

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="
                appearance-none
                w-full
                h-10
                px-3
                pr-9
                rounded-md
                border
                border-gray-200
                bg-white
                text-[11px]
                text-gray-600
                outline-none
                focus:border-[#FC9D03]
              "
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={15}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

          </div>


          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              md:w-[280px]
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
              placeholder="What are you looking for?"
              className="
                w-full
                h-10
                pl-9
                pr-3
                rounded-md
                border
                border-gray-200
                text-[11px]
                outline-none
                focus:border-[#FC9D03]
              "
            />

          </div>


          {/* AVAILABILITY */}

          <div
            className="
              ml-auto
              flex
              items-center
              gap-3
            "
          >

            <div className="hidden sm:block">
              <p className="text-[9px] text-gray-400">
                Availability
              </p>
            </div>

            <div className="relative">

              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(
                    e.target.value
                  )
                }
                className="
                  appearance-none
                  h-10
                  min-w-[130px]
                  px-3
                  pr-8
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  text-[11px]
                  text-gray-600
                  outline-none
                "
              >
                <option value="All">
                  All
                </option>

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>
              </select>

              <ChevronDown
                size={14}
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <div
        className="
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          py-7
        "
      >

        {/* RESULT COUNT */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <p className="text-[11px] text-orange-500">
            {filteredProducts.length}{" "}
            products found
          </p>

          <SlidersHorizontal
            size={15}
            className="text-orange-400 md:hidden"
          />

        </div>


        {/* LOADING */}

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


        {/* NO PRODUCTS */}

        {!loading &&
          displayedProducts.length ===
            0 && (

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

              <p
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                No products found
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Try changing your search
                or filter.
              </p>

            </div>

          )}


        {/* PRODUCT GRID */}

        {!loading &&
          displayedProducts.length >
            0 && (

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                gap-4
                lg:gap-5
              "
            >

              {displayedProducts.map(
                (product) => (

                  <Link
                    key={product._id}
                    to={`/products/page/${product._id}`}
                    className="
                      group
                      bg-[#FAFAFA]
                      rounded-lg
                      border
                      border-[#FC9D03]/50
                      overflow-hidden
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-md
                    "
                  >

                    {/* PRODUCT IMAGE */}

                    <div
                      className="
                        h-[170px]
                        sm:h-[190px]
                        bg-white
                        flex
                        items-center
                        justify-center
                        p-5
                      "
                    >

                      <img
                        src={getProductImage(
                          product
                        )}
                        alt={
                          product.productName ||
                          "Product"
                        }
                        className="
                          w-full
                          h-full
                          object-contain
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                      />

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="p-3">

                      {/* BRAND */}

                      {product.brandName && (
                        <p
                          className="
                            text-[8px]
                            uppercase
                            text-[#FC9D03]
                            font-medium
                          "
                        >
                          {product.brandName}
                        </p>
                      )}


                      {/* NAME */}

                      <h3
                        className="
                          mt-1
                          text-[11px]
                          sm:text-xs
                          font-medium
                          leading-4
                          text-gray-800
                          line-clamp-2
                          min-h-[32px]
                        "
                      >
                        {product.productName}
                      </h3>


                      {/* MODEL */}

                      {product.modelNumber && (
                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-gray-400
                            truncate
                          "
                        >
                          Model:{" "}
                          {product.modelNumber}
                        </p>
                      )}


                      {/* PRICE */}

                      <p
                        className="
                          mt-2
                          text-[11px]
                          sm:text-xs
                          font-semibold
                          text-[#FC9D03]
                        "
                      >
                        {formatPrice(
                          product.price
                        )}
                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}


        {/* ==================================================
            PAGINATION
        ================================================== */}

        {!loading &&
          totalPages > 1 && (

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                mt-10
              "
            >

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      page - 1
                  )
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-[#FC9D03]
                  text-white
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                "
              >
                <ChevronLeft
                  size={14}
                />
              </button>


              <span
                className="
                  min-w-[30px]
                  h-8
                  px-2
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-medium
                  text-white
                  bg-[#FC9D03]
                "
              >
                {currentPage}
              </span>


              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      page + 1
                  )
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-[#FC9D03]
                  text-white
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                "
              >
                <ChevronRight
                  size={14}
                />
              </button>

            </div>

          )}

      </div>


      {/* ==================================================
          PRODUCT CTA
      ================================================== */}

      <section
        className="
          border-t
          border-gray-100
          bg-[#fafafa]
        "
      >

        <div
          className="
            max-w-[1400px]
            mx-auto
            px-5
            sm:px-8
            lg:px-10
            py-10
            md:py-14
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-6
          "
        >

          <div>

            <h2
              className="
                text-xl
                sm:text-2xl
                font-semibold
                text-gray-900
              "
            >
              Product Catalogue{" "}
              <span className="text-[#FC9D03]">
                CTA
              </span>
            </h2>

            <p
              className="
                mt-2
                text-xs
                text-gray-600
              "
            >
              Looking for the Right Test &
              Measurement Instrument?
            </p>

            <p
              className="
                mt-2
                max-w-xl
                text-[10px]
                sm:text-xs
                leading-4
                text-gray-500
              "
            >
              Tell us what you need to measure.
              Our team can help you identify a
              suitable product for your
              application.
            </p>

          </div>


          <Link
            to="/contact/page"
            className="
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
            Learn More About Us
          </Link>

        </div>

      </section>

    </div>
  );
}

export default ProductsPage;