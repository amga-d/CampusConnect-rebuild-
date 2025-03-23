import { Strategy } from "passport-jwt";
import User from "../models/user.js";
import { jwtSecret } from "./config.js";

// import { Strategy } from "passport-local";
// import { compare } from "./hasher.js";

// passport.use(
//   new Strategy({ usernameField: "email" }, async (email, password, done) => {
//     try {
//       const user = await User.findOne({ email });
//       if (!user) throw new Error("User not found");
//       if (!compare(password, user.password)) throw new Error("Bad Credentials");
//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   })
// );
// Extract Jwt from Cookies

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtSecret,
};

export default (passport) => {
  // jWT strategy
  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false, "User not Found");
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error("User not found"), false);
      }
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};
