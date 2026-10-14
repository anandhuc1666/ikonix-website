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

    // Validate brand name
    if (!brandName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    // Check duplicate brand
    const existingBrand = await Brand.findOne({
      brandName: brandName.trim(),
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    // Upload main brand image
    let imageUrl = "";
    const imageFile = req.file;

    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile.buffer,
        {
          folder: "ikonix/brands",
          resource_type: "image",
        }
      );

      imageUrl = result.secure_url;
    }

    // Create brand
    const brand = new Brand({
      Image: imageUrl,
      brandName: brandName.trim(),

      category: Array.isArray(category)
        ? category
        : category
          ? [category]
          : [],

      // Save category image URL
      categoryIMAGE: categoryIMAGE?.trim() || "",

      status: status || "Active",
      brandAbout: brandAbout || "",
    });

    const savedBrand = await brand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand: savedBrand,
    });
  } catch (error) {
    console.error("Create Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL BRANDS
// ======================================================

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error) {
    console.error("Get Brands Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET BRAND BY ID
// ======================================================

export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
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
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE BRAND
// ======================================================

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      brandName,
      category,
      categoryIMAGE,
      status,
      brandAbout,
    } = req.body;

    // Find brand
    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // ----------------------------------------------
    // UPDATE BRAND NAME
    // ----------------------------------------------

    if (brandName !== undefined) {
      if (!brandName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Brand name cannot be empty",
        });
      }

      const trimmedBrandName = brandName.trim();

      const duplicateBrand = await Brand.findOne({
        brandName: trimmedBrandName,
        _id: { $ne: id },
      });

      if (duplicateBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand already exists",
        });
      }

      existingBrand.brandName = trimmedBrandName;
    }

    // ----------------------------------------------
    // UPDATE BRAND DESCRIPTION
    // ----------------------------------------------

    if (brandAbout !== undefined) {
      existingBrand.brandAbout = brandAbout.trim();
    }

    // ----------------------------------------------
    // UPDATE CATEGORIES
    // ----------------------------------------------

    if (category !== undefined) {
      existingBrand.category = Array.isArray(category)
        ? category
        : category
          ? [category]
          : [];
    }

    // ----------------------------------------------
    // UPDATE CATEGORY IMAGE URL
    // ----------------------------------------------

    if (categoryIMAGE !== undefined) {
      existingBrand.categoryIMAGE =
        typeof categoryIMAGE === "string"
          ? categoryIMAGE.trim()
          : existingBrand.categoryIMAGE;
    }

    // ----------------------------------------------
    // UPDATE STATUS
    // ----------------------------------------------

    if (status !== undefined) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be Active or Inactive",
        });
      }

      existingBrand.status = status;
    }

    // ----------------------------------------------
    // UPDATE MAIN BRAND IMAGE
    // ----------------------------------------------

    const imageFile = req.file;

    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile.buffer,
        {
          folder: "ikonix/brands",
          resource_type: "image",
        }
      );

      existingBrand.Image = result.secure_url;
    }

    // ----------------------------------------------
    // SAVE BRAND
    // ----------------------------------------------

    const updatedBrand = await existingBrand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    console.error("Update Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DELETE BRAND
// ======================================================

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    await Brand.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
