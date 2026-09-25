import React, { useEffect, useMemo, useState } from "react";

import axios from "axios";

import { Link, useParams } from "react-router-dom";

import { ChevronRight, Download, MessageCircle, Package } from "lucide-react";

function ProductDetails() {
  const colorCode = "#ff3f34";
  const { id } = useParams();

  // ======================================================
  // STATES
  // ======================================================

  const [product, setProduct] = useState(null);

  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  // ======================================================
  // FETCH SELECTED PRODUCT
  // ======================================================

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `https://ikonix-backend.vercel.app/api/products/getProductById/${id}`,
      );

      const selectedProduct = response.data.product;

      setProduct(selectedProduct);

      // Set first image
      if (
        Array.isArray(selectedProduct?.Image) &&
        selectedProduct.Image.length > 0
      ) {
        setSelectedImage(selectedProduct.Image[0]);
      }
    } catch (error) {
      console.error("Fetch Product Error:", error);
    }
  };

  // ======================================================
  // FETCH ALL PRODUCTS
  // ======================================================

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        "https://ikonix-backend.vercel.app/api/products/getAllProducts",
      );

      setAllProducts(response.data.products || []);
    } catch (error) {
      console.error("Fetch Products Error:", error);
    }
  };

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchProduct(), fetchAllProducts()]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  // ======================================================
  // PRODUCT IMAGES
  // ======================================================

  const productImages = useMemo(() => {
    if (!product?.Image) {
      return [];
    }

    if (Array.isArray(product.Image)) {
      return product.Image.filter(Boolean);
    }

    if (typeof product.Image === "string" && product.Image) {
      return [product.Image];
    }

    return [];
  }, [product]);

  // ======================================================
  // RELATED PRODUCTS
  // SAME CATEGORY
  //
  // IMPORTANT:
  // The selected product is NOT removed.
  // Therefore it can appear inside Related Products.
  // ======================================================

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return allProducts
      .filter((item) => item.category === product.category)
      .slice(0, 8);
  }, [allProducts, product]);

  // ======================================================
  // OTHER BRANDS IN SAME CATEGORY
  // ======================================================

  const otherBrandsInCategory = useMemo(() => {
    if (!product) {
      return [];
    }

    const brands = allProducts
      .filter(
        (item) =>
          item.category === product.category &&
          item.brandName &&
          item.brandName !== product.brandName,
      )
      .map((item) => item.brandName)
      .filter(Boolean);

    return [...new Set(brands)];
  }, [allProducts, product]);

  // ======================================================
  // PRODUCTS FROM OTHER BRAND
  // SAME CATEGORY
  // ======================================================

  const getBrandProducts = (brandName) => {
    if (!product) {
      return [];
    }

    return allProducts
      .filter(
        (item) =>
          item.category === product.category && item.brandName === brandName,
      )
      .slice(0, 5);
  };

  // ======================================================
  // OTHER CATEGORIES
  // ======================================================

  const otherCategories = useMemo(() => {
    if (!product) {
      return [];
    }

    const categories = allProducts
      .map((item) => item.category)
      .filter(Boolean)
      .filter((category) => category !== product.category);

    return [...new Set(categories)];
  }, [allProducts, product]);

  // ======================================================
  // PRODUCTS BY OTHER CATEGORY
  // ======================================================

  const getCategoryProducts = (category) => {
    return allProducts.filter((item) => item.category === category).slice(0, 5);
  };

  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formatPrice = (price) => {
    const value = Number(price) || 0;

    return `AED ${value.toLocaleString("en-AE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // ======================================================
  // WHATSAPP
  // ======================================================

  const whatsappNumber = "918111856618";

  const enquiryMessage = product
    ? `Hello IKONIX, I am interested in ${product.productName}${
        product.modelNumber ? ` (${product.modelNumber})` : ""
      }. Please provide more information.`
    : "";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    enquiryMessage,
  )}`;

  // ======================================================
  // DOWNLOAD PDF
  // ======================================================

  const handleDownloadPDF = async () => {
    if (!product?.pdfFile) {
      return;
    }

    try {
      const response = await fetch(product.pdfFile);

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      // Create safe filename
      const safeName = (product.productName || "IKONIX-Product")
        .replace(/[<>:"/\\|?*]/g, "")
        .trim();

      const fileName = `${safeName || "IKONIX-Product"}.pdf`;

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("PDF Download Error:", error);

      // Fallback
      window.open(product.pdfFile, "_blank");
    }
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
          bg-white
        "
      >
        <div
          className="
            w-8
            h-8
            border-4
            border-orange-100
            border-t-[#ff3f34]
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
        <Package size={45} className="text-gray-300" />

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
            
            text-white
            text-sm
          "
          style={{ backgroundColor: colorCode }}
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

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
          <Link to="/" className="hover:text-[#ff3f34]">
            Home
          </Link>

          <ChevronRight size={11} />

          <Link to="/products/page" className="hover:text-[#ff3f34]">
            Product All
          </Link>

          <ChevronRight size={11} />

          <span className="text-gray-700">Product Details</span>
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
                    alt={product.productName}
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

              {productImages.length > 1 && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mt-4
                    overflow-x-auto
                  "
                >
                  {productImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
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
                            selectedImage === image
                              ? "border-[#ff3f34]"
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
                  ))}
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
                    text-sm
                    uppercase
                    font-bold
                    
                  "
                  style={{ color: colorCode }}
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
                  <span className="text-gray-800">{product.modelNumber}</span>
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
                  {product.shortDescription}
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

                    <span className="text-xs">{product.unit}</span>
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
                        Number(product.stock) > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    `}
                  >
                    {Number(product.stock) > 0
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
                  "
                  style={{ color: colorCode }}
                >
                  {formatPrice(product.price)}
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
                {/* WHATSAPP */}

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
                    bg-[#ff3f34]
                    text-white
                    text-xs
                    font-medium
                    hover:bg-orange-500
                    transition
                  "
                >
                  <MessageCircle size={16} />
                  Enquiry Now
                </a>

                {/* PDF */}

                {product.pdfFile && (
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-3
                      rounded-md
                      border
                      text-xs
                      font-medium
                      hover:bg-orange-50
                      transition
                    "
                    style={{ color: colorCode, borderColor: colorCode }}
                  >
                    <Download size={16} />
                    Product PDF
                  </button>
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
                
              "
              style={{ color: colorCode }}
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
          RELATED PRODUCTS
          SAME CATEGORY
          SELECTED PRODUCT IS ALSO INCLUDED
      ================================================== */}

      {product.category && relatedProducts.length > 0 && (
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
          {/* HEADER */}

          <div
            className="
                flex
                items-end
                justify-between
              "
          >
            <div>
              <p
                className="
                    text-[10px]
                    uppercase
                
                    font-medium
                  "
                style={{ color: colorCode }}
              >
                Related Products
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
                <span style={{ color: colorCode }}>{product.category}</span>
              </h2>
            </div>

            <Link
              to={`/products/page?category=${encodeURIComponent(
                product.category,
              )}`}
              className="
                  hidden
                  sm:block
                  text-xs
                  hover:underline
                "
              style={{ color: colorCode }}
            >
              View All
            </Link>
          </div>

          {/* PRODUCTS */}

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
            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                isCurrentProduct={item._id === product._id}
              />
            ))}
          </div>
        </section>
      )}

      {/* ==================================================
          OTHER BRANDS IN SAME CATEGORY
      ================================================== */}

      {product.category && otherBrandsInCategory.length > 0 && (
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
            {/* SECTION HEADER */}

            <div className="text-center">
              <p
                className="
                    text-[10px]
                    uppercase
                    font-medium
                  "
                style={{ color: colorCode }}
              >
                Explore Brands
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
                Other Brands in{" "}
                <span style={{ color: colorCode }}>{product.category}</span>
              </h2>

              <p
                className="
                    mt-2
                    text-xs
                    sm:text-sm
                    text-gray-500
                  "
              >
                Explore similar products from different brands.
              </p>
            </div>

            {/* BRAND BUTTONS */}

            <div
              className="
                  mt-7
                  flex
                  flex-wrap
                  justify-center
                  gap-3
                "
            >
              {otherBrandsInCategory.map((brand) => {
                const brandId = `brand-${brand
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`;

                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      document.getElementById(brandId)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="
                          px-5
                          py-2.5
                          rounded-full
                          border
                          border-orange-200
                          bg-white
                          text-xs
                          text-gray-700
                          hover:border-[#ff3f34]
                          hover:text-[#ff3f34]
                          transition
                        "
                  >
                    {brand}
                  </button>
                );
              })}
            </div>

            {/* BRAND PRODUCTS */}

            <div
              className="
                  mt-10
                  space-y-12
                "
            >
              {otherBrandsInCategory.map((brand) => {
                const brandProducts = getBrandProducts(brand);

                if (brandProducts.length === 0) {
                  return null;
                }

                const brandId = `brand-${brand
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`;

                return (
                  <div
                    key={brand}
                    id={brandId}
                    className="
                          scroll-mt-24
                        "
                  >
                    {/* BRAND HEADER */}

                    <div
                      className="
                            flex
                            items-center
                            justify-between
                          "
                    >
                      <div>
                        <p
                          className="
                                text-[9px]
                                uppercase
                                font-medium
                              "
                          style={{ color: colorCode }}
                        >
                          {product.category}
                        </p>

                        <h3
                          className="
                                mt-1
                                text-base
                                sm:text-lg
                                font-semibold
                                text-gray-900
                              "
                        >
                          {brand}
                        </h3>
                      </div>

                      <Link
                        to={`/products/page?category=${encodeURIComponent(
                          product.category,
                        )}&brand=${encodeURIComponent(brand)}`}
                        className="
                              text-[11px]
                              sm:text-xs
                              hover:underline
                            "
                        style={{ color: colorCode }}
                      >
                        View All
                      </Link>
                    </div>

                    {/* PRODUCTS */}

                    <div
                      className="
                            mt-5
                            grid
                            grid-cols-2
                            sm:grid-cols-3
                            md:grid-cols-4
                            lg:grid-cols-5
                            gap-4
                          "
                    >
                      {brandProducts.map((item) => (
                        <ProductCard
                          key={item._id}
                          product={item}
                          isCurrentProduct={item._id === product._id}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          OTHER PRODUCT CATEGORIES
      ================================================== */}

      {otherCategories.length > 0 && (
        <section
          className="
            bg-white
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
            {/* HEADER */}

            <div className="text-center">
              <p
                className="
                  text-[10px]
                  uppercase
                  font-medium
                "
                style={{ color: colorCode }}
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
                  text-sm
                  text-gray-500
                "
              >
                Discover more test and measurement solutions from IKONIX.
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
              {otherCategories.map((category) => (
                <Link
                  key={category}
                  to={`/products/page?category=${encodeURIComponent(category)}`}
                  className="
                      px-5
                      py-2.5
                      rounded-full
                      border
                      border-orange-200
                      bg-white
                      text-xs
                      text-gray-700
                      hover:border-[#ff3f34]
                      hover:text-[#ff3f34]
                      transition
                    "
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* CATEGORY PRODUCTS */}

            <div
              className="
                mt-10
                space-y-12
              "
            >
              {otherCategories.slice(0, 4).map((category) => {
                const categoryProducts = getCategoryProducts(category);

                if (categoryProducts.length === 0) {
                  return null;
                }

                return (
                  <div key={category}>
                    {/* CATEGORY HEADER */}

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
                          category,
                        )}`}
                        className="
                              text-[12px]
                              hover:underline
                            "
                        style={{ color: colorCode }}
                      >
                        View All
                      </Link>
                    </div>

                    {/* PRODUCTS */}

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
                      {categoryProducts.map((item) => (
                        <ProductCard key={item._id} product={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
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
            <span style={{ color: colorCode }}>Right Instrument?</span>
          </h2>

          <p
            className="
              mt-2
              text-xs
              text-gray-500
            "
          >
            Contact our team for product information, technical assistance and
            quotations.
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
              text-white
              text-xs
              font-medium
            "
            style={{ backgroundColor: colorCode }}
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

function ProductCard({ product, isCurrentProduct = false }) {
  const getImage = () => {
    if (Array.isArray(product.Image) && product.Image.length > 0) {
      return product.Image[0];
    }

    if (typeof product.Image === "string" && product.Image) {
      return product.Image;
    }

    return "/placeholder-product.png";
  };

  // ======================================================
  // CURRENT PRODUCT CARD
  // ======================================================

  if (isCurrentProduct) {
    return (
      <div
        className="
          group
          bg-white
          rounded-lg
          border-2
          border-[#ff3f34]
          overflow-hidden
          relative
        "
      >
        {/* CURRENT PRODUCT BADGE */}

        <div
          className="
            absolute
            top-2
            left-2
            z-10
            px-2.5
            py-1
            rounded-full
            bg-[#ff3f34]
            text-white
            text-[8px]
            font-semibold
            uppercase
          "
        >
          Current Product
        </div>

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
            alt={product.productName || "Product"}
            className="
              w-full
              h-full
              object-contain
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
                text-[#ff3f34]
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
              text-[#ff3f34]
            "
          >
            AED {Number(product.price || 0).toLocaleString("en-AE")}
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // NORMAL PRODUCT CARD
  // ======================================================

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
          alt={product.productName || "Product"}
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
              text-[#ff3f34]
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
            text-[#ff3f34]
          "
        >
          AED {Number(product.price || 0).toLocaleString("en-AE")}
        </p>
      </div>
    </Link>
  );
}

export default ProductDetails;
