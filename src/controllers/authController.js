import User from "../models/user.js";
import passport from "../config/passport.js";
import { body, matchedData, validationResult } from "express-validator";

const createAccount = async (req, res, next) => {
  const {
    body: { email, username, password },
  } = req;
  try {
    const user = new User({ email, password, username });
    if (!user) throw new Error("error while Sign Up");
    await user.save();
    next();
  } catch (error) {
    next(error);
  }
};

const validateSignUpCredentials = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 4 })
    .withMessage("Invalid username"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage("Minimum Password length is 8 characters"),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Please enter a valid Email"),
];

const validation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) next(result.array());
  const data = matchedData(req);
  req.body = data;
  next();
};

const errorHandler = (err, req, res, next) => {
  const message = { username: "", email: "", password: "" };
  if (err?.code === 11000) {
    message.email = "Email is already used";
    return res.status(309).json({ success: false, msg: message });
  } else if (Array.isArray(err)) {
    err.forEach((error) => (message[error.path] = error.msg));
    return res.status(400).json({ success: false, msg: message });
  }

  res.status(500).json({ success: false, msg: err });
};

const validateLoginCredentials = [
  body("password")
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage("Minimum Password length is 8 characters"),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Please enter a valid Email"),
];

export const signUp = [
  validateSignUpCredentials,
  validation,
  createAccount,
  passport.authenticate("local"),
  (req, res) => {
    res.status(201).json({ success: true });
  },
  errorHandler,
];

export const login = [
  validateLoginCredentials,
  validation,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  errorHandler,
];

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect("/login"); // Redirect to login after logout
    });
  });
};

// for development use only
export const getUsers = async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
};
