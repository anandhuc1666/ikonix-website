import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ChevronRight,
  Search,
  Tag,
} from "lucide-react";

function BrandProducts() {
  const { brandName } = useParams();

  const selectedBrand = decodeURIComponent(
    brandName || ""
  );

  // ======================================================
  // STATES
  // ======================================================

  const [products, setProducts] =
    useState([]);

  const [brand, setBrand] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // FETCH BRAND + PRODUCTS
  // ======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          brandResponse,
          productResponse,
        ] = await Promise.all([
          axios.get(
            "http://localhost:5000/api/brands/getAllBrands"
          ),

          axios.get(
            "http://localhost:5000/api/products/getAllProducts"
          ),
        ]);

        // -----------------------------------------------
        // FIND BRAND
        // -----------------------------------------------

        const brands =
          brandResponse.data.brands ||
          [];

        const selectedBrandData =
          brands.find(
            (item) =>
              item.brandName
                ?.toLowerCase()
                .trim() ===
              selectedBrand
                .toLowerCase()
                .trim()
          );

        setBrand(
          selectedBrandData || null
        );

        // -----------------------------------------------
        // ALL PRODUCTS
        // -----------------------------------------------

        const allProducts =
          productResponse.data
            .products || [];

        // -----------------------------------------------
        // FILTER BY BRAND
        // -----------------------------------------------

        const brandProducts =
          allProducts.filter(
            (product) =>
              product.brandName
                ?.toLowerCase()
                .trim() ===
              selectedBrand
                .toLowerCase()
                .trim()
          );

        setProducts(
          brandProducts
        );

      } catch (error) {
        console.error(
          "Brand Products Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBrand]);

  // ======================================================
  // SEARCH PRODUCTS
  // ======================================================

  const filteredProducts =
    useMemo(() => {
      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return products;
      }

      return products.filter(
        (product) =>
          product.productName
            ?.toLowerCase()
            .includes(value) ||
          product.modelNumber
            ?.toLowerCase()
            .includes(value) ||
          product.category
            ?.toLowerCase()
            .includes(value)
      );
    }, [
      products,
      search,
    ]);

  // ======================================================
  // PRODUCT IMAGE
  // ======================================================

  const getProductImage = (
    product
  ) => {
    if (
      Array.isArray(product.Image) &&
      product.Image.length > 0
    ) {
      return product.Image[0];
    }

    if (
      typeof product.Image ===
        "string" &&
      product.Image
    ) {
      return product.Image;
    }

    return "/placeholder-product.png";
  };

  // ======================================================
  // PRICE
  // ======================================================

  const formatPrice = (
    price
  ) => {
    return `AED ${Number(
      price || 0
    ).toLocaleString("en-AE")}`;
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="
          min-h-[600px]
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
    );
  }

  return (
    <div className="w-full bg-white">

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
          pt-5
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
            className="hover:text-[#FC9D03]"
          >
            Home
          </Link>

          <ChevronRight size={11} />

          <Link
            to="/brands/page"
            className="hover:text-[#FC9D03]"
          >
            Brands
          </Link>

          <ChevronRight size={11} />

          <span className="text-gray-700">
            {selectedBrand}
          </span>

        </div>

      </div>


      {/* ==================================================
          BRAND INFORMATION
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          py-7
        "
      >

        <div
          className="
            border
            border-orange-100
            rounded-xl
            p-6
            md:p-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-start
              gap-8
            "
          >

            {/* BRAND LOGO */}

            <div
              className="
                w-full
                md:w-[220px]
                h-[140px]
                rounded-lg
                bg-[#fafafa]
                flex
                items-center
                justify-center
                p-5
                shrink-0
              "
            >

              {brand?.Image ? (

                <img
                  src={brand.Image}
                  alt={selectedBrand}
                  className="
                    max-w-full
                    max-h-full
                    object-contain
                  "
                />

              ) : (

                <Tag
                  size={45}
                  className="text-[#FC9D03]"
                />

              )}

            </div>


            {/* BRAND CONTENT */}

            <div className="flex-1">

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-wide
                  text-[#FC9D03]
                  font-medium
                "
              >
                Brand
              </p>

              <h1
                className="
                  mt-2
                  text-2xl
                  sm:text-3xl
                  font-semibold
                  text-gray-900
                "
              >
                {selectedBrand}
              </h1>

              <p
                className="
                  mt-4
                  text-xs
                  sm:text-sm
                  leading-6
                  text-gray-600
                "
              >
                Explore our range of{" "}
                {selectedBrand} test and
                measurement instruments.
                Browse products available
                from this brand and find
                the right solution for your
                application.
              </p>


              {/* CATEGORIES */}

              {brand?.category?.length >
                0 && (

                <div className="mt-5">

                  <p
                    className="
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Product Categories
                  </p>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                      mt-3
                    "
                  >

                    {brand.category.map(
                      (category) => (

                        <span
                          key={category}
                          className="
                            px-3
                            py-1.5
                            rounded-full
                            bg-orange-50
                            text-[10px]
                            text-[#FC9D03]
                          "
                        >
                          {category}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          PRODUCT HEADER
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pb-4
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-[10px]
                uppercase
                text-[#FC9D03]
                font-medium
              "
            >
              {selectedBrand}
            </p>

            <h2
              className="
                mt-1
                text-xl
                sm:text-2xl
                font-semibold
                text-gray-900
              "
            >
              All Products
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              {filteredProducts.length}{" "}
              products available
            </p>

          </div>


          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              sm:w-[260px]
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
              placeholder="Search products..."
              className="
                w-full
                h-10
                pl-9
                pr-3
                rounded-md
                border
                border-gray-200
                text-xs
                outline-none
                focus:border-[#FC9D03]
              "
            />

          </div>

        </div>

      </section>


      {/* ==================================================
          PRODUCTS
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

        {filteredProducts.length ===
        0 ? (

          <div
            className="
              min-h-[300px]
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

            <h3
              className="
                mt-4
                text-base
                font-medium
                text-gray-700
              "
            >
              No products found
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-gray-400
              "
            >
              There are currently no
              products available for{" "}
              {selectedBrand}.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              gap-5
            "
          >

            {filteredProducts.map(
              (product) => (

                <Link
                  key={product._id}
                  to={`/products/page/${product._id}`}
                  className="
                    group
                    bg-white
                    rounded-lg
                    border
                    border-gray-100
                    overflow-hidden
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      h-[170px]
                      sm:h-[190px]
                      bg-[#fafafa]
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
                        product.productName
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


                  {/* DETAILS */}

                  <div className="p-3">

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

                    <h3
                      className="
                        mt-1
                        text-[10px]
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

                    {product.modelNumber && (

                      <p
                        className="
                          mt-1
                          text-[8px]
                          text-gray-400
                          truncate
                        "
                      >
                        Model:{" "}
                        {product.modelNumber}
                      </p>

                    )}

                    <p
                      className="
                        mt-2
                        text-[10px]
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

      </section>


      {/* ==================================================
          CTA
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

          <h2
            className="
              text-xl
              sm:text-2xl
              font-semibold
            "
          >
            Looking for a{" "}
            <span className="text-[#FC9D03]">
              {selectedBrand}
            </span>{" "}
            Product?
          </h2>

          <p
            className="
              mt-2
              text-xs
              text-gray-500
            "
          >
            Contact our team for product
            availability, specifications
            and quotations.
          </p>

          <Link
            to="/contact/page"
            className="
              inline-flex
              mt-5
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

export default BrandProducts;