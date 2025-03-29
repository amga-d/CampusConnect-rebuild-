import passport from "passport";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
export const isUserUnAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (user) {
      return res.redirect("/");
    }
    next();
  })(req, res, next);
};

// export const IsProfile = (req, res, next) => {
//   try {
//     //extract JWT
//     const token = req.cookies.jwt;
//     if (!token) {
//       return res.redirect("/"); // No Token, Redirect to landingPage
//     }

//     const decodeddJwt = jwt.verify(token, jwtSecret);
//     if (decodeddJwt.hasProfile === true) {
//       // User has profile, continue
//       return next();
//     } else {
//       // User doesn't has profile, redirect to landingPage
//       return res.redirect("/setProfile");
//     }
//   } catch (err) {
//     console.log("JWT verification error:", err);
//     return res.redirect("/"); // Invalid token, redirect to login
//   }
// };

// Is profile seted up v2
export const IsProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect("/"); // No User, Redirect to landingPage
    }
    if (user.profile) {
      // User has profile, continue
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

export const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) return res.redirect("/"); // landing page
    req.user = user;
    next();
  })(req, res, next);
};
