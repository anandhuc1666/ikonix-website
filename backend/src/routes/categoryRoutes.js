import express from "express";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get(
  "/getAllCategories",
  getAllCategories
);

categoryRouter.get(
  "/getCategoryById/:id",
  getCategoryById
);

categoryRouter.post(
  "/createCategory",
  createCategory
);

categoryRouter.put(
  "/updateCategory/:id",
  updateCategory
);

categoryRouter.delete(
  "/deleteCategory/:id",
  deleteCategory
);

export default categoryRouter;