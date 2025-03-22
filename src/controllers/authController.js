import { matchedData, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// validation,
// createAccount,
// passport.authenticate("local"),
// (req, res) => {
//   res.status(201).json({ success: true });
// },
// errorHandler,
// ];

export const signUp = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return handleSignUpError(result.array(), res);
  }
  const { username, email, password } = matchedData(req);

  try {
    const user = new User({ email, password, username });

    if (!user) throw Error("Error while Signing up");

    await user.save();

    // create the token
    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60,
    });

    res.redirect("/");
  } catch (error) {
    handleSignUpError(error, res);
  }
};

// export const login = [validateLoginCredentials, loginAuth, errorHandler];

export const login = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) return handleLoginError(result.array(), res);

  const { email, password } = matchedData(req);

  try {
    const user = await User.login(email, password);
    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "Strict", // CSRF protection
      maxAge: 1000 * 60 * 60,
    });

    return res.redirect("/");
  } catch (error) {
    handleLoginError(error, res);
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "Strict", // CSRF protection
  });
  res.redirect("/login");
};

const handleLoginError = (err, res) => {
  let message = { email: "", password: "" };
  let statusCode = 500;

  if (err.message === "Incorrect credentials") {
    message = { email: "Incorrect Email", password: "Incorrect Password" };
    statusCode = 400;
  } else if (Array.isArray(err)) {
    err.forEach((error) => (message[error.path] = error.msg));
    statusCode = 400;
  } else {
    message = { err: "Internal Server Error" }; // TODO: handle err in the frontend
  }
  return res.status(statusCode).json({ success: false, msg: message });
};

const handleSignUpError = (err, res) => {
  let message = { username: "", email: "", password: "" };
  let statusCode = 500;

  if (err?.code === 11000) {
    message.email = "Email is already used";
    statusCode = 409;
  } else if (Array.isArray(err)) {
    err.forEach((error) => (message[error.path] = error.msg));
    statusCode = 400;
  } else {
    message = { err: "Internal server Error" };
  }
  return res.status(statusCode).json({ success: false, msg: message });
};

// ------------for development use only---------------
// export const getUsers = async (req, res) => {
//   const users = await User.find();
//   return res.status(200).json(users);
// };
