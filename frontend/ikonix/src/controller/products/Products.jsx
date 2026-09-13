import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  PackageOpen,
  X,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://ikonix-backend.vercel.app/api";

const Products = () => {
  const navigate = useNavigate();

  // --------------------------------------------------
  // STATES
  // --------------------------------------------------

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  // --------------------------------------------------
  // GET TOKEN
  // --------------------------------------------------

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/products/getAllProducts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Products Response:", response.data);

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Products Error:", error);

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH BRANDS
  // --------------------------------------------------

  const fetchBrands = async () => {
    try {
      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/brands/getAllBrands`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Brands Response:", response.data);

      setBrands(response.data.brands || response.data || []);
    } catch (error) {
      console.error("Brands Error:", error);

      setBrands([]);
    }
  };

  // --------------------------------------------------
  // USE EFFECT
  // --------------------------------------------------

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  // --------------------------------------------------
  // GET PRODUCT IMAGE
  // --------------------------------------------------

  const getProductImage = (product) => {
    if (!product?.Image) {
      return null;
    }

    if (Array.isArray(product.Image)) {
      return product.Image[0] || null;
    }

    return product.Image;
  };

  // --------------------------------------------------
  // GET CATEGORY NAME
  // --------------------------------------------------

  const getCategoryName = (product) => {
    if (!product?.category) {
      return "—";
    }

    // If category is populated object
    if (typeof product.category === "object") {
      return (
        product.category.name ||
        product.category.categoryName ||
        product.category.CategoryName ||
        "—"
      );
    }

    return product.category;
  };

  // --------------------------------------------------
  // GET BRAND NAME
  // --------------------------------------------------

  const getBrandName = (product) => {
    if (!product?.brandName) {
      return "—";
    }

    if (typeof product.brandName === "object") {
      return (
        product.brandName.name ||
        product.brandName.brandName ||
        product.brandName.BrandName ||
        "—"
      );
    }

    return product.brandName;
  };

  // --------------------------------------------------
  // GET STATUS
  // --------------------------------------------------

  const getProductStatus = (product) => {
    // If backend already provides status
    if (product?.status) {
      return product.status;
    }

    // Fallback based on stock
    if (Number(product?.stock || 0) > 0) {
      return "Active";
    }

    return "Inactive";
  };

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "₹0";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // --------------------------------------------------
  // CATEGORY LIST
  // --------------------------------------------------

  const categoryList = useMemo(() => {
    const categories = products
      .map((product) => getCategoryName(product))
      .filter((category) => category && category !== "—");

    return [...new Set(categories)];
  }, [products]);

  // --------------------------------------------------
  // BRAND LIST
  // --------------------------------------------------

  const brandList = useMemo(() => {
    const productBrands = products
      .map((product) => getBrandName(product))
      .filter((brand) => brand && brand !== "—");

    const backendBrands = brands
      .map((brand) => {
        return (
          brand.brandName ||
          brand.BrandName ||
          brand.name ||
          ""
        );
      })
      .filter(Boolean);

    return [
      ...new Set([
        ...backendBrands,
        ...productBrands,
      ]),
    ];
  }, [products, brands]);

  // --------------------------------------------------
  // FILTER PRODUCTS
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return products.filter((product) => {
      const productName =
        product?.productName?.toLowerCase() || "";

      const modelNumber =
        product?.modelNumber?.toLowerCase() || "";

      const brand =
        getBrandName(product).toLowerCase();

      const category =
        getCategoryName(product).toLowerCase();

      const matchesSearch =
        !searchValue ||
        productName.includes(searchValue) ||
        modelNumber.includes(searchValue) ||
        brand.includes(searchValue) ||
        category.includes(searchValue);

      const matchesCategory =
        selectedCategory === "All Products" ||
        getCategoryName(product) === selectedCategory;

      const matchesBrand =
        selectedBrand === "All Brands" ||
        getBrandName(product) === selectedBrand;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand
      );
    });
  }, [
    products,
    search,
    selectedCategory,
    selectedBrand,
  ]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const endIndex =
    startIndex + productsPerPage;

  const currentProducts =
    filteredProducts.slice(startIndex, endIndex);

  // --------------------------------------------------
  // CHANGE FILTER
  // --------------------------------------------------

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCategoryOpen(false);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setBrandOpen(false);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // EDIT PRODUCT
  // --------------------------------------------------

  const handleEdit = (product) => {
    const id = product?._id || product?.id;

    if (!id) {
      alert("Product ID not found");
      return;
    }

    navigate(`/admin/products/edit/${id}`);
  };

  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  const handleDelete = async () => {
    if (!deleteProduct) {
      return;
    }

    try {
      setDeleting(true);

      const token = getToken();

      const id =
        deleteProduct._id ||
        deleteProduct.id;

      await axios.delete(
        `${API_BASE_URL}/products/deleteproduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) =>
            (product._id || product.id) !== id
        )
      );

      setDeleteProduct(null);

      alert("Product deleted successfully");
    } catch (error) {
      console.error("Delete Product Error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All Products");
    setSelectedBrand("All Brands");
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // PAGE BUTTONS
  // --------------------------------------------------

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`
          w-9 h-9 rounded-lg text-sm font-medium
          transition
          ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400 hover:text-orange-500"
          }
        `}
      >
        {page}
      </button>
    ));
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 md:p-6">
      {/* ------------------------------------------- */}
      {/* PAGE HEADER */}
      {/* ------------------------------------------- */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Products
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products/AddProduct")}
          className="
            flex items-center justify-center gap-2
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-lg
            text-sm
            font-medium
            transition
            shadow-sm
          "
        >
          <Plus size={18} />

          Add Product
        </button>
      </div>

      {/* ------------------------------------------- */}
      {/* MAIN CARD */}
      {/* ------------------------------------------- */}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-visible">
        {/* ----------------------------------------- */}
        {/* TOOLBAR */}
        {/* ----------------------------------------- */}

        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800">
                All Products
              </h2>

              <span className="text-sm text-gray-400">
                ({filteredProducts.length})
              </span>
            </div>

            {/* RIGHT FILTERS */}
            <div className="flex flex-wrap items-center gap-3">
              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={16}
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
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="
                    w-full
                    sm:w-56
                    h-10
                    pl-9
                    pr-3
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    text-gray-700
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                  "
                />
              </div>

              {/* CATEGORY FILTER */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCategoryOpen(!categoryOpen);
                    setBrandOpen(false);
                  }}
                  className="
                    h-10
                    min-w-[145px]
                    px-4
                    rounded-full
                    border
                    border-orange-300
                    bg-white
                    text-sm
                    text-gray-700
                    flex
                    items-center
                    justify-between
                    gap-4
                    hover:bg-orange-50
                  "
                >
                  <span className="truncate max-w-[100px]">
                    {selectedCategory}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`
                      transition-transform
                      ${
                        categoryOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {categoryOpen && (
                  <div className="absolute right-0 top-12 z-50 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                    <button
                      onClick={() =>
                        handleCategoryChange(
                          "All Products"
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-2.5
                        text-sm
                        hover:bg-orange-50
                      "
                    >
                      All Products
                    </button>

                    {categoryList.map(
                      (category, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleCategoryChange(
                              category
                            )
                          }
                          className="
                            w-full
                            text-left
                            px-4
                            py-2.5
                            text-sm
                            hover:bg-orange-50
                          "
                        >
                          {category}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* BRAND FILTER */}
              <div className="relative">
                <button
                  onClick={() => {
                    setBrandOpen(!brandOpen);
                    setCategoryOpen(false);
                  }}
                  className="
                    h-10
                    min-w-[130px]
                    px-4
                    rounded-full
                    border
                    border-orange-300
                    bg-white
                    text-sm
                    text-gray-700
                    flex
                    items-center
                    justify-between
                    gap-4
                    hover:bg-orange-50
                  "
                >
                  <span className="truncate max-w-[90px]">
                    {selectedBrand}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`
                      transition-transform
                      ${
                        brandOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {brandOpen && (
                  <div className="absolute right-0 top-12 z-50 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                    <button
                      onClick={() =>
                        handleBrandChange(
                          "All Brands"
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-2.5
                        text-sm
                        hover:bg-orange-50
                      "
                    >
                      All Brands
                    </button>

                    {brandList.map(
                      (brand, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleBrandChange(
                              brand
                            )
                          }
                          className="
                            w-full
                            text-left
                            px-4
                            py-2.5
                            text-sm
                            hover:bg-orange-50
                          "
                        >
                          {brand}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------- */}
        {/* TABLE */}
        {/* ----------------------------------------- */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            {/* TABLE HEADER */}
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 w-14">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                  Brand
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                  Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {/* LOADING */}
              {loading && (
                <>
                  {Array.from({ length: 6 }).map(
                    (_, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100"
                      >
                        <td className="px-5 py-5">
                          <div className="h-3 w-4 bg-gray-200 rounded animate-pulse" />
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gray-200 rounded-lg animate-pulse" />

                            <div>
                              <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />

                              <div className="h-2 w-24 bg-gray-200 rounded mt-2 animate-pulse" />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </td>

                        <td className="px-5 py-5">
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                        </td>

                        <td className="px-5 py-5">
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                        </td>

                        <td className="px-5 py-5">
                          <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
                        </td>

                        <td className="px-5 py-5">
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-center gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </>
              )}

              {/* EMPTY */}
              {!loading &&
                currentProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-20 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                          <PackageOpen
                            size={30}
                            className="text-orange-500"
                          />
                        </div>

                        <h3 className="text-base font-semibold text-gray-800">
                          No products found
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Try changing your search
                          or filters.
                        </p>

                        <button
                          onClick={clearFilters}
                          className="
                            mt-4
                            text-sm
                            text-orange-500
                            hover:text-orange-600
                            font-medium
                          "
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

              {/* PRODUCTS */}
              {!loading &&
                currentProducts.map(
                  (product, index) => {
                    const image =
                      getProductImage(product);

                    const status =
                      getProductStatus(product);

                    const productId =
                      product._id ||
                      product.id;

                    return (
                      <tr
                        key={productId || index}
                        className="
                          border-b
                          border-gray-100
                          hover:bg-orange-50/30
                          transition
                        "
                      >
                        {/* NUMBER */}
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {startIndex + index + 1}
                        </td>

                        {/* PRODUCT */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {/* IMAGE */}
                            <div
                              className="
                                w-11
                                h-11
                                rounded-lg
                                bg-gray-50
                                border
                                border-gray-100
                                flex
                                items-center
                                justify-center
                                overflow-hidden
                                flex-shrink-0
                              "
                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={
                                    product.productName ||
                                    "Product"
                                  }
                                  className="
                                    w-full
                                    h-full
                                    object-contain
                                  "
                                  onError={(e) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <PackageOpen
                                  size={20}
                                  className="text-gray-300"
                                />
                              )}
                            </div>

                            {/* NAME */}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate max-w-[220px]">
                                {product.productName ||
                                  "Unnamed Product"}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                SKU:{" "}
                                {product.modelNumber ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {getCategoryName(product)}
                        </td>

                        {/* BRAND */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {getBrandName(product)}
                        </td>

                        {/* PRICE */}
                        <td className="px-5 py-4 text-sm font-medium text-gray-700">
                          {formatPrice(
                            product.price
                          )}
                        </td>

                        {/* STOCK */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {product.stock ?? 0}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          {status === "Active" ? (
                            <span
                              className="
                                inline-flex
                                items-center
                                justify-center
                                min-w-[65px]
                                px-3
                                py-1.5
                                rounded-md
                                bg-green-500
                                text-white
                                text-xs
                                font-medium
                              "
                            >
                              Active
                            </span>
                          ) : (
                            <span
                              className="
                                inline-flex
                                items-center
                                justify-center
                                min-w-[65px]
                                px-3
                                py-1.5
                                rounded-md
                                bg-red-600
                                text-white
                                text-xs
                                font-medium
                              "
                            >
                              In Active
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-4">
                            {/* EDIT */}
                            <button
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                              title="Edit Product"
                              className="
                                text-blue-500
                                hover:text-blue-700
                                transition
                              "
                            >
                              <Pencil
                                size={17}
                                strokeWidth={2}
                              />
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                setDeleteProduct(
                                  product
                                )
                              }
                              title="Delete Product"
                              className="
                                text-red-500
                                hover:text-red-700
                                transition
                              "
                            >
                              <Trash2
                                size={17}
                                strokeWidth={2}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>

        {/* ----------------------------------------- */}
        {/* FOOTER / PAGINATION */}
        {/* ----------------------------------------- */}

        {!loading &&
          filteredProducts.length > 0 && (
            <div
              className="
                px-5
                py-4
                border-t
                border-gray-100
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
              "
            >
              {/* RESULT COUNT */}
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700">
                  {Math.min(
                    endIndex,
                    filteredProducts.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              {/* PAGINATION */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.max(prev - 1, 1)
                    )
                  }
                  className="
                    w-9
                    h-9
                    rounded-lg
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    hover:border-orange-400
                    hover:text-orange-500
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >
                  ‹
                </button>

                {renderPagination()}

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                    )
                  }
                  className="
                    w-9
                    h-9
                    rounded-lg
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    hover:border-orange-400
                    hover:text-orange-500
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >
                  ›
                </button>
              </div>
            </div>
          )}
      </div>

      {/* ------------------------------------------- */}
      {/* DELETE MODAL */}
      {/* ------------------------------------------- */}

      {deleteProduct && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              bg-white
              w-full
              max-w-md
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >
            {/* MODAL HEADER */}
            <div className="px-6 pt-6">
              <div className="flex items-start justify-between">
                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-red-50
                    flex
                    items-center
                    justify-center
                  "
                >
                  <AlertTriangle
                    size={24}
                    className="text-red-500"
                  />
                </div>

                <button
                  onClick={() =>
                    setDeleteProduct(null)
                  }
                  className="
                    text-gray-400
                    hover:text-gray-600
                  "
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-5">
                Delete Product?
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-800">
                  {deleteProduct.productName ||
                    "this product"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* MODAL ACTIONS */}
            <div className="px-6 py-5 mt-2 flex justify-end gap-3">
              <button
                disabled={deleting}
                onClick={() =>
                  setDeleteProduct(null)
                }
                className="
                  px-5
                  py-2.5
                  rounded-lg
                  border
                  border-gray-200
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={handleDelete}
                className="
                  px-5
                  py-2.5
                  rounded-lg
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  text-sm
                  font-medium
                  disabled:opacity-50
                "
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;