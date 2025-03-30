import { Router } from "express";
import { authenticatePostReq } from "../../middlewares/authenticationMid.js";
import { setProfile, upload } from "../../controllers/ProfileController.js";
import { validateProfileData } from "../../validators/ProfileValidator.js";
const router = new Router();

router.post(
  "/setProfile",
  authenticatePostReq,
  upload.single("profile"),
  validateProfileData,
  setProfile
);

export default router;
