import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Search, Package, Loader2, X } from "lucide-react";

// const API = "https://ikonix-backend.vercel.app/api";
const API = "http://localhost:5000/api";
// ==========================================
// GET CATEGORY NAME
// ==========================================

const getCategoryName = (product) => {
  const value =
    product.category ?? product.categoryName ?? product.CategoryName;

  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    return (value.category ?? value.categoryName ?? value.name ?? "")
      .toString()
      .trim();
  }

  return "";
};

// ==========================================
// GET PRODUCT NAME
// ==========================================

const getProductName = (product) =>
  product.productName ??
  product.name ??
  product.title ??
  product.ProductName ??
  "Product";

// ==========================================
// GET PRODUCT IMAGE
// ==========================================

const getProductImage = (product) => {
  const image =
    product.Image ??
    product.image ??
    product.productImage ??
    product.imageUrl ??
    product.Images ??
    product.images ??
    product.productImages ??
    product.thumbnail;

  if (typeof image === "string") {
    return image;
  }

  if (Array.isArray(image)) {
    const firstImage = image[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage && typeof firstImage === "object") {
      return firstImage.url ?? firstImage.secure_url ?? firstImage.image ?? "";
    }
  }

  if (image && typeof image === "object") {
    return image.url ?? image.secure_url ?? image.image ?? "";
  }

  return "";
};

// ==========================================
// GET BRAND NAME
// ==========================================

const getBrandName = (product) => {
  if (typeof product.brandName === "string") {
    return product.brandName;
  }

  if (typeof product.brand === "string") {
    return product.brand;
  }

  return (
    product.brand?.brandName ?? product.brand?.name ?? product.brandName ?? ""
  );
};

// ==========================================
// GET PRODUCT PRICE
// ==========================================

const getProductPrice = (product) =>
  product.price ?? product.productPrice ?? product.salePrice ?? null;

// ==========================================
// PRODUCT CARD
// ==========================================

