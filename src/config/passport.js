import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user.js";
import { compare } from "./hasher.js";

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      if (!compare(password, user.password)) throw new Error("Bad Credentials");
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
});
export default passport;
