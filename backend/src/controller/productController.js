import Product from "../model/productSchema.js";
import Brand from "../model/brandSchema.js";
import cloudinary from "../config/cloudinary.js";

// ======================================================
// CLOUDINARY BUFFER UPLOAD FUNCTION
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
      },
    );

    uploadStream.end(buffer);
  });
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

    // --------------------------------------------------
    // REQUIRED FIELD VALIDATION
    // --------------------------------------------------

    if (!brandName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    if (!productName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // --------------------------------------------------
    // CHECK BRAND
    // --------------------------------------------------

    const brand = await Brand.findOne({
      brandName: brandName.trim(),
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // --------------------------------------------------
    // GET FILES FROM MULTER
    // --------------------------------------------------

    const images = req.files?.Image || [];

    const pdfFiles = req.files?.pdfFile || [];

    // --------------------------------------------------
    // IMAGE LIMIT
    // --------------------------------------------------

    if (images.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 product images are allowed",
      });
    }

    // --------------------------------------------------
    // UPLOAD PRODUCT IMAGES
    // --------------------------------------------------

    const imageUrls = [];

    for (const image of images) {
      const result = await uploadToCloudinary(image.buffer, {
        folder: "ikonix/products/images",

        resource_type: "image",
      });

      imageUrls.push(result.secure_url);
    }

    // --------------------------------------------------
    // UPLOAD PRODUCT PDF
    // --------------------------------------------------

    let pdfUrl = "";

    if (pdfFiles.length > 0) {
      const pdf = pdfFiles[0];

      // Check PDF
      if (pdf.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }

      const result = await uploadToCloudinary(pdf.buffer, {
        folder: "ikonix/products/pdf",

        resource_type: "raw",

        public_id: `product-${Date.now()}`,
      });

      pdfUrl = result.secure_url;
    }

    // --------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------

    const product = new Product({
      Image: imageUrls,

      brandName: brandName.trim(),

      productName: productName.trim(),

      modelNumber: modelNumber?.trim() || "",

      shortDescription: shortDescription || "",

      productDescription: productDescription || "",

      category,

      unit: unit || "",

      price: Number(price) || 0,

      stock: Number(stock) || 0,

      pdfFile: pdfUrl,
    });

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    await product.save();

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Product created successfully",

      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
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
      message: error.message,
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
        message: "Product not found",
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
      message: error.message,
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

    // ==================================================
    // FIND EXISTING PRODUCT
    // ==================================================

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==================================================
    // CHECK BRAND
    // ==================================================

    if (brandName !== undefined) {
      const brand = await Brand.findOne({
        brandName: brandName.trim(),
      });

      if (!brand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    // ==================================================
    // EXISTING IMAGES
    // ==================================================
    //
    // ProductEdit.jsx sends the images that should
    // remain in the product.
    //
    // Example:
    //
    // existingImages:
    // image1
    // image3
    //
    // ==================================================

    let existingImageUrls = [];

    if (Array.isArray(req.body.existingImages)) {
      existingImageUrls = req.body.existingImages;
    } else if (req.body.existingImages) {
      existingImageUrls = [req.body.existingImages];
    }

    // ==================================================
    // NEW IMAGES
    // ==================================================

    const images = req.files?.Image || [];

    // ==================================================
    // CHECK TOTAL IMAGE LIMIT
    // ==================================================

    const totalImages = existingImageUrls.length + images.length;

    if (totalImages > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 product images are allowed",
      });
    }

    // ==================================================
    // FINAL IMAGE ARRAY
    // ==================================================

    const imageUrls = [...existingImageUrls];

    // ==================================================
    // UPLOAD NEW IMAGES
    // ==================================================

    for (const image of images) {
      const result = await uploadToCloudinary(image.buffer, {
        folder: "ikonix/products/images",

        resource_type: "image",
      });

      imageUrls.push(result.secure_url);
    }

    // ==================================================
    // PDF
    // ==================================================
    //
    // If ProductEdit sends existingPdf:
    // keep that PDF.
    //
    // If existingPdf is empty/missing:
    // remove the old PDF.
    //
    // If new pdfFile exists:
    // upload and replace the old PDF.
    //
    // ==================================================

    let pdfUrl = req.body.existingPdf || "";

    // ==================================================
    // NEW PDF
    // ==================================================

    const pdfFiles = req.files?.pdfFile || [];

    if (pdfFiles.length > 0) {
      const pdf = pdfFiles[0];

      // Check PDF type
      if (pdf.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }

      const result = await uploadToCloudinary(pdf.buffer, {
        folder: "ikonix/products/pdf",

        resource_type: "raw",

        public_id: `product-${Date.now()}`,
      });

      pdfUrl = result.secure_url;
    }

    // ==================================================
    // UPDATE PRODUCT FIELDS
    // ==================================================

    existingProduct.Image = imageUrls;

    if (brandName !== undefined) {
      existingProduct.brandName = brandName.trim();
    }

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

    if (category !== undefined) {
      existingProduct.category = category;
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

    // ==================================================
    // UPDATE PDF
    // ==================================================

    existingProduct.pdfFile = pdfUrl;

    // ==================================================
    // SAVE
    // ==================================================

    const updatedProduct = await existingProduct.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,

      message: "Product deleted successfully",

      product,
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
