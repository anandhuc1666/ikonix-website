import multer from "multer";

const storage =
  multer.memoryStorage();

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedImages = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (
    file.fieldname === "Image"
  ) {
    if (
      allowedImages.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG, WEBP and SVG images are allowed"
        ),
        false
      );
    }

    return;
  }

  if (
    file.fieldname === "pdfFile"
  ) {
    if (
      file.mimetype ===
      "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF files are allowed"
        ),
        false
      );
    }

    return;
  }

  cb(
    new Error(
      "Unexpected file field"
    ),
    false
  );
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      10 * 1024 * 1024,
  },
});

export default upload;