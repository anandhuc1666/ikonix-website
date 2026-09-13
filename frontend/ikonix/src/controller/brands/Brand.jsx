import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const Brands = () => {
  const navigate = useNavigate();

  // ------------------------------------------------
  // STATES
  // ------------------------------------------------

  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("All Brands");

  const [statusOpen, setStatusOpen] =
    useState(false);

  const [deleteBrand, setDeleteBrand] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const brandsPerPage = 7;

  // ------------------------------------------------
  // TOKEN
  // ------------------------------------------------

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ------------------------------------------------
  // FETCH BRANDS
  // ------------------------------------------------

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/brands/getAllBrands`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Brands Response:",
        response.data
      );

      setBrands(
        response.data.brands ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(
        "Fetch Brands Error:",
        error
      );

      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // LOAD
  // ------------------------------------------------

  useEffect(() => {
    fetchBrands();
  }, []);

  // ------------------------------------------------
  // FORMAT DATE
  // ------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const formattedDate =
      new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    return formattedDate;
  };

  // ------------------------------------------------
  // BRAND IMAGE
  // ------------------------------------------------

  const getBrandImage = (brand) => {
    if (!brand?.Image) {
      return null;
    }

    if (Array.isArray(brand.Image)) {
      return brand.Image[0] || null;
    }

    return brand.Image;
  };

  // ------------------------------------------------
  // PRODUCT COUNT
  // ------------------------------------------------

  const getProductCount = (brand) => {
    if (
      typeof brand.products === "number"
    ) {
      return brand.products;
    }

    if (
      typeof brand.Products === "number"
    ) {
      return brand.Products;
    }

    return 0;
  };

  // ------------------------------------------------
  // FILTER
  // ------------------------------------------------

  const filteredBrands = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return brands.filter((brand) => {
      const brandName =
        (
          brand.brandName ||
          brand.BrandName ||
          ""
        ).toLowerCase();

      const status =
        brand.status || "Active";

      const matchesSearch =
        !value ||
        brandName.includes(value);

      const matchesStatus =
        selectedStatus === "All Brands" ||
        status === selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    brands,
    search,
    selectedStatus,
  ]);

  // ------------------------------------------------
  // PAGINATION
  // ------------------------------------------------

  const totalPages = Math.ceil(
    filteredBrands.length /
      brandsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    brandsPerPage;

  const endIndex =
    startIndex + brandsPerPage;

  const currentBrands =
    filteredBrands.slice(
      startIndex,
      endIndex
    );

  // ------------------------------------------------
  // SEARCH
  // ------------------------------------------------

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ------------------------------------------------
  // STATUS FILTER
  // ------------------------------------------------

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setStatusOpen(false);
    setCurrentPage(1);
  };

  // ------------------------------------------------
  // EDIT
  // ------------------------------------------------

  const handleEdit = (brand) => {
    const id =
      brand._id || brand.id;

    if (!id) {
      alert("Brand ID not found");
      return;
    }

    navigate(
      `/admin/brands/edit/${id}`
    );
  };

  // ------------------------------------------------
  // DELETE
  // ------------------------------------------------

  const handleDelete = async () => {
    if (!deleteBrand) {
      return;
    }

    try {
      setDeleting(true);

      const token = getToken();

      const id =
        deleteBrand._id ||
        deleteBrand.id;

      await axios.delete(
        `${API_BASE_URL}/brands/deleteBrand/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setBrands((previous) =>
        previous.filter(
          (brand) =>
            (brand._id || brand.id) !== id
        )
      );

      setDeleteBrand(null);

      alert(
        "Brand deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Brand Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete brand"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ------------------------------------------------
  // CLEAR
  // ------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setSelectedStatus("All Brands");
    setCurrentPage(1);
  };

  // ------------------------------------------------
  // PAGINATION
  // ------------------------------------------------

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    ).map((page) => (
      <button
        key={page}
        onClick={() =>
          setCurrentPage(page)
        }
        className={`
          w-9
          h-9
          rounded-lg
          text-sm
          font-medium
          transition
          ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
          }
        `}
      >
        {page}
      </button>
    ));
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 md:p-6">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Brands
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your product brands
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/admin/brands/add")
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-lg
            text-sm
            font-medium
            transition
          "
        >
          <Plus size={18} />

          Add Brand
        </button>
      </div>

      {/* ========================================= */}
      {/* MAIN CARD */}
      {/* ========================================= */}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-visible">

        {/* ======================================= */}
        {/* TOOLBAR */}
        {/* ======================================= */}

        <div className="px-5 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* LEFT */}

            <div className="flex items-center gap-2">

              <h2 className="text-sm font-semibold text-gray-800">
                All Brands
              </h2>

              <span className="text-sm text-gray-400">
                ({filteredBrands.length})
              </span>

            </div>

            {/* RIGHT */}

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
                  placeholder="Search brands..."
                  className="
                    w-56
                    h-10
                    pl-9
                    pr-3
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                  "
                />

              </div>

              {/* FILTER */}

              <div className="relative">

                <button
                  onClick={() =>
                    setStatusOpen(
                      !statusOpen
                    )
                  }
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

                  <span>
                    {selectedStatus}
                  </span>

                  <ChevronDown
                    size={16}
                    className={
                      statusOpen
                        ? "rotate-180"
                        : ""
                    }
                  />

                </button>

                {statusOpen && (
                  <div className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-44
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-xl
                    py-2
                  ">

                    <button
                      onClick={() =>
                        handleStatusChange(
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

                    <button
                      onClick={() =>
                        handleStatusChange(
                          "Active"
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
                      Active
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          "Inactive"
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
                      Inactive
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ======================================= */}
        {/* TABLE */}
        {/* ======================================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            {/* HEADER */}

            <thead>

              <tr className="border-b border-gray-200">

                <th className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-gray-600
                  w-14
                ">
                  #
                </th>

                <th className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-gray-600
                ">
                  Brand Name
                </th>

                <th className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-gray-600
                ">
                  Products
                </th>

                <th className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-gray-600
                ">
                  Status
                </th>

                <th className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-gray-600
                ">
                  Created At
                </th>

                <th className="
                  px-5
                  py-4
                  text-center
                  text-xs
                  font-semibold
                  text-gray-600
                ">
                  Actions
                </th>

              </tr>

            </thead>

            {/* BODY */}

            <tbody>

              {/* LOADING */}

              {loading &&
                Array.from({
                  length: 7,
                }).map((_, index) => (

                  <tr
                    key={index}
                    className="border-b border-gray-100"
                  >

                    <td className="px-5 py-5">
                      <div className="
                        h-3
                        w-4
                        bg-gray-200
                        rounded
                        animate-pulse
                      " />
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">

                        <div className="
                          w-12
                          h-10
                          rounded-lg
                          bg-gray-200
                          animate-pulse
                        " />

                        <div>
                          <div className="
                            h-3
                            w-28
                            bg-gray-200
                            rounded
                            animate-pulse
                          " />
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="
                        h-3
                        w-10
                        bg-gray-200
                        rounded
                        animate-pulse
                      " />
                    </td>

                    <td className="px-5 py-5">
                      <div className="
                        h-6
                        w-14
                        bg-gray-200
                        rounded
                        animate-pulse
                      " />
                    </td>

                    <td className="px-5 py-5">
                      <div className="
                        h-3
                        w-24
                        bg-gray-200
                        rounded
                        animate-pulse
                      " />
                    </td>

                    <td className="px-5 py-5">
                      <div className="
                        h-6
                        w-14
                        bg-gray-200
                        rounded
                        animate-pulse
                      " />
                    </td>

                  </tr>

                ))}

              {/* EMPTY */}

              {!loading &&
                currentBrands.length === 0 && (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-20 text-center"
                    >

                      <div className="
                        flex
                        flex-col
                        items-center
                      ">

                        <div className="
                          w-16
                          h-16
                          rounded-full
                          bg-orange-50
                          flex
                          items-center
                          justify-center
                          mb-4
                        ">
                          <ImageIcon
                            size={28}
                            className="text-orange-500"
                          />
                        </div>

                        <h3 className="
                          text-base
                          font-semibold
                          text-gray-800
                        ">
                          No brands found
                        </h3>

                        <p className="
                          text-sm
                          text-gray-500
                          mt-1
                        ">
                          Try changing your search
                          or filter.
                        </p>

                        <button
                          onClick={
                            clearFilters
                          }
                          className="
                            mt-4
                            text-sm
                            text-orange-500
                            font-medium
                          "
                        >
                          Clear Filters
                        </button>

                      </div>

                    </td>

                  </tr>

                )}

              {/* DATA */}

              {!loading &&
                currentBrands.map(
                  (brand, index) => {

                    const image =
                      getBrandImage(
                        brand
                      );

                    const brandName =
                      brand.brandName ||
                      brand.BrandName ||
                      "Unnamed Brand";

                    const status =
                      brand.status ||
                      "Active";

                    return (

                      <tr
                        key={
                          brand._id ||
                          brand.id ||
                          index
                        }
                        className="
                          border-b
                          border-gray-100
                          hover:bg-orange-50/30
                          transition
                        "
                      >

                        {/* NUMBER */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-gray-700
                        ">
                          {startIndex +
                            index +
                            1}
                        </td>

                        {/* BRAND */}

                        <td className="px-5 py-4">

                          <div className="
                            flex
                            items-center
                            gap-4
                          ">

                            {/* LOGO */}

                            <div className="
                              w-12
                              h-10
                              rounded-lg
                              bg-white
                              border
                              border-gray-100
                              flex
                              items-center
                              justify-center
                              overflow-hidden
                              flex-shrink-0
                            ">

                              {image ? (

                                <img
                                  src={image}
                                  alt={brandName}
                                  className="
                                    max-w-full
                                    max-h-full
                                    object-contain
                                  "
                                />

                              ) : (

                                <span className="
                                  text-xs
                                  font-semibold
                                  text-gray-300
                                ">
                                  LOGO
                                </span>

                              )}

                            </div>

                            {/* NAME */}

                            <div>

                              <p className="
                                text-sm
                                font-medium
                                text-gray-800
                              ">
                                {brandName}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PRODUCTS */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-gray-600
                        ">
                          {getProductCount(
                            brand
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          {status ===
                          "Active" ? (

                            <span className="
                              inline-flex
                              px-2.5
                              py-1
                              rounded-md
                              bg-green-100
                              text-green-600
                              text-xs
                              font-medium
                            ">
                              Active
                            </span>

                          ) : (

                            <span className="
                              inline-flex
                              px-2.5
                              py-1
                              rounded-md
                              bg-red-100
                              text-red-500
                              text-xs
                              font-medium
                            ">
                              In Active
                            </span>

                          )}

                        </td>

                        {/* DATE */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-gray-600
                        ">
                          {formatDate(
                            brand.Date ||
                            brand.createdAt
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="
                            flex
                            items-center
                            justify-center
                            gap-5
                          ">

                            <button
                              onClick={() =>
                                handleEdit(
                                  brand
                                )
                              }
                              className="
                                text-blue-500
                                hover:text-blue-700
                                transition
                              "
                              title="Edit"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteBrand(
                                  brand
                                )
                              }
                              className="
                                text-red-500
                                hover:text-red-700
                                transition
                              "
                              title="Delete"
                            >
                              <Trash2
                                size={16}
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

        {/* ======================================= */}
        {/* PAGINATION */}
        {/* ======================================= */}

        {!loading &&
          filteredBrands.length > 0 && (

            <div className="
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
            ">

              <p className="
                text-sm
                text-gray-500
              ">

                Showing{" "}

                <span className="
                  font-medium
                  text-gray-700
                ">
                  {startIndex + 1}
                </span>

                {" "}to{" "}

                <span className="
                  font-medium
                  text-gray-700
                ">
                  {Math.min(
                    endIndex,
                    filteredBrands.length
                  )}
                </span>

                {" "}of{" "}

                <span className="
                  font-medium
                  text-gray-700
                ">
                  {filteredBrands.length}
                </span>

                {" "}brands

              </p>

              <div className="
                flex
                items-center
                gap-2
              ">

                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  className="
                    w-9
                    h-9
                    rounded-lg
                    border
                    border-gray-200
                    text-gray-500
                    disabled:opacity-40
                  "
                >
                  ‹
                </button>

                {renderPagination()}

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          page + 1,
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
                    text-gray-500
                    disabled:opacity-40
                  "
                >
                  ›
                </button>

              </div>

            </div>

          )}

      </div>

      {/* ========================================= */}
      {/* DELETE MODAL */}
      {/* ========================================= */}

      {deleteBrand && (

        <div className="
          fixed
          inset-0
          z-[100]
          bg-black/40
          flex
          items-center
          justify-center
          p-4
        ">

          <div className="
            bg-white
            w-full
            max-w-md
            rounded-2xl
            shadow-2xl
          ">

            <div className="p-6">

              <div className="
                flex
                items-start
                justify-between
              ">

                <div className="
                  w-12
                  h-12
                  rounded-full
                  bg-red-50
                  flex
                  items-center
                  justify-center
                ">
                  <AlertTriangle
                    size={24}
                    className="text-red-500"
                  />
                </div>

                <button
                  onClick={() =>
                    setDeleteBrand(null)
                  }
                  className="
                    text-gray-400
                    hover:text-gray-600
                  "
                >
                  <X size={20} />
                </button>

              </div>

              <h3 className="
                text-lg
                font-semibold
                text-gray-900
                mt-5
              ">
                Delete Brand?
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-2
                leading-6
              ">
                Are you sure you want to
                delete{" "}

                <span className="
                  font-medium
                  text-gray-800
                ">
                  {deleteBrand.brandName ||
                    deleteBrand.BrandName}
                </span>
                ?
                <br />
                This action cannot be undone.
              </p>

              <div className="
                flex
                justify-end
                gap-3
                mt-6
              ">

                <button
                  disabled={deleting}
                  onClick={() =>
                    setDeleteBrand(null)
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
                  "
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Brand"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Brands;