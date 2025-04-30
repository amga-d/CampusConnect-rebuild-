import express from "express";
import path from "path";
import passport from "passport";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import RateLimit from "express-rate-limit";

import prisma from "./src/config/prisma.js";
import configurePassport from "./src/config/passport.js";
import authRoute from "./src/routes/api/authRoute.js";
import profileRoute from "./src/routes/api/ProfileRoute.js";
import viewRoute from "./src/routes/views/viewRoute.js";
import { nodeEnv, port } from "./src/config/config.js";
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
app.set("views", path.join(__dirname, "src/views"));

if (nodeEnv !== "development") {
  app.use(helmet());
}

// Middleware
app.use(compression());
app.use(limiter);
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
// Set path for static files
app.use(express.static(path.join(__dirname, "src/public")));

// Configuring Passport middleware
configurePassport(passport);

// Auth Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", profileRoute);
app.use(viewRoute);

// Start Server
const startServer = () => {
  prisma
    .$connect()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port} http://0.0.0.0:${port}`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
startServer();
