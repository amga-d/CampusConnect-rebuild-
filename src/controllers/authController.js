import { matchedData, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from "../models/user.js";
import { jwtSecret, nodeEnv } from "../config/config.js";

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
    const userId = await createUser(username, email, password);

    if (!userId) throw Error("Error while Signing up");

    // create the token
    const payload = { id: userId };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: nodeEnv === "production",
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
    const userId = await loginUser(email, password);
    const payload = { id: userId };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: nodeEnv === "production",
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
    secure: nodeEnv === "production",
    httpOnly: true,
    sameSite: "Strict", // CSRF protection
  });
  res.redirect("/");
};

const handleLoginError = (err, res) => {
  let message = { email: "", password: "" };
  let statusCode = 500;
  // TODO: Handle prisma errors
  message = { err: "Internal Server Error" }; // TODO: handle err in the frontend
  return res.status(statusCode).json({ success: false, msg: message });
};

const handleSignUpError = (err, res) => {
  let message = { username: "", email: "", password: "" };
  let statusCode = 500;

  // TODO: Handle prisma errors
  if (err?.code === "P2002") {
    message.email = "Email is already used";
    statusCode = 409;
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
