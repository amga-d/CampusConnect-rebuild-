import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticationMid.js";
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
    } else {
      req.user = user;
      const userProfile =
        "/img/users/profiles/3a72a6e466e3d08aefc469e4e680498f.jpg";
      res.render("home", { userProfile });
    }
  })(req, res);
});

router.use(authenticateUser);

router.get("/home", (req, res) => {
  res.render("home/home-dashboard");
});

router.get("/discover", (req, res) => {
  res.render("home/discover");
});

router.get("/myCommunities", (req, res) => {
  res.render("home/myCommunities");
});
router.get("/events", (req, res) => {
  res.render("home/events");
});
router.get("/news", (req, res) => {
  res.render("home/news");
});
router.get("/newcommunity", (req, res) => {
  res.render("home/newcommunity");
});
router.get("/profile", (req, res) => {
  res.render("home/profile");
});

export default router;
