import { MulterError } from "multer";

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size is too large! Max 5MB allowed." });
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ error: "Unexpected field! Only 'plantImage' is allowed." });
    }
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  next();
};

const validationErrorHandler = (err, res) => {
  let message = {};
  if (Array.isArray(err)) {
    err.forEach((error) => (message[error.path] = error.msg));
    return res.status(400).json({ error: message });
  } else {
    // Handle other types of errors
    // TODO: Add more error handling logic here
    return res.status(400).json({ error: err.message });
  }
};

export { multerErrorHandler, validationErrorHandler };
