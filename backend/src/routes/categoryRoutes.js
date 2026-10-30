import express from "express";

import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

import categoryUpload from "../middleware/categoryUpload.js";

const router = express.Router();

router.post(
  "/create",
  categoryUpload.single("categoryImage"),
  createCategory
);

router.get("/", getAllCategories);

router.put(
  "/:id",
  categoryUpload.single("categoryImage"),
  updateCategory
);

router.delete("/:id", deleteCategory);

export default router;