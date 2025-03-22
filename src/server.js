import express from "express";
import dotevn from "dotenv";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
// import MongoStore from "connect-mongo";
// import session from "express-session";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import configurePassport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import HomeRouter from "./routes/homeRouter.js";

import { fileURLToPath } from "url";
import { isUserUnAuthenticated } from "./middlewares/authenticationMid.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(
//   session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 60000 * 60 * 24 * 7 },
//     store: MongoStore.create({
//       mongoUrl: process.env.MONG_URI,
//       tit: 60 * 60 * 24 * 7,
//       autoRemove: "native",
//     }),
//   })
// );

// ------------- Testing Purpose -------------

app.get("/creatjwt", (req, res) => {
  let user = { name: "Amagd", id: "1234", email: "asdfsdfsd" };

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });

  res.cookie("jwt", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  });
  res.sendStatus(200);
});

// app.get("/checkjwt", (req, res) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, encodedToken) => {
//       if (err) {
//         return res.send("err");
//       }
//       return res.send(encodedToken);
//     });
//   } else {
//     res.sendStatus(401);
//   }
// });

// -------------------------------------------

app.use(passport.initialize());
configurePassport(passport);

app.get("/checkjwt", (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, encodedToken) => {
      if (err) {
        return res.send("err");
      }
      return res.send(encodedToken);
    });
  } else {
    res.sendStatus(401);
  }
});


// Auth Routes
app.use("/api/v1/auth", authRoutes);
// Routes
app.get("/signup", isUserUnAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "auth", "signup.html"));
});

app.get("/login", isUserUnAuthenticated, (req, res) => {
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
