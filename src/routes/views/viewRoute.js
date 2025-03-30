import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";
import {
  authenticateUser,
  isUserUnAuthenticated,
} from "../../middlewares/authenticationMid.js";
import { homeController } from "../../controllers/homeController.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
router.get("/signup", isUserUnAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "views", "auth", "signup.html"));
});

router.get("/login", isUserUnAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "views", "auth", "login.html"));
});

router.get("/setProfile", authenticateUser, (req, res) => {
  res.render("setProfile");
});

// router.get("/", (req, res) => {
//   passport.authenticate("jwt", { session: false }, (err, user, info) => {
//     if (!user || err) {
//       return res.render("landingPage");
//     }
//     req.user = user;
//     // Check if user has profile
//     IsProfile(req, res, function () {
//       const userProfile =
//         "/img/users/profiles/3a72a6e466e3d08aefc469e4e680498f.jpg";
//       res.render("home", { userProfile });
//     });
//   })(req, res);
// });

router.get("/", homeController);

router.get("/home", authenticateUser, (req, res) => {
  res.render("home/home-dashboard");
});

router.get("/discover", authenticateUser, (req, res) => {
  res.render("home/discover");
});

router.get("/myCommunities", authenticateUser, (req, res) => {
  res.render("home/myCommunities");
});
router.get("/events", authenticateUser, (req, res) => {
  res.render("home/events");
});
router.get("/news", authenticateUser, (req, res) => {
  res.render("home/news");
});
router.get("/newcommunity", authenticateUser, (req, res) => {
  res.render("home/newcommunity");
});
router.get("/profile", authenticateUser, (req, res) => {
  res.render("home/profile");
});

export default router;
