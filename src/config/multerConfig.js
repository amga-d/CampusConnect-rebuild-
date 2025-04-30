import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    return cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
  }
}

const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export { upload };
