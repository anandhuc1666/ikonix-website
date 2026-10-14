import Category from "../model/Category.js"

// ========================================
// GET ALL CATEGORIES
// ========================================

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
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
      message: "Failed to fetch categories",
    });
  }
};

// ========================================
// GET CATEGORY BY ID
// ========================================

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// ========================================
// CREATE CATEGORY
// ========================================

export const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryIMAGE, status } = req.body;

    if (!categoryName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      categoryName: {
        $regex: `^${categoryName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
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
      categoryName: categoryName.trim(),
      categoryIMAGE: categoryIMAGE || "",
      status: status || "Active",
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
      message: "Failed to create category",
    });
  }
};

// ========================================
// UPDATE CATEGORY
// ========================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryIMAGE, status } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

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
          message: "Category name already exists",
        });
      }

      category.categoryName = name;
    }

    if (categoryIMAGE !== undefined) {
      category.categoryIMAGE = categoryIMAGE;
    }

    if (status !== undefined) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category status",
        });
      }

      category.status = status;
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
      message: "Failed to update category",
    });
  }
};

// ========================================
// DELETE CATEGORY
// ========================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

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
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};