import express from "express";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

const router = express.Router();

router.get("/getAllCategories", getAllCategories);
router.post("/createCategory", createCategory);
router.put("/updateCategory", updateCategory);
router.delete("/deleteCategory", deleteCategory);

export default router;
