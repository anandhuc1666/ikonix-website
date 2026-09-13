import { Router } from "express";

import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controller/brandController.js";

import upload from "../middleware/upload.js";

const brandRouter = Router();

brandRouter.post(
  "/createBrand",
  upload.single("Image"),
  createBrand
);

brandRouter.get(
  "/getAllBrands",
  getAllBrands
);

brandRouter.get(
  "/getBrandById/:id",
  getBrandById
);

brandRouter.put(
  "/updateBrand/:id",
  upload.single("Image"),
  updateBrand
);

brandRouter.delete(
  "/deleteBrand/:id",
  deleteBrand
);

export default brandRouter;