import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";
import fsP from "fs/promises";
import fs from "fs";
import { setUpProfile } from "../models/user.js";
import { matchedData, validationResult } from "express-validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const profilesDir = path.join(
      __dirname,
      "../public/uploads/users/profiles"
    );
    if (!fs.existsSync(profilesDir)) {
      fs.mkdirSync(profilesDir, { recursive: true });
    }
    cb(null, profilesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(
      null,
      req.user.name + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

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

const ErrorHandler = (err, res) => {
  let message = {};
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size is too large! Max 5MB allowed." });
    } else {
      return res.status(400).json({ error: err.message });
    }
  } else if (Array.isArray(err)) {
    err.forEach((error) => (message[error.path] = error.msg));
    return res.status(400).json({ error: message });
  } else {
    return res.status(400).json({ error: err.message });
  }
};

// call this method after applying the upload middleware.
const setProfile = [
  // Then validate and process the request
  async (req, res, next) => {
    // Check validation results
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // remove image if there is an error while saving data
      if (req.file && req.file.path) {
        if (fs.existsSync(req.file.path)) {
          fsP.unlink(req.file.path).catch((err) => {
            console.log(err);
          });
        }
      }
      return next(result.array());
    }

    try {
      // Get validated data
      const data = matchedData(req, { includeOptionals: true });

      // Add the file information to the data object
      const profileImage = req.file ? req.file.path : null;

      // save the data to your database

      await setUpProfile(
        req.user.id,
        profileImage ? path.basename(profileImage) : null,
        data.birthdate,
        data.gender,
        data.bio
      );
      // For example:
      // await User.update({
      //   id: req.user.id,
      //   birthdate: data.birthdate,
      //   gender: data.gender,
      //   bio: data.bio,
      //   profileImage: profileImage ? path.basename(profileImage) : null
      // });

      return res.redirect("/");
    } catch (error) {
      // remove image if there is an error while saving data
      if (req.file && req.file.path) {
        if (fs.existsSync(req.file.path)) {
          fsP.unlink(req.file.path).catch((err) => {
            console.log(err);
          });
        }
      }
      return next(error);
    }
  },

  // Error handler
  (err, req, res, next) => ErrorHandler(err, res),
];

export { upload, setProfile };
