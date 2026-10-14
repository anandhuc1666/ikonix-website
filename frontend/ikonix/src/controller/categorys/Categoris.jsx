

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

// Change this path to match your project.
const API_BASE_URL = "https://ikonix-backend.vercel.app/api";

const PAGE_SIZE = 8;

const Categoris = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: "",
  });

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw new Error("Admin login required. Please log in again.");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH BRANDS
  // ==========================================

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/brands/getAllBrands`,
        getAuthConfig()
      );

      const data =
        response.data?.brands ??
        response.data?.data ??
        response.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid brand data received from the server.");
      }

      setBrands(data);
    } catch (error) {
      console.error("Fetch brands error:", error);

      alert(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // ==========================================
  // BUILD UNIQUE CATEGORY LIST
  // ==========================================

  const categories = useMemo(() => {
    const categoryMap = new Map();

    brands.forEach((brand) => {
      const names = Array.isArray(brand.category)
        ? brand.category
        : typeof brand.category === "string"
          ? [brand.category]
          : [];

      names.forEach((rawName) => {
        if (typeof rawName !== "string") return;

        const name = rawName.trim();
        if (!name) return;

        const key = name.toLowerCase();

        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            id: key,
            name,
            image: brand.categoryIMAGE || "",
            brandIds: [],
            brandNames: [],
          });
        }

        const item = categoryMap.get(key);

        if (!item.image && brand.categoryIMAGE) {
          item.image = brand.categoryIMAGE;
        }

        if (
          brand._id &&
          !item.brandIds.includes(String(brand._id))
        ) {
          item.brandIds.push(String(brand._id));
          item.brandNames.push(brand.brandName || "Unnamed brand");
        }
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [brands]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.brandNames.some((name) =>
          name.toLowerCase().includes(query)
        )
    );
  }, [categories, search]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedCategories = filteredCategories.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ==========================================
  // OPEN / CLOSE EDIT MODAL
  // ==========================================

  const openEditModal = (category) => {
    setSelectedCategory(category);

    setForm({
      name: category.name,
      image: category.image || "",
    });

    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (saving) return;

    setShowEditModal(false);
    setSelectedCategory(null);
    setForm({ name: "", image: "" });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE CATEGORY
  // ==========================================

  const handleUpdateCategory = async (event) => {
    event.preventDefault();

    if (!selectedCategory) return;

    const oldName = selectedCategory.name;
    const newName = form.name.trim();
    const newImage = form.image.trim();

    if (!newName) {
      alert("Please enter a category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== selectedCategory.id &&
        category.name.toLowerCase() === newName.toLowerCase()
    );

    if (duplicate) {
      alert("This category already exists.");
      return;
    }

    const affectedBrands = brands.filter((brand) => {
      const names = Array.isArray(brand.category)
        ? brand.category
        : typeof brand.category === "string"
          ? [brand.category]
          : [];

      return names.some(
        (name) =>
          typeof name === "string" &&
          name.toLowerCase() === oldName.toLowerCase()
      );
    });

    if (!affectedBrands.length) {
      alert("No brands are associated with this category.");
      return;
    }

    try {
      setSaving(true);

      const config = getAuthConfig();

      // Update each associated brand.
      for (const brand of affectedBrands) {
        const existingCategories = Array.isArray(brand.category)
          ? brand.category
          : typeof brand.category === "string"
            ? [brand.category]
            : [];

        const updatedCategories = existingCategories.map((name) =>
          name.toLowerCase() === oldName.toLowerCase()
            ? newName
            : name
        );

        const payload = {
          category: updatedCategories,
          categoryIMAGE: newImage,
        };

        console.log("Updating category image:", {
          brandId: brand._id,
          categoryIMAGE: payload.categoryIMAGE,
        });

        const response = await axios.put(
          `${API_BASE_URL}/brands/updateBrand/${brand._id}`,
          payload,
          {
            ...config,
            headers: {
              ...config.headers,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Category update response:", response.data);
      }

      alert("Category updated successfully.");

      setShowEditModal(false);
      setSelectedCategory(null);

      await fetchBrands();
    } catch (error) {
      console.error(
        "Update category error:",
        error.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update category. Check your backend controller."
      );

      await fetchBrands();
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Remove "${category.name}" from all ${category.brandIds.length} associated brand(s)?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const config = getAuthConfig();

      const affectedBrands = brands.filter((brand) => {
        const names = Array.isArray(brand.category)
          ? brand.category
          : typeof brand.category === "string"
            ? [brand.category]
            : [];

        return names.some(
          (name) =>
            typeof name === "string" &&
            name.toLowerCase() === category.name.toLowerCase()
        );
      });

      for (const brand of affectedBrands) {
        const existingCategories = Array.isArray(brand.category)
          ? brand.category
          : typeof brand.category === "string"
            ? [brand.category]
            : [];

        const updatedCategories = existingCategories.filter(
          (name) =>
            name.toLowerCase() !== category.name.toLowerCase()
        );

        await axios.put(
          `${API_BASE_URL}/brands/updateBrand/${brand._id}`,
          { category: updatedCategories },
          config
        );
      }

      alert("Category removed successfully.");

      await fetchBrands();
    } catch (error) {
      console.error("Delete category error:", error);

      alert(
        error?.response?.data?.message ||
          error.message ||
          "Failed to remove category."
      );

      await fetchBrands();
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-gray-500">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage categories associated with your brands.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBrands}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Layers className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Categories With Images
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.filter((item) => item.image).length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search category or brand..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Category table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category Name
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Associated Brands
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Brand Names
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          loading="lazy"
                          className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {category.name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {category.brandIds.length}
                      </span>
                    </td>

                    <td className="max-w-[280px] px-5 py-4">
                      <p className="truncate text-sm text-gray-600">
                        {category.brandNames.join(", ") || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          disabled={saving}
                          title="Edit category"
                          className="rounded-lg bg-orange-50 p-2.5 text-orange-600 hover:bg-orange-100 disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={saving}
                          title="Delete category"
                          className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <Layers className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="font-medium text-gray-700">
                        No categories found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {search
                          ? "Try another search term."
                          : "Add categories from Brand management."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              {filteredCategories.length
                ? (safePage - 1) * PAGE_SIZE + 1
                : 0}
              {" "}to{" "}
              {Math.min(
                safePage * PAGE_SIZE,
                filteredCategories.length
              )}
              {" "}of {filteredCategories.length} categories
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={safePage <= 1}
                aria-label="Previous page"
                className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="px-3 text-sm text-gray-600">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={safePage >= totalPages}
                aria-label="Next page"
                className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {showEditModal && selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-xl bg-white p-5 shadow-xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Category
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the category name and image URL.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-5">
              {/* Category image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category Image URL
                </label>

                {form.image ? (
                  <img
                    src={form.image}
                    alt="Category preview"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.visibility = "visible";
                    }}
                    className="mb-3 h-32 w-32 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/category-image.jpg"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Enter a publicly accessible image URL.
                </p>
              </div>

              {/* Category name */}
              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category Name *
                </label>

                <input
                  id="categoryName"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-700">
                  Associated brands: {selectedCategory.brandIds.length}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Existing brand statuses will not be changed.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categoris;
