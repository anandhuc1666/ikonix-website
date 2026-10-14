import Category from "../model/categorySchema.js";

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      categoryName: 1,
    });

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

// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryIMAGE } = req.body;

    if (!categoryName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const name = categoryName.trim();

    const existingCategory = await Category.findOne({
      categoryName: {
        $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      categoryName: name,
      categoryIMAGE: categoryIMAGE?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryIMAGE } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (categoryName !== undefined) {
      const name = categoryName.trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty",
        });
      }

      const duplicate = await Category.findOne({
        categoryName: {
          $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.categoryName = name;
    }

    if (categoryIMAGE !== undefined) {
      category.categoryIMAGE =
        typeof categoryIMAGE === "string"
          ? categoryIMAGE.trim()
          : category.categoryIMAGE;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
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

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
