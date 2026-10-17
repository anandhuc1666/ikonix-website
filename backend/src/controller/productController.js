
import Product from "../model/productSchema.js";
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
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

// ======================================================
// CATEGORY HELPERS
// Supports old string categories and nested category objects
// ======================================================

const getCategoryNames = (brand) => {
  if (!Array.isArray(brand?.category)) return [];

  return brand.category
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : item?.categoryName?.trim(),
    )
    .filter(Boolean);
};

const validateBrandCategory = (brand, category) => {
  if (typeof category !== "string" || !category.trim()) {
    return false;
  }

  return getCategoryNames(brand).some(
    (name) => name.toLowerCase() === category.trim().toLowerCase(),
  );
};

// ======================================================
// CREATE PRODUCT
// ======================================================

export const createProduct = async (req, res) => {
  try {
    const {
      brandName,
      productName,
      modelNumber,
      shortDescription,
      productDescription,
      category,
      unit,
      price,
      stock,
    } = req.body;

    if (!brandName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required.",
      });
    }

    if (!productName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a category.",
      });
    }

    const brand = await Brand.findOne({
      brandName: brandName.trim(),
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    // Make sure the category belongs to the selected brand.
    if (!validateBrandCategory(brand, category)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid category for the selected brand.",
        categories: getCategoryNames(brand),
      });
    }

    const images = req.files?.Image || [];
    const pdfFiles = req.files?.pdfFile || [];

    if (images.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 product images are allowed.",
      });
    }

    if (
      pdfFiles.length > 0 &&
      pdfFiles[0].mimetype !== "application/pdf"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed.",
      });
    }

    // Upload product images.
    const imageUrls = [];

    for (const image of images) {
      const result = await uploadToCloudinary(image.buffer, {
        folder: "ikonix/products/images",
        resource_type: "image",
      });

      imageUrls.push(result.secure_url);
    }

    // Upload product PDF, if provided.
    let pdfUrl = "";

    if (pdfFiles.length > 0) {
      const result = await uploadToCloudinary(pdfFiles[0].buffer, {
        folder: "ikonix/products/pdf",
        resource_type: "raw",
        public_id: `product-${Date.now()}`,
      });

      pdfUrl = result.secure_url;
    }

    const product = new Product({
      Image: imageUrls,
      brandName: brand.brandName,
      productName: productName.trim(),
      modelNumber: modelNumber?.trim() || "",
      shortDescription: shortDescription || "",
      productDescription: productDescription || "",
      category: category.trim(),
      unit: unit?.trim() || "",
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      pdfFile: pdfUrl,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product.",
    });
  }
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products.",
    });
  }
};

// ======================================================
// GET PRODUCT BY ID
// ======================================================

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product.",
    });
  }
};

// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      brandName,
      productName,
      modelNumber,
      shortDescription,
      productDescription,
      category,
      unit,
      price,
      stock,
      status,
    } = req.body;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Resolve the brand and category to validate.
    const selectedBrandName =
      brandName !== undefined && brandName.trim()
        ? brandName.trim()
        : existingProduct.brandName;

    const selectedBrand = await Brand.findOne({
      brandName: selectedBrandName,
    });

    if (!selectedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const selectedCategory =
      category !== undefined ? category : existingProduct.category;

    if (!validateBrandCategory(selectedBrand, selectedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid category for the selected brand.",
        categories: getCategoryNames(selectedBrand),
      });
    }

    // Existing images to keep.
    let existingImageUrls = req.body.existingImages ?? [];

    if (!Array.isArray(existingImageUrls)) {
      existingImageUrls = [existingImageUrls];
    }

    existingImageUrls = existingImageUrls.filter(
      (url) => typeof url === "string" && url.trim(),
    );

    // New images.
    const images = req.files?.Image || [];
    const totalImages = existingImageUrls.length + images.length;

    if (totalImages > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 product images are allowed.",
      });
    }

    const imageUrls = [...existingImageUrls];

    for (const image of images) {
      const result = await uploadToCloudinary(image.buffer, {
        folder: "ikonix/products/images",
        resource_type: "image",
      });

      imageUrls.push(result.secure_url);
    }

    // Keep the existing PDF unless the form explicitly changes it.
    let pdfUrl =
      req.body.existingPdf !== undefined
        ? req.body.existingPdf
        : existingProduct.pdfFile || "";

    const pdfFiles = req.files?.pdfFile || [];

    if (
      pdfFiles.length > 0 &&
      pdfFiles[0].mimetype !== "application/pdf"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed.",
      });
    }

    if (pdfFiles.length > 0) {
      const result = await uploadToCloudinary(pdfFiles[0].buffer, {
        folder: "ikonix/products/pdf",
        resource_type: "raw",
        public_id: `product-${Date.now()}`,
      });

      pdfUrl = result.secure_url;
    }

    // Update product fields.
    existingProduct.Image = imageUrls;
    existingProduct.brandName = selectedBrand.brandName;
    existingProduct.category = selectedCategory.trim();

    if (productName !== undefined) {
      existingProduct.productName = productName.trim();
    }

    if (modelNumber !== undefined) {
      existingProduct.modelNumber = modelNumber.trim();
    }

    if (shortDescription !== undefined) {
      existingProduct.shortDescription = shortDescription;
    }

    if (productDescription !== undefined) {
      existingProduct.productDescription = productDescription;
    }

    if (unit !== undefined) {
      existingProduct.unit = unit.trim();
    }

    if (price !== undefined) {
      existingProduct.price = Number(price) || 0;
    }

    if (stock !== undefined) {
      existingProduct.stock = Number(stock) || 0;
    }

    if (status !== undefined) {
      existingProduct.status = status;
    }

    existingProduct.pdfFile = pdfUrl;

    const updatedProduct = await existingProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product.",
    });
  }
};

// ======================================================
// DELETE PRODUCT
// ======================================================

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product.",
    });
  }
};
