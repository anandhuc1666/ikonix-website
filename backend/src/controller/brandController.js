
import mongoose from "mongoose";
import Brand from "../model/brandSchema.js";
import cloudinary from "../config/cloudinary.js";

// ======================================================
// CLOUDINARY BUFFER UPLOAD
// ======================================================

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// ======================================================
// NORMALIZE CATEGORY INPUT
// Supports JSON arrays and legacy string categories.
// ======================================================

const parseCategories = (value, legacyImage = "") => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  let categories = value;

  // FormData sends JSON values as strings.
  if (typeof categories === "string") {
    try {
      categories = JSON.parse(categories);
    } catch {
      // Support a single legacy category string.
      categories = [categories];
    }
  }

  if (!Array.isArray(categories)) {
    throw new Error("Categories must be an array.");
  }

  const normalized = categories.map((item) => {
    // Legacy format: ["Air Flow Meters", "Battery Testers"]
    if (typeof item === "string") {
      const categoryName = item.trim();

      if (!categoryName) {
        throw new Error("Category name cannot be empty.");
      }

      return {
        categoryName,
        categoryIMAGE: legacyImage,
      };
    }

    // New format:
    // [{ categoryName, categoryIMAGE }]
    if (item && typeof item === "object") {
      const categoryName = String(item.categoryName || "").trim();
      const categoryIMAGE =
        typeof item.categoryIMAGE === "string"
          ? item.categoryIMAGE.trim()
          : "";

      if (!categoryName) {
        throw new Error("Category name cannot be empty.");
      }

      if (item.categoryIMAGE !== undefined &&
          typeof item.categoryIMAGE !== "string") {
        throw new Error("Category image must be a string.");
      }

      return {
        ...(item._id && mongoose.isValidObjectId(item._id)
          ? { _id: item._id }
          : {}),
        categoryName,
        categoryIMAGE,
      };
    }

    throw new Error("Invalid category format.");
  });

  // Reject duplicate names within this brand.
  const names = normalized.map((item) =>
    item.categoryName.toLowerCase()
  );

  if (new Set(names).size !== names.length) {
    throw new Error("Duplicate category names are not allowed.");
  }

  return normalized;
};

// ======================================================
// CREATE BRAND
// ======================================================

export const createBrand = async (req, res) => {
  try {
    const {
      brandName,
      category,
      categoryIMAGE,
      status,
      brandAbout,
    } = req.body;

    if (typeof brandName !== "string" || !brandName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required.",
      });
    }

    const trimmedBrandName = brandName.trim();

    const existingBrand = await Brand.findOne({
      brandName: trimmedBrandName,
    });

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists.",
      });
    }

    if (
      status !== undefined &&
      !["Active", "Inactive"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Inactive.",
      });
    }

    let categories;

    try {
      categories = parseCategories(category, categoryIMAGE || "");
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "ikonix/brands",
        resource_type: "image",
      });

      imageUrl = result.secure_url;
    }

    const brand = new Brand({
      Image: imageUrl,
      brandName: trimmedBrandName,
      category: categories,
      status: status || "Active",
      brandAbout:
        typeof brandAbout === "string" ? brandAbout.trim() : "",
    });

    const savedBrand = await brand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully.",
      brand: savedBrand,
    });
  } catch (error) {
    console.error("Create Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create brand.",
    });
  }
};

// ======================================================
// GET ALL BRANDS
// ======================================================

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error) {
    console.error("Get Brands Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch brands.",
    });
  }
};

// ======================================================
// GET BRAND BY ID
// ======================================================

export const getBrandById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
    }

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    return res.status(200).json({
      success: true,
      brand,
    });
  } catch (error) {
    console.error("Get Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch brand.",
    });
  }
};

// ======================================================
// UPDATE BRAND
// ======================================================

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
    }

    const {
      brandName,
      category,
      categoryIMAGE,
      status,
      brandAbout,
    } = req.body;

    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    // Update brand name.
    if (brandName !== undefined) {
      if (typeof brandName !== "string" || !brandName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Brand name cannot be empty.",
        });
      }

      const trimmedBrandName = brandName.trim();

      const duplicateBrand = await Brand.findOne({
        brandName: trimmedBrandName,
        _id: { $ne: id },
      });

      if (duplicateBrand) {
        return res.status(409).json({
          success: false,
          message: "Brand already exists.",
        });
      }

      existingBrand.brandName = trimmedBrandName;
    }

    // Update brand description.
    if (brandAbout !== undefined) {
      if (typeof brandAbout !== "string") {
        return res.status(400).json({
          success: false,
          message: "Brand description must be a string.",
        });
      }

      existingBrand.brandAbout = brandAbout.trim();
    }

    // Update category objects without changing other brand fields.
    if (category !== undefined) {
      let categories;

      try {
        // Keep existing legacy image support only for legacy input.
        categories = parseCategories(
          category,
          typeof categoryIMAGE === "string"
            ? categoryIMAGE.trim()
            : ""
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      existingBrand.category = categories;
    }

    // Validate status.
    if (status !== undefined) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be Active or Inactive.",
        });
      }

      existingBrand.status = status;
    }

    // Update main brand image.
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "ikonix/brands",
        resource_type: "image",
      });

      existingBrand.Image = result.secure_url;
    }

    const updatedBrand = await existingBrand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      brand: updatedBrand,
    });
  } catch (error) {
    console.error("Update Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update brand.",
    });
  }
};

// ======================================================
// DELETE BRAND
// ======================================================

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    await Brand.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete brand.",
    });
  }
};
