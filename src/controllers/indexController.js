import db from "../db/queries";

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const usernameErr = "must be between 3 and 255 characters.";
const emailErr = 'must be in valid format: "hello@example.com".';
const passwordLengthErr = "be between 8-128 characters";
const lowerCaseErr = "have atleast one lowercase letter (a-z)";
const upperCaseErr = "have atleast one uppercase letter (A-Z)";
const digitErr = "have atleast one digit (0-9)";
const specialCharErr = "have atleast one special character (@$!%*?&)";
const matchPasswordErr = "do not match.";

const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const validateRegister = [
  body("firstName")
    .trim()
    .isAlpha()
    .isLength({ min: 3, max: 255 })
    .withMessage(`First name ${alphaErr} and ${usernameErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .isLength({ min: 3, max: 255 })
    .withMessage(`Last name ${alphaErr} and ${usernameErr}`),
  body("username")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage(`Username ${usernameErr}`),
  body("email").trim().isEmail().withMessage(`Email ${emailErr}`),
  body("password")
    .trim()
    .isLength({ min: 8, max: 128 })
    .matches(passwordValidationRegex)
    .withMessage([
      "Password must:",
      `- ${passwordLengthErr}`,
      `- ${lowerCaseErr}`,
      `- ${upperCaseErr}`,
      `- ${digitErr}`,
      `- ${specialCharErr}`,
    ]),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      // If the main password is not valid don't handle errors in here
      if (!req.body.password.match(passwordValidationRegex)) {
        return true;
      }
      if (value !== req.body.password) {
        throw new Error(`Passwords ${matchPasswordErr}`);
      }
      return true;
    }),
];

const indexController = (() => {
  const homepageGet = (req, res) => {
    res.render("index");
  };

  const loginGet = (req, res) => {
    res.render("login");
  };

  const registerGet = (req, res) => {
    res.render("register");
  };

  const registerPost = [
    validateRegister,
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).render("register", {
          errors: errors.array(),
        });
      }
      const { firstName, lastName, username, email, password } = req.body;
      db.createUser({ firstName, lastName, username, email, password });
      res.redirect("/");
    },
  ];

  return { loginGet, homepageGet, registerGet, registerPost };
})();

export default indexController;
