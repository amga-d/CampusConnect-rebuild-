import passport from "passport";

export const isUserUnAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (user) {
      return res.redirect("/");
    }
    next();
  })(req, res, next);
};

export const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) return res.redirect("/"); // landing page
    req.user = user;
    next();
  })(req, res, next);
};
