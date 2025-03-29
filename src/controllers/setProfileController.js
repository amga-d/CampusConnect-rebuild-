import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/users/", file.fieldname + "s"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, req.name + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extname && mimeType) {
    return cb(null, true);
  } else {
    return cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
  }
  // To accept the file pass `true`, like so:
  // You can always pass an error if something goes wrong:
}

const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size is too large! Max 5MB allowed." });
    } else {
      return res.status(400).json({ error: err.message });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

const setProfile = [
  upload.single("profile"),
  (req, res) => {
    res.send("uploaded successfully");
  },
  multerErrorHandler,
];

export { setProfile };
