import passport from "passport";
import { getUserProfile } from "../models/user.js";
const DEFAULT_PROFILE = "profile.png";
// Is profile seted up v2
const requireProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect("/"); // No User, Redirect to landingPage
    }
    if (user.profile) {
      // User has profile, get imageUrl then continue
      const userInfo = await getUserProfile(req.user.id);
      const profileUrl = userInfo.profile?.imageUrl
        ? userInfo.profile?.imageUrl
        : DEFAULT_PROFILE;
      req.user.profileUrl = profileUrl;
      next();
    } else {
      // User doesn't has profile, redirect to Set Profile page
      return res.redirect("/setProfile");
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) {
      return res.render("landingPage");
    }
    // store user in req object
    req.user = user;
    next();
  })(req, res, next);
};

export { authenticateJwt, requireProfile };
