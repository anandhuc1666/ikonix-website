import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    Image: {
      type: String,
      default: "",
    },

    brandName: {
      type: String,
      unique: true,
    },

    // Each category has its own image
    category: [
      {
        categoryName: {
          type: String,
          required: true,
          trim: true,
        },

        categoryIMAGE: {
          type: String,
          default: "",
        },
      },
    ],

    brandAbout: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
