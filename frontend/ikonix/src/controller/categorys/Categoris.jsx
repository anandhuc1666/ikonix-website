
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Layers,
  Plus,
  Image as ImageIcon,
  Filter,
} from "lucide-react";
// const API_BASE_URL = "https://ikonix-backend.vercel.app/api";
const API_BASE_URL = "http://localhost:5000/api";

const SECTIONS = [
  "Main Categories",
  "Featured Categories",
  "New Arrivals",
  "Popular Categories",
];

const initialForm = {
  categoryName: "",
  brandName: "",
  section: "Main Categories",
};

const Categoris = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Authentication
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

  // Fetch brands
  const fetchBrands = useCallback(async () => {
    const response = await axios.get(
      `${API_BASE_URL}/brands/getAllBrands`,
      getAuthConfig()
    );

    const data =
      response.data?.brands ??
      response.data?.data ??
      response.data;

    if (!Array.isArray(data)) {
      throw new Error("Invalid brand data received.");
    }

    setBrands(data);
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    const response = await axios.get(
      `${API_BASE_URL}/categories`,
      getAuthConfig()
    );

    const data =
      response.data?.categories ??
      response.data?.data ??
      response.data;

    if (!Array.isArray(data)) {
      throw new Error("Invalid category data received.");
    }

    setCategories(data);
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchBrands(),
        fetchCategories(),
      ]);
    } catch (error) {
      console.error("Loading error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to load data."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Search and section filtering
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.categoryName?.toLowerCase().includes(query) ||
        category.brandName?.toLowerCase().includes(query);

      const matchesSection =
        sectionFilter === "All" ||
        category.section === sectionFilter;

      return matchesSearch && matchesSection;
    });
  }, [categories, search, sectionFilter]);

  // Summary
  const totalCategories = categories.length;

  const categoriesWithImages = categories.filter(
    (category) => category.categoryImage
  ).length;

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be below 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // Reset form
  const resetForm = () => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setForm(initialForm);
    setImageFile(null);
    setPreview("");
    setEditCategory(null);
    setShowForm(false);
  };

  // Open create form
  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (category) => {
    setEditCategory(category);

    setForm({
      categoryName: category.categoryName || "",
      brandName: category.brandName || "",
      section: category.section || "Main Categories",
    });

    setImageFile(null);
    setPreview(category.categoryImage || "");
    setShowForm(true);
  };

  // Create / Update category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.categoryName.trim() ||
      !form.brandName ||
      !form.section
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!editCategory && !imageFile) {
      alert("Please upload a category image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "categoryName",
        form.categoryName.trim()
      );

      formData.append("brandName", form.brandName);
      formData.append("section", form.section);

      if (imageFile) {
        formData.append("categoryImage", imageFile);
      }

      const config = getAuthConfig();

      if (editCategory) {
        await axios.put(
          `${API_BASE_URL}/categories/${editCategory._id}`,
          formData,
          config
        );

        alert("Category updated successfully.");
      } else {
        await axios.post(
          `${API_BASE_URL}/categories/create`,
          formData,
          config
        );

        alert("Category created successfully.");
      }

      resetForm();
      await fetchCategories();
    } catch (error) {
      console.error("Category save error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.categoryName}"?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await axios.delete(
        `${API_BASE_URL}/categories/${category._id}`,
        getAuthConfig()
      );

      alert("Category deleted successfully.");

      await fetchCategories();
    } catch (error) {
      console.error("Delete category error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete category."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-orange-500" />

          <p className="text-sm text-gray-500">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your product categories and sections.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadData}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-3">
                <Layers className="text-orange-600" size={25} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total Categories
                </p>

                <h2 className="text-2xl font-bold text-gray-900">
                  {totalCategories}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <ImageIcon className="text-blue-600" size={25} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Categories With Images
                </p>

                <h2 className="text-2xl font-bold text-gray-900">
                  {categoriesWithImages}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_250px]">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or brand..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-orange-500"
            >
              <option value="All">All Sections</option>

              {SECTIONS.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CATEGORY CARDS */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {category.categoryImage ? (
                    <img
                      src={category.categoryImage}
                      alt={category.categoryName}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon size={42} className="text-gray-300" />
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                    Category
                  </span>
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <h3 className="truncate text-lg font-bold text-gray-900">
                    {category.categoryName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Brand:{" "}
                    <span className="font-medium text-gray-700">
                      {category.brandName}
                    </span>
                  </p>

                  <div className="mt-3">
                    <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {category.section || "Main Categories"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : "Recently added"}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        disabled={saving}
                        title="Edit category"
                        className="rounded-lg bg-orange-50 p-2.5 text-orange-600 hover:bg-orange-100 disabled:opacity-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(category)}
                        disabled={saving}
                        title="Delete category"
                        className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
            <Layers className="mx-auto mb-3 text-gray-300" size={45} />

            <h3 className="font-semibold text-gray-800">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search || sectionFilter !== "All"
                ? "Try changing your search or section filter."
                : "Start by creating your first category."}
            </p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              resetForm();
            }
          }}
        >
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editCategory ? "Edit Category" : "Add New Category"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter category information below.
                </p>
              </div>

              <button
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >

              {/* CATEGORY NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category Name *
                </label>

                <input
                  type="text"
                  name="categoryName"
                  value={form.categoryName}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* BRAND */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Brand *
                </label>

                <select
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">Choose a brand</option>

                  {brands.map((brand) => (
                    <option
                      key={brand._id}
                      value={brand.brandName}
                    >
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </div>

              {/* SECTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Section *
                </label>

                <select
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {SECTIONS.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category Image *
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-orange-400 hover:bg-orange-50/30">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Category preview"
                      className="mb-3 h-36 w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="mb-3 rounded-full bg-orange-100 p-4">
                      <ImagePlus
                        className="text-orange-600"
                        size={28}
                      />
                    </div>
                  )}

                  <span className="text-sm font-semibold text-gray-700">
                    {imageFile
                      ? imageFile.name
                      : preview
                        ? "Change category image"
                        : "Upload category image"}
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    PNG, JPG or WEBP · Maximum 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editCategory
                        ? <Pencil size={17} />
                        : <Plus size={18} />}

                      {editCategory
                        ? "Update Category"
                        : "Create Category"}
                    </>
                  )}
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
