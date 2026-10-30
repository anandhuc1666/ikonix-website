import Category from "../model/category.js";
import Brand from "../model/brandSchema.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// Upload image to Cloudinary
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

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  const { categoryName, brandName, section } = req.body;

  try {
    if (!categoryName?.trim() || !brandName || !section) {
      return res.status(400).json({
        message: "Category name, brand and section are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a category image",
      });
    }

    const brand = await Brand.findOne({ brandName });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    const existingCategory = await Category.findOne({
      categoryName: categoryName.trim(),
      brand: brand._id,
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "This category already exists for this brand",
      });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    const newCategory = await Category.create({
      categoryName: categoryName.trim(),
      categoryImage: uploadedImage.secure_url,
      brand: brand._id,
      brandName: brand.brandName,
      section,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("brand", "brandName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, brandName, section } = req.body;

  try {
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

    let brand = null;

    if (brandName) {
      brand = await Brand.findOne({ brandName });

      if (!brand) {
        return res.status(404).json({
          message: "Brand not found",
        });
      }
    }

    const updatedName = categoryName?.trim() || category.categoryName;
    const updatedBrand = brand || await Brand.findById(category.brand);

    if (!updatedBrand) {
      return res.status(404).json({
        message: "Associated brand not found",
      });
    }

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      categoryName: updatedName,
      brand: updatedBrand._id,
    });

    if (duplicate) {
      return res.status(409).json({
        message: "This category already exists for this brand",
      });
    }

    const updateData = {
      categoryName: updatedName,
      brand: updatedBrand._id,
      brandName: updatedBrand.brandName,
    };

    if (section !== undefined) {
      updateData.section = section;
    }

    // Upload a new image only when one is selected
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      updateData.categoryImage = uploadedImage.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("brand", "brandName");

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
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

    // Delete the Cloudinary image
    if (category.categoryImage) {
      try {
        const urlParts = category.categoryImage.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `ikonix/categories/${fileName.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (imageError) {
        console.error("Cloudinary image deletion error:", imageError);
      }
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};