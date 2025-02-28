import { Router } from "express";
import { getUsers, signUp } from "../controllers/authController.js";
const router = Router();

router.post("/signup", signUp);

router.post("/login", (req, res) => {});

router.get("/getUsers", getUsers);

export default router;
