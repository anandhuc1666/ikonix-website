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
      status,
       brandAbout
    } = req.body;

    // ------------------------------
    // VALIDATION
    // ------------------------------

    if (!brandName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    // ------------------------------
    // CHECK DUPLICATE BRAND
    // ------------------------------

    const existingBrand = await Brand.findOne({
      brandName: brandName.trim(),
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    // ------------------------------
    // GET IMAGE
    // ------------------------------

    const imageFile = req.file;

    let imageUrl = "";

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

    // ------------------------------
    // CREATE BRAND
    // ------------------------------

    const brand = new Brand({
      Image: imageUrl,
      brandName: brandName.trim(),
      category: Array.isArray(category)
        ? category
        : category
          ? [category]
          : [],
      status: status || "Active",
       brandAbout
    });

    const savedBrand = await brand.save();

    // ------------------------------
    // RESPONSE
    // ------------------------------

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
    const brands = await Brand.find()
      .sort({ createdAt: -1 });

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
      status,
      brandAbout,
    } = req.body;

    // ------------------------------
    // FIND BRAND
    // ------------------------------

    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // ------------------------------
    // CHECK DUPLICATE BRAND NAME
    // ------------------------------

    if (brandName !== undefined) {
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

    // ------------------------------
    // UPDATE BRAND ABOUT
    // ------------------------------

    if (brandAbout !== undefined) {
      existingBrand.brandAbout = brandAbout.trim();
    }

    // ------------------------------
    // UPDATE CATEGORY
    // ------------------------------

    if (category !== undefined) {
      existingBrand.category = Array.isArray(category)
        ? category
        : category
          ? [category]
          : [];
    }

    // ------------------------------
    // UPDATE STATUS
    // ------------------------------

    if (status !== undefined) {
      existingBrand.status = status;
    }

    // ------------------------------
    // UPDATE IMAGE
    // ------------------------------

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

    // ------------------------------
    // SAVE
    // ------------------------------

    const updatedBrand = await existingBrand.save();

    // ------------------------------
    // RESPONSE
    // ------------------------------

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