
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    categoryImage: {
      type: String,
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      enum: [
        "Featured Categories",
        "Main Categories",
        "New Arrivals",
        "Popular Categories",
      ],
      default: "Main Categories",
    },
  },
  { timestamps: true }
);

// Prevent duplicate category names within the same brand
categorySchema.index(
  { category: 1, brand: 1 },
  { unique: true, name: "category_brand_unique" }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
