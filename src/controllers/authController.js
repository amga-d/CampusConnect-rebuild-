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
    res.status(201).json({ success: true });
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
    .escape()``
    .isEmail()
    .withMessage("Please enter a valid Email"),
];

const validation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty());
  next(result.array());
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
    return res.status(500).json({ success: false, msg: message });
  }

  res.status(500).json({ success: false, msg: err });
};

export const signUp = [
  validateSignUpCredentials,
  validation,
  createAccount,
  errorHandler,
];

// for development use only
export const getUsers = async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
};
