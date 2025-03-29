import { body } from "express-validator";

const validateBody = [
  body("birthdate")
    .exists()
    .withMessage("Birthdate is required")
    .custom((value) => {
      // Check if value exists
      if (!value) {
        throw new Error("Birthdate is required");
      }

      // Check if date format is YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        throw new Error("Date must be in YYYY-MM-DD format");
      }

      // Try to create a Date object
      const date = new Date(value);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error("Enter a valid date");
      }
      const now = new Date();
      if (date > now) {
        throw new Error("Birthdate cannot be in the future");
      }
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
      if (date > minAgeDate) {
        throw new Error("User must be at least 13 years old");
      }
      return true;
    }),
  body("gender")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "FEMALE", "MALE"])
    .withMessage("Gender must be either 'MALE' or 'FEMALE'"),

  body("bio")
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters")
    .optional(),
];

export { validateBody };
