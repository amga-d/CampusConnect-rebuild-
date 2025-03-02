import { Router } from "express";
import {
  getUsers,
  login,
  signUp,
  logout,
} from "../controllers/authController.js";
const router = Router();

router.post("/signup", signUp);

router.post("/login", login);

router.get("/logout", logout);
router.get("/getUsers", getUsers);

export default router;
