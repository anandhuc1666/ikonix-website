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

    category: [
      {
        type: String,
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
  },
);

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
