import express from "express";

import {
  createAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
} from "../controller/advertisementController.js";

const router = express.Router();

// Public route - frontend carousel
router.get("/active", getActiveAdvertisements);

// Admin routes - protect these with your existing admin authentication middleware
router.get("/all", getAllAdvertisements);
router.post("/create", createAdvertisement);
router.put("/update/:id", updateAdvertisement);
router.delete("/delete/:id", deleteAdvertisement);

export default router;