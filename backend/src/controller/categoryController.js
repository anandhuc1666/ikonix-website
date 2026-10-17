
import Brand from "../model/brandSchema.js";

// ======================================================
// HELPER: NORMALIZE BRAND CATEGORIES
// ======================================================

const getBrandCategories = (brand) => {
  if (Array.isArray(brand.category)) {
    return brand.category.filter(
      (item) => typeof item === "string" && item.trim()
    );
  }

  if (typeof brand.category === "string" && brand.category.trim()) {
    return [brand.category.trim()];
  }

  return [];
};

// ======================================================
// GET ALL UNIQUE CATEGORIES
// GET /api/categories/getAllCategories
// ======================================================

export const getAllCategories = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    const categoryMap = new Map();

    for (const brand of brands) {
      const brandCategories = getBrandCategories(brand);

      for (const categoryName of brandCategories) {
        const name = categoryName.trim();
        const key = name.toLowerCase();

        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            _id: key,
            categoryName: name,
            categoryIMAGE: brand.categoryIMAGE || "",
            brandIds: [],
            brandNames: [],
          });
        }

        const item = categoryMap.get(key);

        if (!item.categoryIMAGE && brand.categoryIMAGE) {
          item.categoryIMAGE = brand.categoryIMAGE;
        }

        if (
          !item.brandIds.includes(String(brand._id))
        ) {
          item.brandIds.push(String(brand._id));
          item.brandNames.push(brand.brandName || "");
        }
      }
    }

    const categories = Array.from(categoryMap.values()).sort(
      (a, b) => a.categoryName.localeCompare(b.categoryName)
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
      message: error.message,
    });
  }
};

// ======================================================
// CREATE CATEGORY FOR A BRAND
// POST /api/categories/createCategory
//
// Body:
// {
//   "brandId": "...",
//   "category": "Air Flow Meters",
//   "categoryIMAGE": "https://example.com/image.jpg"
// }
// ======================================================

export const createCategory = async (req, res) => {
  try {
    const { brandId, category, categoryIMAGE } = req.body;

    if (!brandId) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required.",
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const name = category.trim();

    // Category names must be unique across all brands.
    const brands = await Brand.find();

    const alreadyExists = brands.some((brand) =>
      getBrandCategories(brand).some(
        (item) => item.toLowerCase() === name.toLowerCase()
      )
    );

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const updatedCategories = getBrandCategories(brand);
    updatedCategories.push(name);

    brand.category = updatedCategories;

    if (typeof categoryIMAGE === "string") {
      brand.categoryIMAGE = categoryIMAGE.trim();
    }

    await brand.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully.",
      category: {
        categoryName: name,
        categoryIMAGE: brand.categoryIMAGE,
        brandId: String(brand._id),
        brandName: brand.brandName,
      },
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE CATEGORY NAME AND IMAGE
// PUT /api/categories/updateCategory
//
// Body:
// {
//   "oldCategory": "Air Flow Meters",
//   "category": "Air Flow Measuring Instruments",
//   "categoryIMAGE": "https://example.com/new-image.jpg"
// }
// ======================================================

export const updateCategory = async (req, res) => {
  try {
    const { oldCategory, category, categoryIMAGE } = req.body;

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

    const oldName = oldCategory.trim();
    const newName = category.trim();

    const brands = await Brand.find();

    // Find brands containing the old category.
    const affectedBrands = brands.filter((brand) =>
      getBrandCategories(brand).some(
        (item) => item.toLowerCase() === oldName.toLowerCase()
      )
    );

    if (affectedBrands.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Prevent renaming to an existing category.
    if (oldName.toLowerCase() !== newName.toLowerCase()) {
      const duplicateExists = brands.some((brand) =>
        getBrandCategories(brand).some(
          (item) => item.toLowerCase() === newName.toLowerCase()
        )
      );

      if (duplicateExists) {
        return res.status(409).json({
          success: false,
          message: "The new category name already exists.",
        });
      }
    }

    // Update only category names and category image.
    for (const brand of affectedBrands) {
      brand.category = getBrandCategories(brand).map((item) =>
        item.toLowerCase() === oldName.toLowerCase()
          ? newName
          : item
      );

      // Update category image only when supplied.
      if (typeof categoryIMAGE === "string") {
        brand.categoryIMAGE = categoryIMAGE.trim();
      }

      // Do not modify brandName, Image, brandAbout, or status.
      await brand.save();
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      updatedBrands: affectedBrands.length,
      category: {
        oldName,
        categoryName: newName,
        categoryIMAGE:
          typeof categoryIMAGE === "string"
            ? categoryIMAGE.trim()
            : undefined,
      },
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DELETE CATEGORY FROM ASSOCIATED BRANDS
// DELETE /api/categories/deleteCategory
//
// Body:
// {
//   "category": "Air Flow Meters"
// }
// ======================================================

export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const name = category.trim();
    const brands = await Brand.find();

    const affectedBrands = brands.filter((brand) =>
      getBrandCategories(brand).some(
        (item) => item.toLowerCase() === name.toLowerCase()
      )
    );

    if (affectedBrands.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    for (const brand of affectedBrands) {
      brand.category = getBrandCategories(brand).filter(
        (item) => item.toLowerCase() !== name.toLowerCase()
      );

      // Preserve brand image, description, and status.
      await brand.save();
    }

    return res.status(200).json({
      success: true,
      message: "Category removed successfully.",
      deletedCategory: name,
      updatedBrands: affectedBrands.length,
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
