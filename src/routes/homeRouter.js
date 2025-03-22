import { Router } from "express";
const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirects to login page if not logged in
};

router.get("/", ensureAuthenticated, (req, res) => {
  const userProfile =
    "/img/users/profiles/3a72a6e466e3d08aefc469e4e680498f.jpg";
  res.render("home", { userProfile });
});

router.get("/home", ensureAuthenticated, (req, res) => {
  res.render("home/home-dashboard");
});

router.get("/discover", ensureAuthenticated, (req, res) => {
  res.render("home/discover");
});

router.get("/myCommunities", ensureAuthenticated, (req, res) => {
  res.render("home/myCommunities");
});
router.get("/events", ensureAuthenticated, (req, res) => {
  res.render("home/events");
});
router.get("/news", ensureAuthenticated, (req, res) => {
  res.render("home/news");
});
router.get("/newcommunity", ensureAuthenticated, (req, res) => {
  res.render("home/newcommunity");
});
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("home/profile");
});

export default router;
