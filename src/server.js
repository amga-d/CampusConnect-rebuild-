import express from "express";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import RateLimit from "express-rate-limit";

import configurePassport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRouter.js";

import { isUserUnAuthenticated } from "./middlewares/authenticationMid.js";
import { nodeEnv, port, mongUrl } from "./config/config.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

// Create express app
const app = express();

// Register view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
if (nodeEnv !== "development") {
  app.use(helmet());
}
app.use(compression());
app.use(limiter);
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

configurePassport(passport);

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Routes
app.get("/signup", isUserUnAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "auth", "signup.html"));
});

app.get("/login", isUserUnAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "auth", "login.html"));
});

app.use(homeRoutes);

// Connect to MongoDB
mongoose
  .connect(mongUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port} http://0.0.0.0:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
