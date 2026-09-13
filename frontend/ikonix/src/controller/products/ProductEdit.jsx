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
import {
  useNavigate,
  useParams,
} from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ======================================================
  // PRODUCT STATES
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

  // ======================================================
  // EXISTING IMAGES
  // ======================================================

  const [existingImages, setExistingImages] = useState([]);

  // ======================================================
  // NEW IMAGE FILES
  // ======================================================

  const [newImageFiles, setNewImageFiles] = useState([]);

  // ======================================================
  // EXISTING PDF
  // ======================================================

  const [existingPdf, setExistingPdf] = useState("");

  // ======================================================
  // NEW PDF
  // ======================================================

  const [newPdfFile, setNewPdfFile] = useState(null);

  // ======================================================
  // BRANDS
  // ======================================================

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  // ======================================================
  // PAGE STATES
  // ======================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================================================
  // TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ======================================================
  // FETCH PRODUCT
  // ======================================================

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/products/getProductById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Product Response:",
        response.data
      );

      const product =
        response.data.product ||
        response.data;

      // ==================================================
      // BASIC DETAILS
      // ==================================================

      setProductName(
        product.productName || ""
      );

      setModelNumber(
        product.modelNumber || ""
      );

      setShortDescription(
        product.shortDescription || ""
      );

      setProductDescription(
        product.productDescription || ""
      );

      setCategory(
        product.category || ""
      );

      setBrandName(
        product.brandName || ""
      );

      setUnit(
        product.unit || ""
      );

      setPrice(
        product.price ?? ""
      );

      setStock(
        product.stock ?? ""
      );

      setStatus(
        product.status || "Active"
      );

      // ==================================================
      // EXISTING IMAGES
      // ==================================================

      setExistingImages(
        Array.isArray(product.Image)
          ? product.Image
          : []
      );

      // ==================================================
      // EXISTING PDF
      // ==================================================

      setExistingPdf(
        product.pdfFile || ""
      );

    } catch (error) {
      console.error(
        "Fetch Product Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load product."
      );

      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
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

      console.log(
        "Brands Response:",
        response.data
      );

      setBrands(
        response.data.brands || []
      );

    } catch (error) {
      console.error(
        "Fetch Brands Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load brands."
      );
    } finally {
      setBrandsLoading(false);
    }
  };

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchBrands();
    }
  }, [id]);

  // ======================================================
  // GET ALL CATEGORIES
  // ======================================================

  const categories = useMemo(() => {
    const allCategories = brands.flatMap(
      (brand) =>
        Array.isArray(brand.category)
          ? brand.category
          : []
    );

    return [
      ...new Set(allCategories),
    ];
  }, [brands]);

  // ======================================================
  // ADD NEW IMAGES
  // ======================================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    const totalImages =
      existingImages.length +
      newImageFiles.length +
      selectedFiles.length;

    if (totalImages > 5) {
      alert(
        "You can have a maximum of 5 product images."
      );
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

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        alert(
          `${file.name} is larger than 5MB.`
        );
        return;
      }
    }

    setNewImageFiles((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    e.target.value = "";
  };

  // ======================================================
  // REMOVE EXISTING IMAGE
  // ======================================================

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ======================================================
  // REMOVE NEW IMAGE
  // ======================================================

  const removeNewImage = (index) => {
    setNewImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ======================================================
  // PDF CHANGE
  // ======================================================

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf"
    ) {
      alert(
        "Please upload a PDF file."
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "PDF size must be less than 10MB."
      );
      return;
    }

    setNewPdfFile(file);

    e.target.value = "";
  };

  // ======================================================
  // REMOVE EXISTING PDF
  // ======================================================

  const removeExistingPdf = () => {
    setExistingPdf("");
  };

  // ======================================================
  // REMOVE NEW PDF
  // ======================================================

  const removeNewPdf = () => {
    setNewPdfFile(null);
  };

  // ======================================================
  // TOTAL IMAGE COUNT
  // ======================================================

  const totalImageCount =
    existingImages.length +
    newImageFiles.length;

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!productName.trim()) {
      alert(
        "Please enter product name."
      );
      return;
    }

    if (!modelNumber.trim()) {
      alert(
        "Please enter SKU / Model Number."
      );
      return;
    }

    if (!shortDescription.trim()) {
      alert(
        "Please enter short description."
      );
      return;
    }

    if (!productDescription.trim()) {
      alert(
        "Please enter product details."
      );
      return;
    }

    if (!category) {
      alert(
        "Please select a category."
      );
      return;
    }

    if (!brandName) {
      alert(
        "Please select a brand."
      );
      return;
    }

    if (!unit.trim()) {
      alert(
        "Please enter unit."
      );
      return;
    }

    if (price === "") {
      alert(
        "Please enter product price."
      );
      return;
    }

    if (stock === "") {
      alert(
        "Please enter stock quantity."
      );
      return;
    }

    if (Number(price) < 0) {
      alert(
        "Price cannot be negative."
      );
      return;
    }

    if (Number(stock) < 0) {
      alert(
        "Stock quantity cannot be negative."
      );
      return;
    }

    if (totalImageCount > 5) {
      alert(
        "Maximum 5 product images are allowed."
      );
      return;
    }

    try {
      setSaving(true);

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
      // EXISTING IMAGES
      //
      // Send remaining existing image URLs.
      // Backend must support this field.
      // ==================================================

      existingImages.forEach(
        (image) => {
          formData.append(
            "existingImages",
            image
          );
        }
      );

      // ==================================================
      // NEW IMAGES
      // ==================================================

      newImageFiles.forEach(
        (file) => {
          formData.append(
            "Image",
            file
          );
        }
      );

      // ==================================================
      // EXISTING PDF
      // ==================================================

      if (existingPdf) {
        formData.append(
          "existingPdf",
          existingPdf
        );
      }

      // ==================================================
      // NEW PDF
      // ==================================================

      if (newPdfFile) {
        formData.append(
          "pdfFile",
          newPdfFile
        );
      }

      console.log(
        "Updating Product..."
      );

      // ==================================================
      // API
      // ==================================================

      const response =
        await axios.put(
          `${API_BASE_URL}/products/updateProduct/${id}`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Update Product Response:",
        response.data
      );

      alert(
        response.data.message ||
          "Product updated successfully."
      );

      navigate("/admin/products");

    } catch (error) {
      console.error(
        "Update Product Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update product."
      );

    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // CANCEL
  // ======================================================

  const handleCancel = () => {
    if (saving) return;

    navigate("/admin/products");
  };

  // ======================================================
  // LOADING SCREEN
  // ======================================================

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
        <div className="flex flex-col items-center gap-3">

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

          <p className="text-sm text-gray-500">
            Loading product...
          </p>

        </div>
      </div>
    );
  }

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

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
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

          <div>

            <h1
              className="
                text-xl
                md:text-2xl
                font-semibold
                text-gray-900
              "
            >
              Edit Product
            </h1>

            <p
              className="
                text-xs
                md:text-sm
                text-gray-500
                mt-1
              "
            >
              Update your product information
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
                LEFT
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

                <div
                  className="
                    px-6
                    py-5
                    border-b
                    border-gray-100
                  "
                >

                  <h2 className="text-base font-semibold text-gray-900">
                    Product Information
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Update the product details below.
                  </p>

                </div>

                <div className="p-6 space-y-6">

                  {/* NAME + MODEL */}

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
                        disabled={saving}
                        placeholder="Enter product name"
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

                    {/* MODEL */}

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
                        disabled={saving}
                        placeholder="Enter SKU or model number"
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
                      disabled={saving}
                      placeholder="Enter short description about the product"
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

                  {/* PRODUCT DESCRIPTION */}

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
                      disabled={saving}
                      placeholder="Enter product details, specifications, features, usage, etc."
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
                          saving ||
                          brandsLoading
                        }
                        className="
                          w-full
                          h-11
                          px-3
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-sm
                          text-gray-700
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
                          saving ||
                          brandsLoading
                        }
                        className="
                          w-full
                          h-11
                          px-3
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-sm
                          text-gray-700
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

                        {brands.map(
                          (brand) => (
                            <option
                              key={brand._id}
                              value={
                                brand.brandName
                              }
                            >
                              {
                                brand.brandName
                              }
                            </option>
                          )
                        )}

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
                        disabled={saving}
                        placeholder="e.g. Piece"
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
                        disabled={saving}
                        placeholder="Enter price"
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
                        disabled={saving}
                        placeholder="Enter stock quantity"
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
                    Choose the current status of this product.
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
                    disabled={saving}
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
                      text-left
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

                      <div>

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
                    disabled={saving}
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
                      text-left
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

                      <div>

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
                  IMAGES
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
                    Manage product images. Maximum 5.
                  </p>

                </div>

                <div className="p-5">

                  {/* UPLOAD */}

                  <label
                    htmlFor="product-images-edit"
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
                      p-6
                      text-center
                    "
                  >

                    <input
                      id="product-images-edit"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      multiple
                      onChange={
                        handleImageChange
                      }
                      disabled={
                        saving ||
                        totalImageCount >= 5
                      }
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
                      Add product images
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, WEBP or SVG
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      {totalImageCount}/5 images
                    </p>

                  </label>

                  {/* EXISTING IMAGES */}

                  {existingImages.length >
                    0 && (
                    <div className="mt-5">

                      <p className="text-xs font-medium text-gray-600 mb-3">
                        Current Images
                      </p>

                      <div
                        className="
                          grid
                          grid-cols-3
                          gap-3
                        "
                      >

                        {existingImages.map(
                          (image, index) => (
                            <div
                              key={`${image}-${index}`}
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
                                src={image}
                                alt={`Product ${
                                  index + 1
                                }`}
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
                                  removeExistingImage(
                                    index
                                  )
                                }
                                disabled={saving}
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

                    </div>
                  )}

                  {/* NEW IMAGES */}

                  {newImageFiles.length >
                    0 && (
                    <div className="mt-5">

                      <p className="text-xs font-medium text-gray-600 mb-3">
                        New Images
                      </p>

                      <div
                        className="
                          grid
                          grid-cols-3
                          gap-3
                        "
                      >

                        {newImageFiles.map(
                          (file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="
                                relative
                                aspect-square
                                rounded-lg
                                border
                                border-orange-200
                                bg-orange-50
                                overflow-hidden
                              "
                            >

                              <img
                                src={URL.createObjectURL(
                                  file
                                )}
                                alt={`New product ${
                                  index + 1
                                }`}
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
                                  removeNewImage(
                                    index
                                  )
                                }
                                disabled={saving}
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

                    </div>
                  )}

                  {totalImageCount ===
                    0 && (
                    <div className="py-6 text-center text-gray-300">

                      <ImagePlus
                        size={28}
                        className="mx-auto mb-2"
                      />

                      <p className="text-xs">
                        No product images
                      </p>

                    </div>
                  )}

                </div>
              </div>

              {/* ==================================================
                  PDF
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
                    Manage datasheet or product manual.
                  </p>

                </div>

                <div className="p-5">

                  {/* NEW PDF */}

                  {newPdfFile ? (

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

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {newPdfFile.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {(
                              newPdfFile.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                          <p className="text-[10px] text-orange-500 mt-1">
                            New PDF selected
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={
                            removeNewPdf
                          }
                          disabled={saving}
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

                  ) : existingPdf ? (

                    <div
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
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
                            border-gray-200
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

                          <p className="text-sm font-medium text-gray-800">
                            Current PDF
                          </p>

                          <a
                            href={existingPdf}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              text-xs
                              text-orange-500
                              hover:text-orange-600
                              truncate
                              block
                              mt-1
                            "
                          >
                            View product document
                          </a>

                        </div>

                        <button
                          type="button"
                          onClick={
                            removeExistingPdf
                          }
                          disabled={saving}
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

                  ) : (

                    <div className="text-center py-2">

                      <p className="text-xs text-gray-400 mb-4">
                        No PDF currently attached
                      </p>

                    </div>

                  )}

                  {/* PDF UPLOAD */}

                  <label
                    htmlFor="product-pdf-edit"
                    className="
                      mt-4
                      block
                      cursor-pointer
                      rounded-xl
                      border-2
                      border-dashed
                      border-orange-200
                      bg-orange-50/30
                      hover:bg-orange-50
                      transition
                      p-5
                      text-center
                    "
                  >

                    <input
                      id="product-pdf-edit"
                      type="file"
                      accept="application/pdf"
                      onChange={
                        handlePdfChange
                      }
                      disabled={saving}
                      className="hidden"
                    />

                    <UploadCloud
                      size={23}
                      className="
                        mx-auto
                        text-orange-500
                        mb-2
                      "
                    />

                    <p className="text-xs font-medium text-gray-700">
                      {existingPdf
                        ? "Replace PDF"
                        : "Upload PDF"}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      PDF only • Maximum 10MB
                    </p>

                  </label>

                </div>
              </div>

              {/* ==================================================
                  SUMMARY
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
                      Review your changes
                    </p>

                  </div>

                </div>

                <div className="space-y-3">

                  <div className="flex justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Product
                    </span>

                    <span className="text-xs font-medium text-gray-800 truncate max-w-[150px]">
                      {productName ||
                        "Not entered"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between">

                    <span className="text-xs text-gray-500">
                      Brand
                    </span>

                    <span className="text-xs font-medium text-gray-800">
                      {brandName ||
                        "Not selected"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between">

                    <span className="text-xs text-gray-500">
                      Category
                    </span>

                    <span className="text-xs font-medium text-gray-800">
                      {category ||
                        "Not selected"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between">

                    <span className="text-xs text-gray-500">
                      Images
                    </span>

                    <span className="text-xs font-medium text-gray-800">
                      {totalImageCount}/5
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between">

                    <span className="text-xs text-gray-500">
                      PDF
                    </span>

                    <span
                      className={`
                        text-xs
                        font-medium
                        ${
                          newPdfFile ||
                          existingPdf
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {newPdfFile ||
                      existingPdf
                        ? "Attached"
                        : "Not attached"}
                    </span>

                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between items-center">

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

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
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

            <button
              type="submit"
              disabled={saving}
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

              {saving
                ? "Updating..."
                : "Update Product"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ProductEdit;