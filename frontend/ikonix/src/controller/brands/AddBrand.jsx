import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, ImagePlus, X, Plus, Check, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://ikonix-backend.vercel.app/api";

const AddBrand = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [brandName, setBrandName] = useState("");
const [brandAbout, setBrandAbout] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [categories, setCategories] = useState([]);

  const [categoryInput, setCategoryInput] = useState("");

  const [status, setStatus] = useState("Active");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // ADD CATEGORY
  // ==========================================

  const addCategory = () => {
    const value = categoryInput.trim();

    if (!value) {
      return;
    }

    const alreadyExists = categories.some(
      (category) => category.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      alert("This category has already been added.");
      return;
    }

    setCategories((prev) => [...prev, value]);

    setCategoryInput("");
  };

  // ==========================================
  // CATEGORY ENTER KEY
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
    setCategories((prev) =>
      prev.filter((category) => category !== categoryToRemove),
    );
  };

  // ==========================================
  // IMAGE URL
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPG, PNG, WEBP or SVG image.");
      return;
    }

    // Optional 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);

    // Preview
    setImage(URL.createObjectURL(file));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!brandName.trim()) {
      alert("Please enter brand name.");
      return;
    }

    if (brandName.trim().length < 2) {
      alert("Brand name must contain at least 2 characters.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      // ==========================================
      // FORM DATA
      // ==========================================

      const formData = new FormData();

      formData.append("brandName", brandName.trim());

      formData.append("status", status);

      // ==========================================
      // ADD CATEGORIES
      // ==========================================

      categories.forEach((category) => {
        formData.append("category", category);
      });

      // ==========================================
      // ADD IMAGE
      // ==========================================

      if (imageFile) {
        formData.append("Image", imageFile);
      }

      console.log("Creating Brand...");

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await axios.post(
        `${API_BASE_URL}/brands/createBrand`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Create Brand Response:", response.data);

      alert(response.data.message || "Brand created successfully.");

      navigate("/admin/brands");
    } catch (error) {
      console.error("Create Brand Error:", error);

      if (error.response) {
        alert(error.response.data?.message || "Failed to create brand.");
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    if (loading) {
      return;
    }

    navigate("/brands");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ======================================
          HEADER
      ====================================== */}

      <div
        className="
        bg-white
        border-b
        border-gray-100
      "
      >
        <div
          className="
          px-4
          md:px-7
          py-4
          flex
          items-center
          gap-3
        "
        >
          {/* BACK */}

          <button
            type="button"
            onClick={handleCancel}
            className="
              w-10
              h-10
              rounded-lg
              border
              border-gray-200
              bg-white
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
              text-xl
              md:text-2xl
              font-semibold
              text-gray-900
            "
            >
              Add Brand
            </h1>

            <p
              className="
              text-xs
              md:text-sm
              text-gray-500
              mt-1
            "
            >
              Create a new brand for your product catalog
            </p>
          </div>
        </div>
      </div>

      {/* ======================================
          CONTENT
      ====================================== */}

      <div
        className="
        p-4
        md:p-7
        max-w-6xl
        mx-auto
      "
      >
        <form onSubmit={handleSubmit}>
          <div
            className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
          "
          >
            {/* =================================
                LEFT SIDE
            ================================= */}

            <div
              className="
              lg:col-span-2
              space-y-6
            "
            >
              {/* =================================
                  BRAND INFORMATION
              ================================= */}

              <div
                className="
                bg-white
                rounded-xl
                border
                border-gray-100
                shadow-sm
              "
              >
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
                    text-gray-900
                  "
                  >
                    Brand Information
                  </h2>

                  <p
                    className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                  >
                    Enter the basic information about this brand.
                  </p>
                </div>

                <div
                  className="
                  p-6
                  space-y-6
                "
                >
                  {/* BRAND NAME */}

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
                      disabled={loading}
                      className="
                        w-full
                        h-11
                        px-4
                        rounded-lg
                        border
                        border-gray-200
                        text-sm
                        text-gray-800
                        outline-none
                        focus:border-orange-400
                        focus:ring-2
                        focus:ring-orange-100
                        disabled:bg-gray-50
                      "
                    />
                  </div>

                  {/* CATEGORIES */}

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
                        disabled={loading}
                        className="
                          flex-1
                          h-11
                          px-4
                          rounded-lg
                          border
                          border-gray-200
                          text-sm
                          outline-none
                          focus:border-orange-400
                          focus:ring-2
                          focus:ring-orange-100
                          disabled:bg-gray-50
                        "
                      />

                      <button
                        type="button"
                        onClick={addCategory}
                        disabled={loading}
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
                          disabled:opacity-50
                        "
                      >
                        <Plus size={17} />
                        Add
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
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-full
                                bg-orange-50
                                border
                                border-orange-100
                                text-orange-600
                                text-sm
                              "
                          >
                            <span>{category}</span>

                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              disabled={loading}
                              className="
                                  w-5
                                  h-5
                                  rounded-full
                                  flex
                                  items-center
                                  justify-center
                                  hover:bg-orange-100
                                  disabled:opacity-50
                                "
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {categories.length === 0 && (
                      <p
                        className="
                        text-xs
                        text-gray-400
                        mt-2
                      "
                      >
                        No categories added yet.
                      </p>
                    )}
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
                      Brand About Section
                      <span
                        className="
                        text-red-500
                        ml-1
                      "
                      >
                        *
                      </span>
                    </label>

                   <textarea
  value={brandAbout}
  onChange={(e) => setBrandAbout(e.target.value)}
  placeholder="Write about this brand..."
  rows={6}
  disabled={loading}
  className="
    w-full
    px-4
    py-3
    rounded-lg
    border
    border-gray-200
    text-sm
    text-gray-800
    outline-none
    resize-none
    leading-6
    focus:border-orange-400
    focus:ring-2
    focus:ring-orange-100
    disabled:bg-gray-50
  "
/>
                  </div>
                </div>
              </div>

              {/* =================================
                  BRAND LOGO
              ================================= */}

              {/* =================================
    BRAND LOGO
================================= */}

              <div
                className="
    bg-white
    rounded-xl
    border
    border-gray-100
    shadow-sm
  "
              >
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
        text-gray-900
      "
                  >
                    Brand Logo
                  </h2>

                  <p
                    className="
        text-xs
        text-gray-500
        mt-1
      "
                  >
                    Upload the logo for this brand.
                  </p>
                </div>

                <div className="p-6">
                  <div
                    className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      "
                  >
                    {/* IMAGE PREVIEW */}

                    <div>
                      <p
                        className="
            text-sm
            font-medium
            text-gray-700
            mb-2
          "
                      >
                        Preview
                      </p>

                      <div
                        className="
            h-44
            rounded-xl
            border-2
            border-dashed
            border-gray-200
            bg-gray-50
            flex
            items-center
            justify-center
            overflow-hidden
          "
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={brandName || "Brand logo"}
                            className="
                max-w-full
                max-h-full
                object-contain
                p-5
              "
                          />
                        ) : (
                          <div
                            className="
                flex
                flex-col
                items-center
                text-gray-400
              "
                          >
                            <div
                              className="
                  w-14
                  h-14
                  rounded-full
                  bg-orange-50
                  flex
                  items-center
                  justify-center
                  mb-3
                "
                            >
                              <ImagePlus
                                size={26}
                                className="text-orange-400"
                              />
                            </div>

                            <p className="text-xs">Logo preview</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FILE UPLOAD */}

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
                        Upload Logo
                      </label>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        onChange={handleImageChange}
                        disabled={loading}
                        className="
            w-full
            h-11
            px-3
            py-2
            rounded-lg
            border
            border-gray-200
            text-sm
            outline-none
            focus:border-orange-400
            focus:ring-2
            focus:ring-orange-100
            disabled:bg-gray-50
          "
                      />

                      <p
                        className="
            text-xs
            text-gray-400
            mt-2
            leading-5
          "
                      >
                        Supported formats: JPG, PNG, WEBP and SVG. Maximum size:
                        5MB.
                      </p>

                      {image && (
                        <button
                          type="button"
                          onClick={() => {
                            setImage("");
                            setImageFile(null);
                          }}
                          disabled={loading}
                          className="
              mt-3
              text-xs
              text-red-500
              hover:text-red-600
              flex
              items-center
              gap-1
            "
                        >
                          <X size={13} />
                          Remove image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="space-y-6">
              {/* =================================
                  STATUS
              ================================= */}

              <div
                className="
                bg-white
                rounded-xl
                border
                border-gray-100
                shadow-sm
              "
              >
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
                    text-gray-900
                  "
                  >
                    Brand Status
                  </h2>

                  <p
                    className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                  >
                    Choose the current status of this brand.
                  </p>
                </div>

                <div
                  className="
                  p-5
                  space-y-3
                "
                >
                  {/* ACTIVE */}

                  <button
                    type="button"
                    onClick={() => setStatus("Active")}
                    disabled={loading}
                    className={`
                      w-full
                      p-4
                      rounded-xl
                      border
                      flex
                      items-center
                      justify-between
                      text-left
                      transition
                      ${
                        status === "Active"
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-200"
                      }
                    `}
                  >
                    <div
                      className="
                      flex
                      items-center
                      gap-3
                    "
                    >
                      <div
                        className="
                        w-9
                        h-9
                        rounded-full
                        bg-green-100
                        flex
                        items-center
                        justify-center
                      "
                      >
                        <div
                          className="
                          w-2.5
                          h-2.5
                          rounded-full
                          bg-green-500
                        "
                        />
                      </div>

                      <div>
                        <p
                          className="
                          text-sm
                          font-medium
                          text-gray-800
                        "
                        >
                          Active
                        </p>

                        <p
                          className="
                          text-xs
                          text-gray-400
                        "
                        >
                          Brand is available
                        </p>
                      </div>
                    </div>

                    {status === "Active" && (
                      <div
                        className="
                        w-6
                        h-6
                        rounded-full
                        bg-green-500
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </button>

                  {/* INACTIVE */}

                  <button
                    type="button"
                    onClick={() => setStatus("Inactive")}
                    disabled={loading}
                    className={`
                      w-full
                      p-4
                      rounded-xl
                      border
                      flex
                      items-center
                      justify-between
                      text-left
                      transition
                      ${
                        status === "Inactive"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white hover:border-red-200"
                      }
                    `}
                  >
                    <div
                      className="
                      flex
                      items-center
                      gap-3
                    "
                    >
                      <div
                        className="
                        w-9
                        h-9
                        rounded-full
                        bg-red-100
                        flex
                        items-center
                        justify-center
                      "
                      >
                        <div
                          className="
                          w-2.5
                          h-2.5
                          rounded-full
                          bg-red-500
                        "
                        />
                      </div>

                      <div>
                        <p
                          className="
                          text-sm
                          font-medium
                          text-gray-800
                        "
                        >
                          Inactive
                        </p>

                        <p
                          className="
                          text-xs
                          text-gray-400
                        "
                        >
                          Brand is unavailable
                        </p>
                      </div>
                    </div>

                    {status === "Inactive" && (
                      <div
                        className="
                        w-6
                        h-6
                        rounded-full
                        bg-red-500
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* =================================
                  SUMMARY
              ================================= */}

              <div
                className="
                bg-white
                rounded-xl
                border
                border-gray-100
                shadow-sm
                p-6
              "
              >
                <h2
                  className="
                  text-base
                  font-semibold
                  text-gray-900
                "
                >
                  Brand Summary
                </h2>

                <div
                  className="
                  mt-5
                  space-y-4
                "
                >
                  {/* NAME */}

                  <div
                    className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                  >
                    <span
                      className="
                      text-sm
                      text-gray-500
                    "
                    >
                      Brand Name
                    </span>

                    <span
                      className="
                      text-sm
                      font-medium
                      text-gray-800
                      truncate
                      max-w-[150px]
                    "
                    >
                      {brandName || "Not entered"}
                    </span>
                  </div>

                  <div
                    className="
                    h-px
                    bg-gray-100
                  "
                  />

                  {/* CATEGORIES */}

                  <div
                    className="
                    flex
                    items-center
                    justify-between
                  "
                  >
                    <span
                      className="
                      text-sm
                      text-gray-500
                    "
                    >
                      Categories
                    </span>

                    <span
                      className="
                      text-sm
                      font-medium
                      text-gray-800
                    "
                    >
                      {categories.length}
                    </span>
                  </div>

                  <div
                    className="
                    h-px
                    bg-gray-100
                  "
                  />

                  {/* LOGO */}

                  <div
                    className="
                    flex
                    items-center
                    justify-between
                  "
                  >
                    <span
                      className="
                      text-sm
                      text-gray-500
                    "
                    >
                      Logo
                    </span>

                    <span
                      className={`
                        text-xs
                        font-medium
                        ${image ? "text-green-600" : "text-gray-400"}
                      `}
                    >
                      {image ? "Added" : "Not added"}
                    </span>
                  </div>

                  <div
                    className="
                    h-px
                    bg-gray-100
                  "
                  />

                  {/* STATUS */}

                  <div
                    className="
                    flex
                    items-center
                    justify-between
                  "
                  >
                    <span
                      className="
                      text-sm
                      text-gray-500
                    "
                    >
                      Status
                    </span>

                    <span
                      className={`
                        px-2.5
                        py-1
                        rounded-md
                        text-xs
                        font-medium
                        ${
                          status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }
                      `}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================
              ACTION BAR
          ================================= */}

          <div
            className="
            mt-6
            bg-white
            rounded-xl
            border
            border-gray-100
            shadow-sm
            px-6
            py-4
            flex
            flex-col-reverse
            sm:flex-row
            sm:items-center
            sm:justify-end
            gap-3
          "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="
                h-11
                px-6
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-700
                text-sm
                font-medium
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* CREATE */}

            <button
              type="submit"
              disabled={loading}
              className="
                h-11
                px-7
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

              {loading ? "Creating..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
