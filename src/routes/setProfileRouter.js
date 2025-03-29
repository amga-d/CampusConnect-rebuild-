import { Router } from "express";
import { authenticatePostReq } from "../middlewares/authenticationMid.js";
import { setProfile } from "../controllers/setProfileController.js";
const router = new Router();

const getUserName = (req, res, next) => {
  req.name = "amgad";
  next();
};

router.post("/setProfile", authenticatePostReq, getUserName, setProfile);

export default router;
