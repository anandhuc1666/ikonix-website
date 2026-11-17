import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImagePlus, Upload, Trash2, Megaphone, Loader2 } from "lucide-react";

function Order() {
  const API_BASE_URL = "https://ikonix-backend-sandy.vercel.app/api";
  // const API_BASE_URL ="http://localhost:5000/api";
  // Cloudinary configuration
  // Replace these with your existing Cloudinary values.
  const CLOUDINARY_CLOUD_NAME = "dkxluyjyz";
  const CLOUDINARY_UPLOAD_PRESET = "ml_default";

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    brand: "",
    isActive: true,
    sortOrder: 0,
    startDate: "",
    endDate: "",
  });

  // GET BRANDS
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await axios.get(
          `${API_BASE_URL}/brands/getAllBrands`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setBrands(response.data.brands || []);
      } catch (error) {
        console.error("Brand fetch error:", error);
      }
    };

    fetchBrands();
  }, []);

  // FORM INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // CLOUDINARY IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5 MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
      );

      setFormData((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));

      alert("Advertisement image uploaded successfully.");
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setPreview("");
      alert("Image upload failed. Check your Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  // SAVE ADVERTISEMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.image || !formData.brand) {
      alert("Please enter the title, upload an image and select a brand.");
      return;
    }

    if (uploading) {
      alert("Please wait for the image upload to finish.");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder) || 0,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      const response = await axios.post(
        `${API_BASE_URL}/advertisements/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message || "Advertisement created successfully!");

      setFormData({
        title: "",
        description: "",
        image: "",
        brand: "",
        isActive: true,
        sortOrder: 0,
        startDate: "",
        endDate: "",
      });

      setPreview("");
      document.getElementById("adImageInput").value = "";
    } catch (error) {
      console.error(
        "Advertisement save error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to create advertisement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-orange-100 p-3">
          <Megaphone className="text-[#e85d04]" size={25} />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Advertisement Management
          </h1>
          <p className="text-sm text-gray-500">
            Upload and manage promotional banners for IKONIX.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]"
      >
        {/* FORM SECTION */}
        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 className="border-b pb-4 text-lg font-semibold text-gray-800">
            Advertisement Details
          </h2>

          {/* TITLE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Advertisement Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter advertisement title"
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#e85d04]"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter advertisement description"
              className="w-full resize-none rounded-xl border border-gray-200 p-3 outline-none focus:border-[#e85d04]"
            />
          </div>

          {/* BRAND */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Brand *
            </label>

            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-[#e85d04]"
              required
            >
              <option value="">Choose a brand</option>

              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Advertisement Banner *
            </label>

            <label
              htmlFor="adImageInput"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-[#e85d04]"
            >
              {uploading ? (
                <Loader2 size={35} className="animate-spin text-[#e85d04]" />
              ) : (
                <ImagePlus size={35} className="text-[#e85d04]" />
              )}

              <p className="mt-3 text-sm font-medium text-gray-700">
                {uploading ? "Uploading image..." : "Click to upload banner"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG or WEBP (maximum 5 MB)
              </p>

              <input
                id="adImageInput"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {preview && (
              <div className="relative mt-4 overflow-hidden rounded-xl border">
                <img
                  src={preview}
                  alt="Advertisement preview"
                  className="h-48 w-full object-contain bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setFormData((prev) => ({
                      ...prev,
                      image: "",
                    }));
                    document.getElementById("adImageInput").value = "";
                  }}
                  className="absolute right-3 top-3 rounded-lg bg-red-500 p-2 text-white"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )}
          </div>

          {/* DISPLAY ORDER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Display Order
            </label>

            <input
              type="number"
              min="0"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#e85d04]"
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || undefined}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none"
              />
            </div>
          </div>

          {/* STATUS */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 p-4">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 accent-[#e85d04]"
            />

            <span className="text-sm font-medium text-gray-700">
              Activate this advertisement
            </span>
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload size={18} />
                Save Advertisement
              </>
            )}
          </button>
        </div>

        {/* PREVIEW SECTION */}
        <div className="h-fit rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Advertisement Preview
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="Banner preview"
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="flex h-44 flex-col items-center justify-center bg-gray-50 text-gray-400">
                <ImagePlus size={35} />
                <p className="mt-2 text-xs">Banner preview will appear here</p>
              </div>
            )}

            <div className="space-y-2 p-4">
              <p className="text-xs font-semibold uppercase text-[#e85d04]">
                IKONIX Advertisement
              </p>

              <h3 className="font-semibold text-gray-800">
                {formData.title || "Advertisement Title"}
              </h3>

              <p className="text-sm text-gray-500">
                {formData.description || "Advertisement description"}
              </p>

              <p className="text-xs text-gray-400">
                Brand:{" "}
                {brands.find((b) => b._id === formData.brand)?.brandName ||
                  "Not selected"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-400">
            Customers will see active advertisements on the main product page.
            Clicking a banner will open the associated brand page once the
            frontend carousel is connected.
          </p>
        </div>
      </form>
    </div>
  );
}

export default Order;
