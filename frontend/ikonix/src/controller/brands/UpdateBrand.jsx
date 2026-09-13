import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, ImagePlus, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "https://ikonix-backend.vercel.app/api";

const UpdateBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // STATES
  // ==========================================

  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState("");
  const [about, setAbout] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [status, setStatus] = useState("Active");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ==========================================
  // FETCH BRAND
  // ==========================================

  const fetchBrand = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/brands/getBrandById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Brand Response:", response.data);

      const brand = response.data.brand || response.data;

      // Brand Name
      setBrandName(brand.brandName || brand.BrandName || "");
      setAbout(brand.brandAbout || "");

      // Image
      setImage(brand.Image || "");

      // Categories
      setCategories(Array.isArray(brand.category) ? brand.category : []);

      // Status
      setStatus(brand.status || "Active");
    } catch (error) {
      console.error("Fetch Brand Error:", error);

      alert(error?.response?.data?.message || "Failed to load brand");

      navigate("/admin/brands");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD BRAND
  // ==========================================

  useEffect(() => {
    if (id) {
      fetchBrand();
    }
  }, [id]);

  // ==========================================
  // ADD CATEGORY
  // ==========================================

  const addCategory = () => {
    const value = categoryInput.trim();

    if (!value) {
      return;
    }

    // Prevent duplicate category
    if (
      categories.some(
        (category) => category.toLowerCase() === value.toLowerCase(),
      )
    ) {
      alert("This category already exists");
      return;
    }

    setCategories([...categories, value]);

    setCategoryInput("");
  };

  // ==========================================
  // ENTER KEY - ADD CATEGORY
  // ==========================================

  const handleCategoryKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  // ==========================================
  // REMOVE CATEGORY
  // ==========================================

  const removeCategory = (categoryToRemove) => {
    setCategories(
      categories.filter((category) => category !== categoryToRemove),
    );
  };

  // ==========================================
  // UPDATE BRAND
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!brandName.trim()) {
      alert("Please enter brand name");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      // ==========================================
      // FORM DATA
      // ==========================================

      const formData = new FormData();

      formData.append("brandName", brandName.trim());

      formData.append("status", status);

      formData.append("brandAbout", about.trim());
      // Add categories
      categories.forEach((category) => {
        formData.append("category", category);
      });

      // Add new image ONLY if selected
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      console.log("Updating Brand");

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await axios.put(
        `${API_BASE_URL}/brands/updateBrand/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Update Response:", response.data);

      alert(response.data.message || "Brand updated successfully");

      navigate("/admin/brands");
    } catch (error) {
      console.error("Update Brand Error:", error);

      alert(error?.response?.data?.message || "Failed to update brand");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        bg-[#f7f8fa]
        flex
        items-center
        justify-center
      "
      >
        <div
          className="
          flex
          flex-col
          items-center
          gap-3
        "
        >
          <div
            className="
            w-10
            h-10
            border-4
            border-orange-100
            border-t-orange-500
            rounded-full
            animate-spin
          "
          />

          <p
            className="
            text-sm
            text-gray-500
          "
          >
            Loading brand...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div
      className="
      min-h-screen
      bg-[#f7f8fa]
      p-4
      md:p-6
    "
    >
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div
        className="
        flex
        items-center
        gap-3
        mb-6
      "
      >
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate("/admin/brands")}
          className="
            w-10
            h-10
            bg-white
            border
            border-gray-200
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-600
            hover:text-orange-500
            hover:border-orange-300
            transition
          "
        >
          <ArrowLeft size={19} />
        </button>

        {/* TITLE */}

        <div>
          <h1
            className="
            text-2xl
            md:text-3xl
            font-semibold
            text-gray-900
          "
          >
            Update Brand
          </h1>

          <p
            className="
            text-sm
            text-gray-500
            mt-1
          "
          >
            Update your brand information
          </p>
        </div>
      </div>

      {/* ====================================== */}
      {/* FORM CARD */}
      {/* ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-xl
          border
          border-gray-100
          shadow-sm
          max-w-5xl
          overflow-hidden
        "
      >
        {/* ==================================== */}
        {/* FORM HEADER */}
        {/* ==================================== */}

        <div
          className="
          px-6
          py-5
          border-b
          border-gray-100
        "
        >
          <h2
            className="
            text-base
            font-semibold
            text-gray-800
          "
          >
            Brand Information
          </h2>

          <p
            className="
            text-sm
            text-gray-500
            mt-1
          "
          >
            Edit the details below and save your changes.
          </p>
        </div>

        {/* ==================================== */}
        {/* FORM CONTENT */}
        {/* ==================================== */}

        <div
          className="
          p-6
          space-y-7
        "
        >
          {/* ================================== */}
          {/* BRAND NAME */}
          {/* ================================== */}

          <div>
            <label
              className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            "
            >
              Brand Name
              <span
                className="
                text-red-500
                ml-1
              "
              >
                *
              </span>
            </label>

            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              className="
                w-full
                h-11
                px-4
                border
                border-gray-200
                rounded-lg
                outline-none
                text-sm
                text-gray-700
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
                transition
              "
            />
          </div>

          <div>
            <label
              className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            "
            >
              Brand About
              <span
                className="
                text-red-500
                ml-1
              "
              >
                *
              </span>
            </label>

            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="About Section"
              className="
                w-full
                h-11
                px-4
                border
                border-gray-200
                rounded-lg
                outline-none
                text-sm
                text-gray-700
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
                transition
              "
            />
          </div>
          {/* ================================== */}
          {/* BRAND LOGO */}
          {/* ================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Logo
            </label>

            <div className="flex flex-col md:flex-row gap-5">
              {/* IMAGE PREVIEW */}

              <div
                className="
        w-36
        h-28
        flex-shrink-0
        rounded-xl
        border
        border-dashed
        border-gray-300
        bg-gray-50
        flex
        items-center
        justify-center
        overflow-hidden
      "
              >
                {image ? (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : image}
                    alt={brandName || "Brand Logo"}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ImagePlus size={28} />

                    <span className="text-xs">No Logo</span>
                  </div>
                )}
              </div>

              {/* FILE UPLOAD */}

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setImageFile(file);
                    setImage(URL.createObjectURL(file));
                  }}
                  className="
          w-full
          h-11
          px-3
          py-2
          border
          border-gray-200
          rounded-lg
          outline-none
          text-sm
          text-gray-600
          focus:border-orange-400
          focus:ring-2
          focus:ring-orange-100
        "
                />

                <p className="text-xs text-gray-400 mt-2">
                  Upload JPG, PNG, WEBP or SVG. Leave empty to keep the current
                  logo.
                </p>
              </div>
            </div>
          </div>

          {/* ================================== */}
          {/* CATEGORIES */}
          {/* ================================== */}

          <div>
            <label
              className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            "
            >
              Categories
            </label>

            {/* INPUT */}

            <div
              className="
              flex
              flex-col
              sm:flex-row
              gap-2
            "
            >
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={handleCategoryKeyDown}
                placeholder="Enter category"
                className="
                  flex-1
                  h-11
                  px-4
                  border
                  border-gray-200
                  rounded-lg
                  outline-none
                  text-sm
                  focus:border-orange-400
                  focus:ring-2
                  focus:ring-orange-100
                "
              />

              <button
                type="button"
                onClick={addCategory}
                className="
                  h-11
                  px-5
                  rounded-lg
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  text-sm
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                "
              >
                <Plus size={17} />
                Add Category
              </button>
            </div>

            {/* CATEGORY TAGS */}

            {categories.length > 0 && (
              <div
                className="
                flex
                flex-wrap
                gap-2
                mt-4
              "
              >
                {categories.map((category, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="
                        flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        bg-orange-50
                        border
                        border-orange-100
                        text-orange-600
                        rounded-full
                        text-sm
                      "
                  >
                    <span>{category}</span>

                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="
                          w-5
                          h-5
                          rounded-full
                          flex
                          items-center
                          justify-center
                          hover:bg-orange-100
                        "
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================================== */}
          {/* STATUS */}
          {/* ================================== */}

          <div>
            <label
              className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            "
            >
              Status
            </label>

            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
              max-w-md
            "
            >
              {/* ACTIVE */}

              <button
                type="button"
                onClick={() => setStatus("Active")}
                className={`
                  h-11
                  rounded-lg
                  border
                  text-sm
                  font-medium
                  transition
                  ${
                    status === "Active"
                      ? "border-green-400 bg-green-50 text-green-600"
                      : "border-gray-200 bg-white text-gray-500 hover:border-green-300"
                  }
                `}
              >
                Active
              </button>

              {/* INACTIVE */}

              <button
                type="button"
                onClick={() => setStatus("Inactive")}
                className={`
                  h-11
                  rounded-lg
                  border
                  text-sm
                  font-medium
                  transition
                  ${
                    status === "Inactive"
                      ? "border-red-400 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-500 hover:border-red-300"
                  }
                `}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* ==================================== */}
        {/* FOOTER */}
        {/* ==================================== */}

        <div
          className="
          px-6
          py-5
          bg-gray-50/70
          border-t
          border-gray-100
          flex
          flex-col-reverse
          sm:flex-row
          sm:justify-end
          gap-3
        "
        >
          {/* CANCEL */}

          <button
            type="button"
            disabled={saving}
            onClick={() => navigate("/admin/brands")}
            className="
              px-6
              h-11
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-700
              text-sm
              font-medium
              hover:bg-gray-50
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="
              px-6
              h-11
              rounded-lg
              bg-orange-500
              hover:bg-orange-600
              text-white
              text-sm
              font-medium
              flex
              items-center
              justify-center
              gap-2
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Save size={17} />

            {saving ? "Updating..." : "Update Brand"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBrand;
