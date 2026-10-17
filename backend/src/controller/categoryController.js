
import mongoose from "mongoose";
import Brand from "../model/brandSchema.js";

// ======================================================
// HELPER: NORMALIZE CATEGORIES
// Supports legacy string categories and category objects.
// ======================================================

const normalizeCategories = (brand) => {
  if (!Array.isArray(brand.category)) {
    return [];
  }

  return brand.category
    .map((item) => {
      if (typeof item === "string") {
        const categoryName = item.trim();

        if (!categoryName) return null;

        return {
          categoryName,
          categoryIMAGE: brand.categoryIMAGE || "",
        };
      }

      if (item && typeof item === "object") {
        const categoryName = String(item.categoryName || "").trim();

        if (!categoryName) return null;

        return {
          _id: item._id ? String(item._id) : undefined,
          categoryName,
          categoryIMAGE: item.categoryIMAGE || "",
        };
      }

      return null;
    })
    .filter(Boolean);
};

const normalizeName = (name) =>
  String(name || "").trim().toLowerCase();

const saveCategories = (brand, categories) => {
  brand.category = categories.map((item) => ({
    ...(item._id ? { _id: item._id } : {}),
    categoryName: item.categoryName,
    categoryIMAGE: item.categoryIMAGE || "",
  }));
};

// ======================================================
// GET ALL CATEGORIES
// GET /api/categories/getAllCategories
// ======================================================

export const getAllCategories = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    const categories = [];

    for (const brand of brands) {
      const brandCategories = normalizeCategories(brand);

      for (const item of brandCategories) {
        categories.push({
          _id:
            item._id ||
            `${brand._id}-${normalizeName(item.categoryName)}`,
          brandId: String(brand._id),
          brandName: brand.brandName || "",
          categoryName: item.categoryName,
          categoryIMAGE: item.categoryIMAGE || "",
        });
      }
    }

    categories.sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
};

// ======================================================
// CREATE CATEGORY
// POST /api/categories/createCategory
//
// Body:
// {
//   "brandId": "BRAND_ID",
//   "category": "Air Flow Meters",
//   "categoryIMAGE": "https://example.com/image.jpg"
// }
// ======================================================

export const createCategory = async (req, res) => {
  try {
    const { brandId, category, categoryIMAGE = "" } = req.body;

    if (!brandId || !mongoose.isValidObjectId(brandId)) {
      return res.status(400).json({
        success: false,
        message: "A valid brandId is required.",
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    if (typeof categoryIMAGE !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category image must be a string.",
      });
    }

    const name = category.trim();

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    // Category names are unique across all brands.
    const brands = await Brand.find();

    const duplicateExists = brands.some((existingBrand) =>
      normalizeCategories(existingBrand).some(
        (item) => normalizeName(item.categoryName) === normalizeName(name)
      )
    );

    if (duplicateExists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const categories = normalizeCategories(brand);

    categories.push({
      categoryName: name,
      categoryIMAGE: categoryIMAGE.trim(),
    });

    saveCategories(brand, categories);
    await brand.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category: {
        brandId: String(brand._id),
        brandName: brand.brandName,
        categoryName: name,
        categoryIMAGE: categoryIMAGE.trim(),
      },
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
    });
  }
};

// ======================================================
// UPDATE CATEGORY
// PUT /api/categories/updateCategory
//
// Body:
// {
//   "brandId": "BRAND_ID",
//   "oldCategory": "Air Flow Meters",
//   "category": "Air Flow Instruments",
//   "categoryIMAGE": "https://example.com/new-image.jpg"
// }
// ======================================================

export const updateCategory = async (req, res) => {
  try {
    const {
      brandId,
      oldCategory,
      category,
      categoryIMAGE,
    } = req.body;

    if (!brandId || !mongoose.isValidObjectId(brandId)) {
      return res.status(400).json({
        success: false,
        message: "A valid brandId is required.",
      });
    }

    if (typeof oldCategory !== "string" || !oldCategory.trim()) {
      return res.status(400).json({
        success: false,
        message: "Existing category name is required.",
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "New category name is required.",
      });
    }

    if (
      categoryIMAGE !== undefined &&
      typeof categoryIMAGE !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Category image must be a string.",
      });
    }

    const oldName = oldCategory.trim();
    const newName = category.trim();

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const categories = normalizeCategories(brand);

    const categoryIndex = categories.findIndex(
      (item) => normalizeName(item.categoryName) === normalizeName(oldName)
    );

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Category not found in the selected brand.",
      });
    }

    // Prevent duplicate category names across brands.
    if (normalizeName(oldName) !== normalizeName(newName)) {
      const otherBrands = await Brand.find({
        _id: { $ne: brand._id },
      });

      const otherBrandCategories = otherBrands.flatMap((item) =>
        normalizeCategories(item)
      );

      const duplicateExists = [
        ...categories.filter((_, index) => index !== categoryIndex),
        ...otherBrandCategories,
      ].some(
        (item) => normalizeName(item.categoryName) === normalizeName(newName)
      );

      if (duplicateExists) {
        return res.status(409).json({
          success: false,
          message: "The new category name already exists.",
        });
      }
    }

    categories[categoryIndex].categoryName = newName;

    // Preserve the image if the frontend doesn't send a new one.
    if (categoryIMAGE !== undefined) {
      categories[categoryIndex].categoryIMAGE = categoryIMAGE.trim();
    }

    saveCategories(brand, categories);
    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category: {
        brandId: String(brand._id),
        brandName: brand.brandName,
        categoryName: categories[categoryIndex].categoryName,
        categoryIMAGE: categories[categoryIndex].categoryIMAGE,
      },
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
    });
  }
};

// ======================================================
// DELETE CATEGORY
// DELETE /api/categories/deleteCategory
//
// Body:
// {
//   "brandId": "BRAND_ID",
//   "category": "Air Flow Meters"
// }
// ======================================================

export const deleteCategory = async (req, res) => {
  try {
    const { brandId, category } = req.body;

    if (!brandId || !mongoose.isValidObjectId(brandId)) {
      return res.status(400).json({
        success: false,
        message: "A valid brandId is required.",
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const categories = normalizeCategories(brand);

    const updatedCategories = categories.filter(
      (item) => normalizeName(item.categoryName) !== normalizeName(category)
    );

    if (updatedCategories.length === categories.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found in the selected brand.",
      });
    }

    saveCategories(brand, updatedCategories);
    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      deletedCategory: category.trim(),
      brandId: String(brand._id),
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
};
