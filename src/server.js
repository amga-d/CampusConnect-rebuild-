import express from "express";
import dotevn from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport";
import session, { Store } from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import HomeRouter from "./routes/homeRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureUnauthenticated = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return next();
  }
  res.redirect("/"); // Redirects to / page if logged in
};
// Load environment variables
dotevn.config(path.join(__dirname, "..", ".env"));

const PORT = process.env.PORT || 5000;

// Create express app
const app = express();

// Register view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 24 * 7 },
    store: MongoStore.create({
      mongoUrl: process.env.MONG_URI,
      tit: 60 * 60 * 24 * 7,
      autoRemove: "native",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Auth Routes
app.use("/api/v1/auth", authRoutes);
// Routes
app.get("/signup", ensureUnauthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "auth", "signup.html"));
});

app.get("/login", ensureUnauthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "auth", "login.html"));
});

app.use(HomeRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
