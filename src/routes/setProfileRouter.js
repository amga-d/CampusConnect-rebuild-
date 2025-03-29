import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticationMid.js";

const router = new Router();

router.get("/setProfile", authenticateUser, (req, res) => {
  res.render("setProfile");
});

router.post("/setProfile", (req, res) => {
  res.send("uploaded successfully");
});

export default router;
