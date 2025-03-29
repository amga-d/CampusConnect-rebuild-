import { Router } from "express";
import {
  authenticateUser,
  IsProfile,
} from "../middlewares/authenticationMid.js";
import passport from "passport";

const router = Router();
// const ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login"); // Redirects to login page if not logged in
// };
router.get("/", (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) {
      return res.render("landingPage");
    }
    // store user in req object
    req.user = user;
    // Check if user has profile
    IsProfile(req, res, () => {
      const userProfile =
        "/img/users/profiles/3a72a6e466e3d08aefc469e4e680498f.jpg";
      res.render("home", { userProfile });
    });
  })(req, res);
});

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
