import Advertisement from "../model/advertisementSchema.js";
import Brand from "../model/brandSchema.js";

// CREATE ADVERTISEMENT
export const createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      brand,
      isActive,
      sortOrder,
      startDate,
      endDate,
    } = req.body;

    if (!title || !image || !brand) {
      return res.status(400).json({
        success: false,
        message: "Title, image and brand are required",
      });
    }

    const selectedBrand = await Brand.findById(brand);

    if (!selectedBrand) {
      return res.status(404).json({
        success: false,
        message: "Selected brand not found",
      });
    }

    const advertisement = await Advertisement.create({
      title,
      description,
      image,
      brand,
      isActive: isActive ?? true,
      sortOrder: Number(sortOrder) || 0,
      startDate: startDate || null,
      endDate: endDate || null,
    });

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      advertisement,
    });
  } catch (error) {
    console.error("Create Advertisement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create advertisement",
    });
  }
};

// GET ALL ADVERTISEMENTS - ADMIN
export const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .populate("brand", "brandName Image")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      advertisements,
    });
  } catch (error) {
    console.error("Get Advertisements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch advertisements",
    });
  }
};

// GET ACTIVE ADVERTISEMENTS - PUBLIC
export const getActiveAdvertisements = async (req, res) => {
  try {
    const now = new Date();

    const advertisements = await Advertisement.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    })
      .populate("brand", "brandName Image")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      advertisements,
    });
  } catch (error) {
    console.error("Get Active Advertisements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active advertisements",
    });
  }
};

// UPDATE ADVERTISEMENT
export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };

    if (updates.brand) {
      const selectedBrand = await Brand.findById(updates.brand);

      if (!selectedBrand) {
        return res.status(404).json({
          success: false,
          message: "Selected brand not found",
        });
      }
    }

    if (updates.sortOrder !== undefined) {
      updates.sortOrder = Number(updates.sortOrder) || 0;
    }

    const advertisement = await Advertisement.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate("brand", "brandName Image");

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      advertisement,
    });
  } catch (error) {
    console.error("Update Advertisement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update advertisement",
    });
  }
};

// DELETE ADVERTISEMENT
export const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findByIdAndDelete(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Delete Advertisement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete advertisement",
    });
  }
};