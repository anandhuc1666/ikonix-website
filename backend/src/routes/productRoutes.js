import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

import upload from "../middleware/upload.js";

const productRouter = Router();

productRouter.post(
  "/createProduct",
  upload.fields([
    {
      name: "Image",
      maxCount: 5,
    },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  createProduct,
);

productRouter.get("/getAllProducts", getAllProducts);

productRouter.get("/getProductById/:id", getProductById);

productRouter.put(
  "/updateProduct/:id",
  upload.fields([
    {
      name: "Image",
      maxCount: 5,
    },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  updateProduct,
);

productRouter.delete("/deleteProduct/:id", deleteProduct);

export default productRouter;
