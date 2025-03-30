import { body } from "express-validator";
export const validateSignUpCredentials = [
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
export const validateLoginCredentials = [
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
