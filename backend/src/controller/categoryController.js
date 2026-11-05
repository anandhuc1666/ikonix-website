
import Category from "../model/category.js";
import Brand from "../model/brandSchema.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// ==========================================
// CLOUDINARY IMAGE UPLOAD
// ==========================================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ikonix/categories",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// ==========================================
// GET CLOUDINARY PUBLIC ID
// ==========================================

const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;

  const match = imageUrl.match(
    /\/upload\/(?:v\d+\/)?(.+)\.[^/.]+$/
  );

  return match ? match[1] : null;
};

// ==========================================
// DELETE CLOUDINARY IMAGE
// ==========================================

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    const publicId = getCloudinaryPublicId(imageUrl);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary image deletion error:", error);
  }
};

// ==========================================
// GET BRAND CATEGORY NAMES
// ==========================================

const getBrandCategoryNames = (brand) => {
  return (brand.category || [])
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return typeof item?.category === "string"
        ? item.category.trim()
        : "";
    })
    .filter(Boolean);
};

// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async (req, res) => {
  let uploadedImage = null;

  try {
    const categoryName =
      req.body.category ??
      req.body.categoryName ??
      req.body.CategoryName;

    const brandName =
      req.body.brandName ??
      req.body.BrandName;

    const section =
      req.body.section || "Main Categories";

    // Validate fields
    if (
      typeof categoryName !== "string" ||
      !categoryName.trim() ||
      typeof brandName !== "string" ||
      !brandName.trim()
    ) {
      return res.status(400).json({
        message: "Category name and brand are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a category image",
      });
    }

    // Find brand
    const brand = await Brand.findOne({
      brandName: brandName.trim(),
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    const cleanCategory = categoryName.trim();

    // Check whether category belongs to this brand
    const brandCategories = getBrandCategoryNames(brand);

    const categoryExists = brandCategories.some(
      (item) =>
        item.toLowerCase() === cleanCategory.toLowerCase()
    );

    if (!categoryExists) {
      return res.status(400).json({
        message: "Selected category does not belong to this brand",
      });
    }

    // Check existing category
    const existingCategory = await Category.findOne({
      category: cleanCategory,
      brand: brand._id,
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "This category already exists for this brand",
        category: existingCategory,
      });
    }

    // Upload image
    uploadedImage = await uploadToCloudinary(req.file.buffer);

    // Save separate category document
    const newCategory = await Category.create({
      category: cleanCategory,
      categoryImage: uploadedImage.secure_url,
      brand: brand._id,
      brandName: brand.brandName,
      section,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });

  } catch (error) {
    console.error("Create category error:", error);

    // Remove uploaded image if database save fails
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          uploadedImage.public_id
        );
      } catch (cleanupError) {
        console.error("Image cleanup error:", cleanupError);
      }
    }

    if (error.code === 11000) {
      console.error("Duplicate index:", {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
      });

      return res.status(409).json({
        message: "Duplicate category detected in MongoDB",
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("brand", "brandName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      total: categories.length,
      categories,
    });

  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET CATEGORIES BY BRAND
// ==========================================

export const getCategoriesByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res.status(400).json({
        message: "Invalid brand ID",
      });
    }

    const categories = await Category.find({
      brand: brandId,
    }).populate("brand", "brandName");

    return res.status(200).json({
      success: true,
      total: categories.length,
      categories,
    });

  } catch (error) {
    console.error("Get categories by brand error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (req, res) => {
  let uploadedImage = null;

  try {
    const { id } = req.params;

    const categoryName =
      req.body.category ??
      req.body.categoryName ??
      req.body.CategoryName;

    const brandName =
      req.body.brandName ??
      req.body.BrandName;

    const section = req.body.section;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    // Find existing category
    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Validate category name
    const cleanCategory =
      typeof categoryName === "string"
        ? categoryName.trim()
        : existingCategory.category;

    if (!cleanCategory) {
      return res.status(400).json({
        message: "Valid category name is required",
      });
    }

    // Find selected brand
    let selectedBrand;

    if (brandName) {
      selectedBrand = await Brand.findOne({
        brandName: brandName.trim(),
      });
    } else {
      selectedBrand = await Brand.findById(
        existingCategory.brand
      );
    }

    if (!selectedBrand) {
      return res.status(404).json({
        message: "Associated brand not found",
      });
    }

    // Verify category belongs to selected brand
    const brandCategories = getBrandCategoryNames(selectedBrand);

    const categoryBelongsToBrand = brandCategories.some(
      (item) =>
        item.toLowerCase() === cleanCategory.toLowerCase()
    );

    if (!categoryBelongsToBrand) {
      return res.status(400).json({
        message: "Selected category does not belong to this brand",
      });
    }

    // Check duplicate excluding current document
    const duplicate = await Category.findOne({
      _id: { $ne: id },
      category: cleanCategory,
      brand: selectedBrand._id,
    });

    if (duplicate) {
      return res.status(409).json({
        message: "This category already exists for this brand",
      });
    }

    // Prepare update data
    const updateData = {
      category: cleanCategory,
      brand: selectedBrand._id,
      brandName: selectedBrand.brandName,
    };

    if (section !== undefined) {
      updateData.section = section;
    }

    // Upload replacement image if provided
    if (req.file) {
      uploadedImage = await uploadToCloudinary(req.file.buffer);

      updateData.categoryImage = uploadedImage.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("brand", "brandName");

    if (!updatedCategory) {
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(
          uploadedImage.public_id
        );
      }

      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Delete previous image only after successful update
    if (req.file && existingCategory.categoryImage) {
      await deleteCloudinaryImage(
        existingCategory.categoryImage
      );
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });

  } catch (error) {
    console.error("Update category error:", error);

    // Cleanup newly uploaded image if update fails
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          uploadedImage.public_id
        );
      } catch (cleanupError) {
        console.error("Image cleanup error:", cleanupError);
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate category detected in MongoDB",
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Delete category image
    if (category.categoryImage) {
      await deleteCloudinaryImage(
        category.categoryImage
      );
    }

    // Delete only Category document
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
