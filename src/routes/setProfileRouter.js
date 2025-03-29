import { Router } from "express";
import { authenticatePostReq } from "../middlewares/authenticationMid.js";
import { setProfile } from "../controllers/setProfileController.js";
const router = new Router();

router.post("/setProfile", authenticatePostReq, setProfile);

export default router;
