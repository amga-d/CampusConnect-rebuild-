import { Router } from "express";
import { authenticatePostReq } from "../../middlewares/authenticationMid.js";
import { setProfile } from "../../controllers/ProfileController.js";
import { upload } from "../../config/multerConfig.js";
import {
  multerErrorHandler,
  validationErrorHandler,
} from "../../middlewares/errorHandlers.js";
import { validateProfileData } from "../../validators/ProfileValidator.js";
const router = new Router();

// TODO: handle prisma errors
router.post(
  "/setProfile",
  authenticatePostReq,
  upload.single("profile"),
  multerErrorHandler,
  validateProfileData,
  setProfile,
  validationErrorHandler
);

//TODO: add getProfile route

export default router;
