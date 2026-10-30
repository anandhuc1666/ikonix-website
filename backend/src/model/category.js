import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
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

categorySchema.index(
  { categoryName: 1, brand: 1 },
  { unique: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;