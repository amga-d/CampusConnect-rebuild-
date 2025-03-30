import passport from "passport";
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



export const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) return res.redirect("/"); // landing page
    req.user = user;
    next();
  })(req, res, next);
};

export const authenticatePostReq = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) return res.sendStatus(401);
    req.user = user;
    next();
  })(req, res, next);
};
