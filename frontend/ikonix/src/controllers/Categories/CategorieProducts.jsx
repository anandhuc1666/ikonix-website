
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Package,
  Loader2,
} from "lucide-react";

const API = "https://ikonix-backend.vercel.app/api";

// ==========================================
// GET CATEGORY NAME
// ==========================================

const getCategoryName = (product) => {
  const value =
    product.category ??
    product.categoryName ??
    product.CategoryName;

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object" && value !== null) {
    return (
      value.category ??
      value.categoryName ??
      value.name ??
      ""
    ).toString().trim();
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

    if (typeof firstImage === "object" && firstImage !== null) {
      return (
        firstImage.url ||
        firstImage.secure_url ||
        firstImage.image ||
        ""
      );
    }
  }

  if (typeof image === "object" && image !== null) {
    return (
      image.url ||
      image.secure_url ||
      image.image ||
      ""
    );
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
    product.brand?.brandName ??
    product.brand?.name ??
    product.brandName ??
    ""
  );
};

// ==========================================
// GET PRODUCT PRICE
// ==========================================

const getProductPrice = (product) =>
  product.price ??
  product.productPrice ??
  product.salePrice ??
  null;

// ==========================================
// PRODUCT CARD
// ==========================================

const ProductCard = ({ product }) => {
  const image = getProductImage(product);
  const price = getProductPrice(product);

  return (
    <Link
      to={`/product/${product._id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
    >
      {/* Product Image */}
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

      {/* Product Details */}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase text-orange-600">
          {getBrandName(product)}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold text-gray-800 group-hover:text-orange-600">
          {getProductName(product)}
        </h3>

        {price !== null && price !== undefined && (
          <p className="mt-3 font-bold text-gray-900">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
          View Details
          <ArrowRight
            size={15}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
};

// ==========================================
// CATEGORY PRODUCTS PAGE
// ==========================================

function CategorieProducts() {
  const { categoryId } = useParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CATEGORIES AND PRODUCTS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] =
          await Promise.all([
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
          err.response?.data || err.message
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
    () =>
      categories.find(
        (category) => category._id === categoryId
      ),
    [categories, categoryId]
  );

  const selectedCategoryName =
    selectedCategory?.category || "";

  // ==========================================
  // FILTER PRODUCTS BY CATEGORY
  // ALL BRANDS
  // ==========================================

  const categoryProducts = useMemo(() => {
    if (!selectedCategoryName) return [];

    return products.filter((product) => {
      return (
        getCategoryName(product).toLowerCase() ===
        selectedCategoryName.toLowerCase()
      );
    });
  }, [products, selectedCategoryName]);

  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) =>
      getProductName(product)
        .toLowerCase()
        .includes(search.toLowerCase())
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
          selectedCategoryName.toLowerCase()
      )
      .slice(0, 8);
  }, [products, selectedCategoryName]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2
          className="animate-spin text-orange-500"
          size={40}
        />

        <p className="mt-3 text-gray-500">
          Loading category products...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ==========================================
  // CATEGORY NOT FOUND
  // ==========================================

  if (!selectedCategory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Package size={50} className="text-gray-300" />

        <h2 className="mt-4 text-xl font-bold">
          Category not found
        </h2>

        <Link
          to="/categories"
          className="mt-4 text-orange-600 hover:underline"
        >
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
            <Package
              size={50}
              className="mx-auto text-gray-300"
            />

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
              />
            ))}

          </div>

        )}

      </section>

      {/* RECOMMENDED PRODUCTS */}
      {recommendedProducts.length > 0 && (

        <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="mb-8">

              <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                Discover More
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                You May Also Like
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Explore more instruments and products from IKONIX.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">

              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>

          </div>

        </section>

      )}

    </main>
  );
}

export default CategorieProducts;
