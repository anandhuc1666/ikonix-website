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
  Download,
  MessageCircle,
  Package,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();

  // ======================================================
  // STATES
  // ======================================================

  const [product, setProduct] =
    useState(null);

  const [allProducts, setAllProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedImage, setSelectedImage] =
    useState("");

  // ======================================================
  // FETCH SELECTED PRODUCT
  // ======================================================

  const fetchProduct = async () => {
    try {
      const response =
        await axios.get(
          `https://ikonix-backend.vercel.app/api/products/getProductById/${id}`
        );

      const selectedProduct =
        response.data.product;

      setProduct(selectedProduct);

      // Set first image
      if (
        Array.isArray(
          selectedProduct?.Image
        ) &&
        selectedProduct.Image.length > 0
      ) {
        setSelectedImage(
          selectedProduct.Image[0]
        );
      }

    } catch (error) {
      console.error(
        "Fetch Product Error:",
        error
      );
    }
  };

  // ======================================================
  // FETCH ALL PRODUCTS
  // ======================================================

  const fetchAllProducts = async () => {
    try {
      const response =
        await axios.get(
          "https://ikonix-backend.vercel.app/api/products/getAllProducts"
        );

      setAllProducts(
        response.data.products || []
      );

    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );
    }
  };

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchProduct(),
        fetchAllProducts(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  // ======================================================
  // PRODUCT IMAGES
  // ======================================================

  const productImages = useMemo(() => {
    if (
      !product?.Image
    ) {
      return [];
    }

    if (
      Array.isArray(product.Image)
    ) {
      return product.Image.filter(
        Boolean
      );
    }

    if (
      typeof product.Image ===
        "string" &&
      product.Image
    ) {
      return [product.Image];
    }

    return [];
  }, [product]);

  // ======================================================
  // SAME CATEGORY PRODUCTS
  // ======================================================

  const sameCategoryProducts =
    useMemo(() => {
      if (!product) {
        return [];
      }

      return allProducts
        .filter(
          (item) =>
            item._id !== product._id &&
            item.category ===
              product.category
        )
        .slice(0, 8);
    }, [
      allProducts,
      product,
    ]);

  // ======================================================
  // OTHER CATEGORIES
  // ======================================================

  const otherCategories =
    useMemo(() => {
      if (!product) {
        return [];
      }

      const categories =
        allProducts
          .map(
            (item) =>
              item.category
          )
          .filter(Boolean)
          .filter(
            (category) =>
              category !==
              product.category
          );

      return [
        ...new Set(categories),
      ];
    }, [
      allProducts,
      product,
    ]);

  // ======================================================
  // PRODUCTS BY OTHER CATEGORY
  // ======================================================

  const getCategoryProducts =
    (category) => {
      return allProducts
        .filter(
          (item) =>
            item.category ===
            category
        )
        .slice(0, 5);
    };

  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formatPrice = (
    price
  ) => {
    const value =
      Number(price) || 0;

    return `AED ${value.toLocaleString(
      "en-AE",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ======================================================
  // WHATSAPP
  // ======================================================

  const whatsappNumber =
    "918111856618";

  const enquiryMessage =
    product
      ? `Hello IKONIX, I am interested in ${product.productName}${
          product.modelNumber
            ? ` (${product.modelNumber})`
            : ""
        }. Please provide more information.`
      : "";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      enquiryMessage
    )}`;

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
          bg-white
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

  // ======================================================
  // PRODUCT NOT FOUND
  // ======================================================

  if (!product) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <Package
          size={45}
          className="text-gray-300"
        />

        <h2
          className="
            mt-4
            text-lg
            font-semibold
          "
        >
          Product not found
        </h2>

        <Link
          to="/products/page"
          className="
            mt-4
            px-5
            py-2
            rounded-md
            bg-[#FC9D03]
            text-white
            text-ml
          "
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white sm:mt-20 mt-16">

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

        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            sm:text-[12px]
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
            to="/products/page"
            className="hover:text-[#FC9D03]"
          >
            Product All
          </Link>

          <ChevronRight size={11} />

          <span className="text-gray-700">
            Product Details
          </span>

        </div>

      </div>


      {/* ==================================================
          MAIN PRODUCT
      ================================================== */}

      <section
        className="
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          py-6
        "
      >

        <div
          className="
            border
            border-orange-100
            rounded-xl
            p-5
            md:p-7
          "
        >

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[42%_58%]
              gap-8
            "
          >

            {/* =================================================
                PRODUCT IMAGES
            ================================================= */}

            <div>

              {/* MAIN IMAGE */}

              <div
                className="
                  h-[330px]
                  md:h-[400px]
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  p-8
                "
              >

                {selectedImage ? (

                  <img
                    src={selectedImage}
                    alt={
                      product.productName
                    }
                    className="
                      max-w-full
                      max-h-full
                      object-contain
                    "
                  />

                ) : (

                  <div
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    No image available
                  </div>

                )}

              </div>


              {/* THUMBNAILS */}

              {productImages.length >
                1 && (

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mt-4
                    overflow-x-auto
                  "
                >

                  {productImages.map(
                    (
                      image,
                      index
                    ) => (

                      <button
                        key={image}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            image
                          )
                        }
                        className={`
                          w-16
                          h-16
                          flex-shrink-0
                          rounded-md
                          border
                          flex
                          items-center
                          justify-center
                          p-1
                          bg-gray-200
                          ${
                            selectedImage ===
                            image
                              ? "border-[#FC9D03]"
                              : "border-gray-200"
                          }
                        `}
                      >

                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="
                            w-full
                            h-full
                            object-contain
                          "
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div>

              {/* BRAND */}

              {product.brandName && (

                <p
                  className="
                    text-ml
                    uppercase
                    font-bold
                    text-[#FC9D03]
                  "
                >
                  {product.brandName}
                </p>

              )}


              {/* PRODUCT NAME */}

              <h1
                className="
                  mt-2
                  text-xl
                  sm:text-3xl
                  md:text-3xl
                  font-semibold
                  text-gray-900
                  leading-tight
                "
              >
                {product.productName}
              </h1>


              {/* MODEL */}

              {product.modelNumber && (

                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-500
                  "
                >
                  Model Number:{" "}
                  <span className="text-gray-800">
                    {product.modelNumber}
                  </span>
                </p>

              )}


              {/* SHORT DESCRIPTION */}

              {product.shortDescription && (

                <p
                  className="
                    mt-5
                    text-sm
                    leading-6
                    text-gray-600
                  "
                >
                  {
                    product.shortDescription
                  }
                </p>

              )}


              {/* DETAILS */}

              <div
                className="
                  mt-6
                  border-t
                  border-gray-100
                  pt-5
                  space-y-3
                "
              >

                {product.category && (

                  <div className="flex">

                    <span
                      className="
                        w-32
                        text-xs
                        text-gray-400
                      "
                    >
                      Category
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-800
                        font-medium
                      "
                    >
                      {product.category}
                    </span>

                  </div>

                )}


                {product.unit && (

                  <div className="flex">

                    <span
                      className="
                        w-32
                        text-xs
                        text-gray-400
                      "
                    >
                      Unit
                    </span>

                    <span className="text-xs">
                      {product.unit}
                    </span>

                  </div>

                )}


                <div className="flex">

                  <span
                    className="
                      w-32
                      text-xs
                      text-gray-400
                    "
                  >
                    Availability
                  </span>

                  <span
                    className={`
                      text-xs
                      font-medium
                      ${
                        Number(
                          product.stock
                        ) > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    `}
                  >
                    {Number(
                      product.stock
                    ) > 0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}
                  </span>

                </div>

              </div>


              {/* PRICE */}

              <div className="mt-6">

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  Current Price
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    text-[#FC9D03]
                  "
                >
                  {formatPrice(
                    product.price
                  )}
                </p>

              </div>


              {/* ACTIONS */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-3
                "
              >

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
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
                  <MessageCircle
                    size={16}
                  />

                  Enquiry Now
                </a>


                {product.pdfFile && (

                  <a
                    href={product.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-3
                      rounded-md
                      border
                      border-[#FC9D03]
                      text-[#FC9D03]
                      text-xs
                      font-medium
                      hover:bg-orange-50
                      transition
                    "
                  >

                    <Download
                      size={16}
                    />

                    Product PDF

                  </a>

                )}

              </div>

            </div>

          </div>


          {/* =================================================
              FULL PRODUCT DESCRIPTION
          ================================================= */}

          <div
            className="
              mt-8
              pt-7
              border-t
              border-gray-100
            "
          >

            <h2
              className="
                text-xs
                uppercase
                font-semibold
                text-[#FC9D03]
              "
            >
              Product Description
            </h2>

            <div
              className="
                mt-3
                text-xs
                sm:text-sm
                leading-6
                text-gray-600
                whitespace-pre-line
              "
            >
              {product.productDescription ||
                "Product description is not available."}
            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          SAME CATEGORY
      ================================================== */}

      {product.category &&
        sameCategoryProducts.length >
          0 && (

          <section
            className="
              max-w-[1400px]
              mx-auto
              px-5
              sm:px-8
              lg:px-10
              py-10
            "
          >

            <div className="flex items-end justify-between">

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    text-[#FC9D03]
                    font-medium
                  "
                >
                  Products Category
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
                  More{" "}
                  <span className="text-[#FC9D03]">
                    {product.category}
                  </span>
                </h2>

              </div>

              <Link
                to={`/products/page?category=${encodeURIComponent(
                  product.category
                )}`}
                className="
                  hidden
                  sm:block
                  text-xs
                  text-[#FC9D03]
                  hover:underline
                "
              >
                View All
              </Link>

            </div>


            <div
              className="
                mt-6
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                gap-4
              "
            >

              {sameCategoryProducts.map(
                (item) => (

                  <ProductCard
                    key={item._id}
                    product={item}
                  />

                )
              )}

            </div>

          </section>

        )}


      {/* ==================================================
          OTHER PRODUCT CATEGORIES
      ================================================== */}

      {otherCategories.length >
        0 && (

        <section
          className="
            bg-[#fafafa]
            border-t
            border-gray-100
          "
        >

          <div
            className="
              max-w-[1400px]
              mx-auto
              px-5
              sm:px-8
              lg:px-10
              py-12
            "
          >

            <div className="text-center">

              <p
                className="
                  text-[10px]
                  uppercase
                  text-[#FC9D03]
                  font-medium
                "
              >
                Explore More
              </p>

              <h2
                className="
                  mt-2
                  text-xl
                  sm:text-3xl
                  font-semibold
                "
              >
                Other Product Categories
              </h2>

              <p
                className="
                  mt-2
                  text-ml
                  text-gray-500
                "
              >
                Discover more test and measurement
                solutions from IKONIX.
              </p>

            </div>


            {/* CATEGORY BUTTONS */}

            <div
              className="
                mt-7
                flex
                flex-wrap
                justify-center
                gap-3
              "
            >

              {otherCategories.map(
                (category) => (

                  <Link
                    key={category}
                    to={`/products/page?category=${encodeURIComponent(
                      category
                    )}`}
                    className="
                      px-5
                      py-2.5
                      rounded-full
                      border
                      border-orange-200
                      bg-white
                      text-xs
                      text-gray-700
                      hover:border-[#FC9D03]
                      hover:text-[#FC9D03]
                      transition
                    "
                  >
                    {category}
                  </Link>

                )
              )}

            </div>


            {/* =================================================
                OTHER CATEGORY PRODUCTS
            ================================================= */}

            <div className="mt-10 space-y-12">

              {otherCategories
                .slice(0, 4)
                .map(
                  (category) => {

                    const categoryProducts =
                      getCategoryProducts(
                        category
                      );

                    if (
                      categoryProducts.length ===
                      0
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={category}
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <h3
                            className="
                              text-base
                              font-semibold
                              text-gray-900
                            "
                          >
                            {category}
                          </h3>

                          <Link
                            to={`/products/page?category=${encodeURIComponent(
                              category
                            )}`}
                            className="
                              text-[12px]
                              text-[#FC9D03]
                              hover:underline
                            "
                          >
                            View All
                          </Link>

                        </div>


                        <div
                          className="
                            mt-4
                            grid
                            grid-cols-2
                            sm:grid-cols-3
                            md:grid-cols-4
                            lg:grid-cols-5
                            gap-4
                          "
                        >

                          {categoryProducts.map(
                            (item) => (

                              <ProductCard
                                key={
                                  item._id
                                }
                                product={
                                  item
                                }
                              />

                            )
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

            </div>

          </div>

        </section>

      )}


      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <section className="bg-white">

        <div
          className="
            max-w-[1400px]
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
            Need Help Choosing the{" "}
            <span className="text-[#FC9D03]">
              Right Instrument?
            </span>
          </h2>

          <p
            className="
              mt-2
              text-xs
              text-gray-500
            "
          >
            Contact our team for product
            information, technical assistance
            and quotations.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-md
              bg-[#FC9D03]
              text-white
              text-xs
              font-medium
            "
          >
            <MessageCircle size={16} />
            Contact Us
          </a>

        </div>

      </section>

    </div>
  );
}


// ======================================================
// PRODUCT CARD
// ======================================================

function ProductCard({
  product,
}) {
  const getImage = () => {
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

  return (
    <Link
      to={`/products/page/${product._id}`}
      className="
        group
        bg-white
        rounded-lg
        border
        border-gray-100
        overflow-hidden
        hover:-translate-y-1
        hover:shadow-md
        transition-all
        duration-300
      "
    >

      {/* IMAGE */}

      <div
        className="
          h-[140px]
          sm:h-[160px]
          bg-white
          flex
          items-center
          justify-center
          p-4
        "
      >

        <img
          src={getImage()}
          alt={
            product.productName ||
            "Product"
          }
          className="
            w-full
            h-full
            object-contain
            group-hover:scale-105
            transition-transform
            duration-300
          "
        />

      </div>


      {/* DETAILS */}

      <div className="p-3">

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

        <h4
          className="
            mt-1
            text-[10px]
            sm:text-xs
            font-medium
            text-gray-800
            line-clamp-2
            leading-4
            min-h-[32px]
          "
        >
          {product.productName}
        </h4>

        {product.modelNumber && (

          <p
            className="
              mt-1
              text-[8px]
              text-gray-400
              truncate
            "
          >
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
          AED{" "}
          {Number(
            product.price || 0
          ).toLocaleString(
            "en-AE"
          )}
        </p>

      </div>

    </Link>
  );
}

export default ProductDetails;