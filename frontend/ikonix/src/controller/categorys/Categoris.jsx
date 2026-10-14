
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  CheckCircle2,
  CircleSlash,
  Package,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL =
  "https://ikonix-backend.vercel.app/api";

const emptyForm = {
  categoryName: "",
  categoryIMAGE: "",
  status: "Active",
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong.";

function Categoris() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories from MongoDB
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

  const response = await axios.get(
  `${API_BASE_URL}/categories/getAllCategories`
);

      const data = response.data.categories || [];
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Summary cards
  const activeCount = categories.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveCount = categories.filter(
    (item) => item.status === "Inactive"
  ).length;

  // Search and status filter
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const name = item.categoryName || "";

      const matchesSearch = name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category._id);

    setForm({
      categoryName: category.categoryName || "",
      categoryIMAGE: category.categoryIMAGE || "",
      status: category.status || "Active",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
  };

  // Create or update category
  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryName = form.categoryName.trim();

    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    if (!["Active", "Inactive"].includes(form.status)) {
      setError("Please select a valid status.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        categoryName,
        categoryIMAGE: form.categoryIMAGE.trim(),
        status: form.status,
      };

      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/categories/updateCategory/${editingId}`,
          payload
        );

        setSuccess("Category updated successfully.");
      } else {
        await axios.post(
          `${API_BASE_URL}/categories/createCategory`,
          payload
        );

        setSuccess("Category created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await fetchCategories();
    } catch (err) {
      setError(getErrorMessage(err));
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
      setDeletingId(category._id);
      setError("");
      setSuccess("");

      await axios.delete(
        `${API_BASE_URL}/categories/deleteCategory/${category._id}`
      );

      setCategories((previous) =>
        previous.filter((item) => item._id !== category._id)
      );

      setSuccess("Category deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    {
      label: "Total Categories",
      value: categories.length,
      icon: FolderOpen,
      iconClass: "bg-orange-50 text-[#FC9D03]",
    },
    {
      label: "Active Categories",
      value: activeCount,
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Inactive Categories",
      value: inactiveCount,
      icon: CircleSlash,
      iconClass: "bg-red-50 text-red-500",
    },
    {
      label: "Products Assigned",
      value: "—",
      icon: Package,
      iconClass: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FC9D03]">
            Catalogue Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organize and manage your IKONIX product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FC9D03] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <Plus size={19} />
          Add Category
        </button>
      </div>

      {/* Notifications */}
      {error && !showForm && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchCategories}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Categories table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              All Categories
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Manage category details and availability.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#FC9D03] focus:ring-2 focus:ring-orange-100 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#FC9D03]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              type="button"
              onClick={fetchCategories}
              disabled={loading}
              title="Refresh categories"
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Category Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <RefreshCw
                      size={25}
                      className="mx-auto mb-3 animate-spin text-[#FC9D03]"
                    />
                    <p className="text-sm text-slate-500">
                      Loading categories...
                    </p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FolderOpen
                      size={34}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <p className="font-medium text-slate-700">
                      No categories found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try a different search or add a category.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="transition hover:bg-orange-50/30"
                  >
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        {category.categoryIMAGE ? (
                          <img
                            src={category.categoryIMAGE}
                            alt={category.categoryName}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <ImageIcon
                            size={23}
                            className="text-slate-300"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {category.categoryName}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        ID: {category._id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                          category.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          title="Edit category"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-orange-100 hover:text-orange-700"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category._id}
                          title="Delete category"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === category._id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {filteredCategories.length} of {categories.length} categories
          </p>
        </div>
      </div>

      {/* Add / edit drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
          <button
            type="button"
            aria-label="Close form overlay"
            onClick={closeForm}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter your category details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex-1 space-y-6 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={form.categoryName}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        categoryName: event.target.value,
                      }))
                    }
                    placeholder="Enter category name"
                    required
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-[#FC9D03] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category Image URL
                  </label>

                  <input
                    type="url"
                    value={form.categoryIMAGE}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        categoryIMAGE: event.target.value,
                      }))
                    }
                    placeholder="Paste a Cloudinary image URL"
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-[#FC9D03] focus:ring-2 focus:ring-orange-100"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Paste an image URL. File uploads require a backend
                    Cloudinary upload endpoint.
                  </p>

                  {form.categoryIMAGE && (
                    <div className="mt-3 flex h-36 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <img
                        src={form.categoryIMAGE}
                        alt="Category preview"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#FC9D03]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 border-t border-slate-100 p-6">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FC9D03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categoris;
