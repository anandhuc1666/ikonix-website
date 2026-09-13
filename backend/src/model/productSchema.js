import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    Image: [
      {
        type: String,
        default: "",
      },
    ],

    brandName: {
      type: String,
    },

    productName: {
      type: String,
      default: "",
    },

    modelNumber: {
      type: String,
    },

    shortDescription: {
      type: String,
    },

    productDescription: {
      type: String,
    },

    category: {
      type: String,
      default: "",
    },

    unit: {
      type: String,
    },

    price: {
      type: Number,
    },

    stock: {
      type: Number,
    },

    pdfFile: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);
const Product = mongoose.model("Product", productSchema);
export default Product;
