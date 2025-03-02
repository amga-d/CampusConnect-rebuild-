import { Router } from "express";
import { getUsers, login, signUp } from "../controllers/authController.js";
const router = Router();

router.post("/signup", signUp);

router.post("/login", login);

router.get("/getUsers", getUsers);

export default router;
