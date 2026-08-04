import multer from "multer";

// Store file in memory (for Cloudinary upload)
const storage = multer.memoryStorage();


// Verify file type == image
const fileFilter: multer.Options["fileFilter"] =
(
  req,
  file,
  callback
) => {


  if (file.mimetype.startsWith("image/")) {

    callback(null, true);

  } else {

    callback(
      new Error("Only image files are allowed")
    );

  }

};


// Export multer upload middleware

export const upload = multer({

  storage,

  limits: {

    fileSize: 10 * 1024 * 1024, // 10MB

  },

  fileFilter,

});