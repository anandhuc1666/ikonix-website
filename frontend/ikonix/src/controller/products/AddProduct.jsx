import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ImagePlus,
  UploadCloud,
  FileText,
  X,
  Package,
  CheckCircle2,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const AddProduct = () => {
  const navigate = useNavigate();

  // ======================================================
  // STATES
  // ======================================================

  const [productName, setProductName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [category, setCategory] = useState("");
  const [brandName, setBrandName] = useState("");

  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [status, setStatus] = useState("Active");

  // Images
  const [imageFiles, setImageFiles] = useState([]);

  // PDF
  const [pdfFile, setPdfFile] = useState(null);

  // Brands
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  // Submit
  const [loading, setLoading] = useState(false);

  // ======================================================
  // TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ======================================================
  // FETCH BRANDS
  // ======================================================

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true);

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

      setBrands(response.data.brands || []);
    } catch (error) {
      console.error("Fetch Brands Error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to load brands."
      );
    } finally {
      setBrandsLoading(false);
    }
  };

  // ======================================================
  // LOAD BRANDS
  // ======================================================

  useEffect(() => {
    fetchBrands();
  }, []);

  // ======================================================
  // GET CATEGORIES FROM BRANDS
  // ======================================================

  const categories = useMemo(() => {
    const allCategories = brands.flatMap((brand) =>
      Array.isArray(brand.category)
        ? brand.category
        : []
    );

    // Remove duplicate categories
    return [...new Set(allCategories)];
  }, [brands]);

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    // Maximum 5 images
    if (imageFiles.length + selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `${file.name} is not a supported image format.`
        );
        return;
      }

      // 5MB per image
      if (file.size > 5 * 1024 * 1024) {
        alert(
          `${file.name} is larger than 5MB.`
        );
        return;
      }
    }

    setImageFiles((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // ======================================================
  // REMOVE IMAGE
  // ======================================================

  const removeImage = (index) => {
    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ======================================================
  // PDF UPLOAD
  // ======================================================

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    // 10MB PDF limit
    if (file.size > 10 * 1024 * 1024) {
      alert("PDF size must be less than 10MB.");
      return;
    }

    setPdfFile(file);

    e.target.value = "";
  };

  // ======================================================
  // REMOVE PDF
  // ======================================================

  const removePdf = () => {
    setPdfFile(null);
  };

  // ======================================================
  // SUBMIT PRODUCT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ====================================================
    // VALIDATION
    // ====================================================

    if (!productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!modelNumber.trim()) {
      alert("Please enter SKU / Model Number.");
      return;
    }

    if (!shortDescription.trim()) {
      alert("Please enter short description.");
      return;
    }

    if (!productDescription.trim()) {
      alert("Please enter product details.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!brandName) {
      alert("Please select a brand.");
      return;
    }

    if (!unit.trim()) {
      alert("Please enter unit.");
      return;
    }

    if (price === "") {
      alert("Please enter product price.");
      return;
    }

    if (stock === "") {
      alert("Please enter stock quantity.");
      return;
    }

    if (Number(price) < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (Number(stock) < 0) {
      alert("Stock quantity cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      // ==================================================
      // FORM DATA
      // ==================================================

      const formData = new FormData();

      formData.append(
        "brandName",
        brandName
      );

      formData.append(
        "productName",
        productName.trim()
      );

      formData.append(
        "modelNumber",
        modelNumber.trim()
      );

      formData.append(
        "shortDescription",
        shortDescription.trim()
      );

      formData.append(
        "productDescription",
        productDescription.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "unit",
        unit.trim()
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "stock",
        stock
      );

      formData.append(
        "status",
        status
      );

      // ==================================================
      // PRODUCT IMAGES
      // ==================================================

      imageFiles.forEach((file) => {
        formData.append(
          "Image",
          file
        );
      });

      // ==================================================
      // PRODUCT PDF
      // ==================================================

      if (pdfFile) {
        formData.append(
          "pdfFile",
          pdfFile
        );
      }

      console.log("Creating Product...");

      // ==================================================
      // API REQUEST
      // ==================================================

      const response = await axios.post(
        `${API_BASE_URL}/products/createProduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Create Product Response:",
        response.data
      );

      alert(
        response.data.message ||
          "Product created successfully."
      );

      navigate("/admin/products");

    } catch (error) {
      console.error(
        "Create Product Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CANCEL
  // ======================================================

  const handleCancel = () => {
    if (loading) return;

    navigate("/admin/products");
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-white border-b border-gray-100">

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
            disabled={loading}
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
              disabled:opacity-50
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
              Add Product
            </h1>

            <p
              className="
                text-xs
                md:text-sm
                text-gray-500
                mt-1
              "
            >
              Create a new product for your catalog
            </p>
          </div>

        </div>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          p-4
          md:p-7
          max-w-7xl
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

            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="lg:col-span-2 space-y-6">

              {/* ==================================================
                  PRODUCT INFORMATION
              ================================================== */}

              <div
                className="
                  bg-white
                  rounded-xl
                  border
                  border-gray-100
                  shadow-sm
                "
              >

                {/* CARD HEADER */}

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
                    Product Information
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      mt-1
                    "
                  >
                    Enter the basic information
                    about this product.
                  </p>
                </div>

                {/* CARD CONTENT */}

                <div
                  className="
                    p-6
                    space-y-6
                  "
                >

                  {/* PRODUCT NAME + MODEL */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-5
                    "
                  >

                    {/* PRODUCT NAME */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        value={productName}
                        onChange={(e) =>
                          setProductName(
                            e.target.value
                          )
                        }
                        placeholder="Enter product name"
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

                    {/* MODEL NUMBER */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU / Model Number
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        value={modelNumber}
                        onChange={(e) =>
                          setModelNumber(
                            e.target.value
                          )
                        }
                        placeholder="Enter SKU or model number"
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

                  </div>

                  {/* SHORT DESCRIPTION */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) =>
                        setShortDescription(
                          e.target.value
                        )
                      }
                      placeholder="Enter short description about the product"
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

                  {/* PRODUCT DETAILS */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Details
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <textarea
                      rows={5}
                      value={productDescription}
                      onChange={(e) =>
                        setProductDescription(
                          e.target.value
                        )
                      }
                      placeholder="Enter product details, specifications, features, usage, etc."
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
                        focus:border-orange-400
                        focus:ring-2
                        focus:ring-orange-100
                        disabled:bg-gray-50
                      "
                    />
                  </div>

                  {/* CATEGORY / BRAND / UNIT */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-3
                      gap-5
                    "
                  >

                    {/* CATEGORY */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(
                            e.target.value
                          )
                        }
                        disabled={
                          loading ||
                          brandsLoading
                        }
                        className="
                          w-full
                          h-11
                          px-3
                          rounded-lg
                          border
                          border-gray-200
                          text-sm
                          text-gray-700
                          bg-white
                          outline-none
                          focus:border-orange-400
                          focus:ring-2
                          focus:ring-orange-100
                          disabled:bg-gray-50
                        "
                      >
                        <option value="">
                          {brandsLoading
                            ? "Loading..."
                            : "Select category"}
                        </option>

                        {categories.map(
                          (item, index) => (
                            <option
                              key={`${item}-${index}`}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* BRAND */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <select
                        value={brandName}
                        onChange={(e) =>
                          setBrandName(
                            e.target.value
                          )
                        }
                        disabled={
                          loading ||
                          brandsLoading
                        }
                        className="
                          w-full
                          h-11
                          px-3
                          rounded-lg
                          border
                          border-gray-200
                          text-sm
                          text-gray-700
                          bg-white
                          outline-none
                          focus:border-orange-400
                          focus:ring-2
                          focus:ring-orange-100
                          disabled:bg-gray-50
                        "
                      >
                        <option value="">
                          {brandsLoading
                            ? "Loading..."
                            : "Select brand"}
                        </option>

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

                    {/* UNIT */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        value={unit}
                        onChange={(e) =>
                          setUnit(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Piece"
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

                  </div>

                  {/* PRICE / STOCK */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-5
                    "
                  >

                    {/* PRICE */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) =>
                          setPrice(
                            e.target.value
                          )
                        }
                        placeholder="Enter price"
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

                    {/* STOCK */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) =>
                          setStock(
                            e.target.value
                          )
                        }
                        placeholder="Enter stock quantity"
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

                  </div>

                </div>
              </div>

              {/* ==================================================
                  STATUS
              ================================================== */}

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
                  <h2 className="text-base font-semibold text-gray-900">
                    Product Status
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Choose whether this product is available.
                  </p>
                </div>

                <div
                  className="
                    p-6
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  {/* ACTIVE */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setStatus("Active")
                    }
                    className={`
                      p-4
                      rounded-xl
                      border
                      flex
                      items-center
                      justify-between
                      transition
                      ${
                        status === "Active"
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-200"
                      }
                    `}
                  >

                    <div className="flex items-center gap-3">

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
                        <CheckCircle2
                          size={18}
                          className="text-green-500"
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">
                          Active
                        </p>

                        <p className="text-xs text-gray-400">
                          Product is available
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
                        ✓
                      </div>
                    )}

                  </button>

                  {/* INACTIVE */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setStatus("Inactive")
                    }
                    className={`
                      p-4
                      rounded-xl
                      border
                      flex
                      items-center
                      justify-between
                      transition
                      ${
                        status === "Inactive"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white hover:border-red-200"
                      }
                    `}
                  >

                    <div className="flex items-center gap-3">

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
                        <X
                          size={18}
                          className="text-red-500"
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">
                          Inactive
                        </p>

                        <p className="text-xs text-gray-400">
                          Product is unavailable
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
                        ✓
                      </div>
                    )}

                  </button>

                </div>
              </div>

            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="space-y-6">

              {/* ==================================================
                  PRODUCT IMAGES
              ================================================== */}

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
                  <h2 className="text-base font-semibold text-gray-900">
                    Product Images
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Upload up to 5 product images.
                  </p>
                </div>

                <div className="p-5">

                  {/* UPLOAD AREA */}

                  <label
                    htmlFor="product-images"
                    className="
                      block
                      cursor-pointer
                      rounded-xl
                      border-2
                      border-dashed
                      border-orange-200
                      bg-orange-50/30
                      hover:bg-orange-50
                      transition
                      p-7
                      text-center
                    "
                  >

                    <input
                      id="product-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      multiple
                      onChange={handleImageChange}
                      disabled={loading}
                      className="hidden"
                    />

                    <div
                      className="
                        w-12
                        h-12
                        mx-auto
                        rounded-full
                        bg-orange-100
                        flex
                        items-center
                        justify-center
                        mb-3
                      "
                    >
                      <UploadCloud
                        size={23}
                        className="text-orange-500"
                      />
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Drag & drop images here
                    </p>

                    <p className="text-xs text-gray-400 my-2">
                      or
                    </p>

                    <span
                      className="
                        inline-flex
                        items-center
                        justify-center
                        px-5
                        h-9
                        rounded-lg
                        bg-orange-500
                        hover:bg-orange-600
                        text-white
                        text-xs
                        font-medium
                      "
                    >
                      Browse Files
                    </span>

                    <p className="text-[10px] text-gray-400 mt-3">
                      JPG, PNG, WEBP or SVG
                    </p>

                    <p className="text-[10px] text-gray-400">
                      Maximum 5 images
                    </p>

                  </label>

                  {/* IMAGE COUNT */}

                  <div className="flex items-center justify-between mt-4 mb-3">

                    <p className="text-xs font-medium text-gray-600">
                      Image Preview
                    </p>

                    <span className="text-xs text-gray-400">
                      {imageFiles.length}/5
                    </span>

                  </div>

                  {/* PREVIEWS */}

                  {imageFiles.length > 0 ? (
                    <div
                      className="
                        grid
                        grid-cols-3
                        gap-3
                      "
                    >

                      {imageFiles.map(
                        (file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="
                              relative
                              aspect-square
                              rounded-lg
                              border
                              border-gray-200
                              bg-gray-50
                              overflow-hidden
                            "
                          >

                            <img
                              src={URL.createObjectURL(
                                file
                              )}
                              alt={`Product ${index + 1}`}
                              className="
                                w-full
                                h-full
                                object-contain
                                p-2
                              "
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(index)
                              }
                              disabled={loading}
                              className="
                                absolute
                                top-1
                                right-1
                                w-6
                                h-6
                                rounded-full
                                bg-red-500
                                text-white
                                flex
                                items-center
                                justify-center
                                hover:bg-red-600
                              "
                            >
                              <X size={12} />
                            </button>

                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <div
                      className="
                        py-6
                        text-center
                        text-gray-300
                      "
                    >
                      <ImagePlus
                        size={28}
                        className="mx-auto mb-2"
                      />

                      <p className="text-xs">
                        No images selected
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* ==================================================
                  PRODUCT PDF
              ================================================== */}

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
                  <h2 className="text-base font-semibold text-gray-900">
                    Product PDF / Documents
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Upload product datasheet or manual.
                  </p>
                </div>

                <div className="p-5">

                  {!pdfFile ? (

                    <label
                      htmlFor="product-pdf"
                      className="
                        block
                        cursor-pointer
                        rounded-xl
                        border-2
                        border-dashed
                        border-orange-200
                        bg-orange-50/30
                        hover:bg-orange-50
                        transition
                        p-7
                        text-center
                      "
                    >

                      <input
                        id="product-pdf"
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        disabled={loading}
                        className="hidden"
                      />

                      <div
                        className="
                          w-12
                          h-12
                          mx-auto
                          rounded-full
                          bg-orange-100
                          flex
                          items-center
                          justify-center
                          mb-3
                        "
                      >
                        <UploadCloud
                          size={23}
                          className="text-orange-500"
                        />
                      </div>

                      <p className="text-sm font-medium text-gray-700">
                        Drag & drop images here
                      </p>

                      <p className="text-xs text-gray-400 my-2">
                        or
                      </p>

                      <span
                        className="
                          inline-flex
                          items-center
                          justify-center
                          px-5
                          h-9
                          rounded-lg
                          bg-orange-500
                          hover:bg-orange-600
                          text-white
                          text-xs
                          font-medium
                        "
                      >
                        Browse Files
                      </span>

                      <p className="text-[10px] text-gray-400 mt-3">
                        Upload product documents,
                        manuals or datasheets (PDF)
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Maximum 10MB
                      </p>

                    </label>

                  ) : (

                    <div
                      className="
                        rounded-xl
                        border
                        border-orange-100
                        bg-orange-50/50
                        p-4
                      "
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-11
                            h-11
                            rounded-lg
                            bg-white
                            border
                            border-orange-100
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FileText
                            size={22}
                            className="text-orange-500"
                          />
                        </div>

                        <div className="flex-1 min-w-0">

                          <p
                            className="
                              text-sm
                              font-medium
                              text-gray-800
                              truncate
                            "
                          >
                            {pdfFile.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {(
                              pdfFile.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={removePdf}
                          disabled={loading}
                          className="
                            w-8
                            h-8
                            rounded-lg
                            bg-white
                            border
                            border-gray-200
                            text-red-500
                            flex
                            items-center
                            justify-center
                            hover:bg-red-50
                          "
                        >
                          <X size={15} />
                        </button>

                      </div>

                    </div>

                  )}

                </div>
              </div>

              {/* ==================================================
                  PRODUCT SUMMARY
              ================================================== */}

              <div
                className="
                  bg-white
                  rounded-xl
                  border
                  border-gray-100
                  shadow-sm
                  p-5
                "
              >

                <div className="flex items-center gap-3 mb-5">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-orange-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Package
                      size={19}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Product Summary
                    </h2>

                    <p className="text-xs text-gray-400">
                      Review before publishing
                    </p>
                  </div>

                </div>

                <div className="space-y-3">

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Product
                    </span>

                    <span className="text-xs font-medium text-gray-800 text-right truncate max-w-[150px]">
                      {productName || "Not entered"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Brand
                    </span>

                    <span className="text-xs font-medium text-gray-800">
                      {brandName || "Not selected"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Category
                    </span>

                    <span className="text-xs font-medium text-gray-800">
                      {category || "Not selected"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Images
                    </span>

                    <span className="text-xs font-medium text-gray-800">
                      {imageFiles.length}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      PDF
                    </span>

                    <span
                      className={`
                        text-xs
                        font-medium
                        ${
                          pdfFile
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {pdfFile
                        ? "Attached"
                        : "Not attached"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
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

          {/* ==================================================
              ACTION BAR
          ================================================== */}

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

              {loading
                ? "Publishing..."
                : "Publish Product"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddProduct;