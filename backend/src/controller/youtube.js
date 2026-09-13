import Youtube from "../model/youtube.js";

export const createYoutube = async (req, res) => {
  try {
    const { url, title } = req.body;

    // Check if a YouTube video already exists
    const existingYoutube = await Youtube.findOne();

    if (existingYoutube) {
      // Update the existing video
      existingYoutube.url = url;
      existingYoutube.title = title;

      const updatedYoutube = await existingYoutube.save();

      return res.status(200).json({
        success: true,
        message: "YouTube video updated successfully",
        youtube: updatedYoutube,
      });
    }

    // Create first video
    const youtube = new Youtube({
      url,
      title,
    });

    const savedYoutube = await youtube.save();

    return res.status(201).json({
      success: true,
      message: "YouTube video created successfully",
      youtube: savedYoutube,
    });
  } catch (error) {
    console.error("YouTube Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getYoutube = async (req, res) => {
  try {
    const youtube = await Youtube.findOne();
    if (!youtube) {
      return res.status(404).json({
        success: false,
        message: "No YouTube video found",
      });
    }
    return res.status(200).json({
        success: true,
        youtube,
    });
  } catch (error) {
    console.error("YouTube Error:", error);
  }
};
