import { Router } from "express";
import { login, signUp, logout } from "../controllers/authController.js";
import {
  validateLoginCredentials,
  validateSignUpCredentials,
} from "../middlewares/authValidators.js";
import { isUserUnAuthenticated } from "../middlewares/authenticationMid.js";

const router = Router();

router.post(
  "/signup",
  isUserUnAuthenticated,
  validateSignUpCredentials,
  signUp
);

router.post("/login", isUserUnAuthenticated, validateLoginCredentials, login);

router.get("/logout", logout);
// router.get("/getUsers", getUsers);

export default router;