const ProductCard = ({ product, onSelect }) => {
  const image = getProductImage(product);
  const price = getProductPrice(product);

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group w-full overflow-hidden rounded-xl border border-gray-200 bg-white
      text-left transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-white">
        {image ? (
          <img
            src={image}
            alt={getProductName(product)}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={45} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col items-start justify-between gap-1">
        <p className="text-xs font-semibold uppercase text-orange-600">
          {getCategoryName(product)}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold text-gray-800 ">
          {getProductName(product)}
        </h3>

        {price !== null && price !== undefined && (
          <p className="mt-3 font-bold text-gray-900">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>
        )}

        <span className="mt-3 w-full rounded-md border border-[#e85d04] px-2 py-2 text-center text-[10px] font-medium text-[#e85d04]
          transition group-hover:bg-[#e85d04] group-hover:text-white sm:text-xs">
          View Details
        </span>
      </div>
    </button>
  );
};

// ==========================================
// CATEGORY PRODUCTS PAGE
// ==========================================

function CategorieProducts() {
  const { categoryId } = useParams();

  // ==========================================
  // STATES
  // ==========================================

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ==========================================
  // FETCH CATEGORIES AND PRODUCTS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/products/getAllProducts`),
        ]);

        const categoryData = categoryResponse.data;
        const productData = productResponse.data;

        const categoryList = Array.isArray(categoryData)
          ? categoryData
          : categoryData?.categories || [];

        const productList = Array.isArray(productData)
          ? productData
          : productData?.products || [];

        if (isMounted) {
          setCategories(categoryList);
          setProducts(productList);
        }
      } catch (err) {
        console.error(
          "Category products error:",
          err.response?.data || err.message,
        );

        if (isMounted) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // FIND SELECTED CATEGORY
  // ==========================================

  const selectedCategory = useMemo(
    () => categories.find((category) => category._id === categoryId),
    [categories, categoryId],
  );

  const selectedCategoryName = selectedCategory?.category || "";

  // ==========================================
  // FILTER PRODUCTS BY CATEGORY
  // ALL BRANDS
  // ==========================================

  const categoryProducts = useMemo(() => {
    if (!selectedCategoryName) return [];

    return products.filter(
      (product) =>
        getCategoryName(product).toLowerCase() ===
        selectedCategoryName.toLowerCase(),
    );
  }, [products, selectedCategoryName]);

  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) =>
      getProductName(product).toLowerCase().includes(search.toLowerCase()),
    );
  }, [categoryProducts, search]);

  // ==========================================
  // RECOMMENDED PRODUCTS
  // ==========================================

  const recommendedProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          getCategoryName(product).toLowerCase() !==
          selectedCategoryName.toLowerCase(),
      )
      .slice(0, 8);
  }, [products, selectedCategoryName]);

  // ==========================================
  // POPUP ESCAPE AND SCROLL EFFECT
  // IMPORTANT: KEEP BEFORE CONDITIONAL RETURNS
  // ==========================================

  useEffect(() => {
    if (!selectedProduct) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProduct]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />

        <p className="mt-3 text-gray-500">Loading category products...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ==========================================
  // CATEGORY NOT FOUND
  // ==========================================

  if (!selectedCategory) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Package size={50} className="text-gray-300" />

        <h2 className="mt-4 text-xl font-bold">Category not found</h2>

        <Link to="/categories" className="mt-4 text-orange-600 hover:underline">
          Back to Categories
        </Link>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* CATEGORY HEADER */}
      <section className="bg-orange-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
            IKONIX / Categories
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {selectedCategoryName}
          </h1>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Explore {selectedCategoryName} products from different brands.
          </p>

          <p className="mt-3 text-sm font-semibold text-orange-600">
            {categoryProducts.length} Products Available
          </p>
        </div>
      </section>

      {/* CATEGORY PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategoryName} Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products from all available brands
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 sm:w-80">
            <Search size={18} className="text-gray-400" />

            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none"
            />
          </div>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={50} className="mx-auto text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No products found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              No products are available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>

    
{/* RECOMMENDED PRODUCTS */}
{recommendedProducts.length > 0 && (
  <section className="border-t border-gray-100 bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">

      {/* SECTION HEADER */}
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-orange-600">
          Discover More
        </p>

        <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
          You May Also Like
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Explore more instruments and products from IKONIX.
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

        {recommendedProducts.map((product) => (
          <button
            key={product._id}
            type="button"
            onClick={() => setSelectedProduct(product)}
            className="group min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
          >

            {/* PRODUCT IMAGE */}
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-white p-3">
              {getProductImage(product) ? (
                <img
                  src={getProductImage(product)}
                  alt={getProductName(product)}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Package size={35} className="text-gray-300" />
              )}
            </div>

            {/* PRODUCT DETAILS */}
            <div className="p-3">

              {/* BRAND */}
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-orange-600 sm:text-xs">
                {getBrandName(product)}
              </p>

              {/* PRODUCT NAME */}
              <h3 className="mt-1 line-clamp-2 min-h-9 text-xs font-semibold leading-5 text-gray-800 sm:text-sm">
                {getProductName(product)}
              </h3>

              {/* CATEGORY */}
              <p className="mt-2 truncate text-[10px] text-gray-500 sm:text-xs">
                Category:{" "}
                <span className="font-medium text-gray-700">
                  {getCategoryName(product) || "Other"}
                </span>
              </p>

              {/* PRICE */}
              {getProductPrice(product) !== null &&
                getProductPrice(product) !== undefined && (
                  <p className="mt-2 text-sm font-bold text-gray-900">
                    ₹{Number(
                      getProductPrice(product)
                    ).toLocaleString("en-IN")}
                  </p>
                )}

              {/* VIEW DETAILS */}
              <div className="mt-3 w-full rounded-md border border-[#e85d04] px-2 py-2 text-center text-[10px] font-medium text-[#e85d04]
          transition group-hover:bg-[#e85d04] group-hover:text-white sm:text-xs">
                View Details
              </div>

            </div>
          </button>
        ))}

      </div>
    </div>
  </section>
)}


      {/* =====================================
          PRODUCT GLASS POPUP
      ===================================== */}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8 backdrop-blur-md"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product details"
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white/97 shadow-2xl backdrop-blur-2xl"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:bg-orange-500 hover:text-white"
              aria-label="Close product details"
            >
              <X size={21} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* PRODUCT IMAGE */}
              <div className="flex min-h-[300px] items-center justify-center bg-white/90 p-8 md:min-h-[500px]">
                {getProductImage(selectedProduct) ? (
                  <img
                    src={getProductImage(selectedProduct)}
                    alt={getProductName(selectedProduct)}
                    className="max-h-[420px] w-full object-contain"
                  />
                ) : (
                  <Package size={100} className="text-gray-300" />
                )}
              </div>

              {/* PRODUCT INFORMATION */}
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-600">
                  {getBrandName(selectedProduct)}
                </p>

                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  {getProductName(selectedProduct)}
                </h2>

                <div className="my-6 h-px bg-gray-200" />

                {/* CATEGORY */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Category
                  </p>

                  <p className="mt-1 text-base font-medium text-gray-800">
                    {getCategoryName(selectedProduct) || "Not specified"}
                  </p>
                </div>

                {/* PRICE */}
                {getProductPrice(selectedProduct) !== null &&
                  getProductPrice(selectedProduct) !== undefined && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Price
                      </p>

                      <p className="mt-1 text-2xl font-bold text-orange-600">
                        ₹
                        {Number(
                          getProductPrice(selectedProduct),
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}

                {/* DESCRIPTION */}
                {selectedProduct.description && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* ADDITIONAL INFORMATION */}
                <div className="mb-7 rounded-xl border border-gray-100 bg-white/70 p-4">
                  <p className="text-sm text-gray-600 overflow-y-scroll max-h-32">
                   {selectedProduct.productDescription}
                  </p>
                </div>

                {/* CLOSE BUTTON */}
                <a
                  href={`mailto:info@ikonixinstruments.com?subject=${encodeURIComponent(
                    `Product Enquiry - ${getProductName(selectedProduct)}`,
                  )}&body=${encodeURIComponent(
                    `Hello IKONIX Team,

I would like to enquire about the following product:

Product: ${getProductName(selectedProduct)}
Brand: ${getBrandName(selectedProduct)}

Please share more details and pricing.

Thank you.`,
                  )}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-3.5 font-semibold
                   text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-700"
                >
                  <icon name="mail" size="lg" />
                 <span className="text-2xl">📧</span> Send Product Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CategorieProducts;
