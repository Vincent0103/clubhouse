import passport from "passport";
import db from "../db/queries";
import { asteriskize } from "../utilities";

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = (min, max) => `must be between ${min} and ${max} characters.`;
const emailErr = 'must be in valid format: "hello@example.com".';
const lowerCaseErr = "have atleast one lowercase letter (a-z)";
const upperCaseErr = "have atleast one uppercase letter (A-Z)";
const digitErr = "have atleast one digit (0-9)";
const specialCharErr = "have atleast one special character (@$!%*?&)";
const matchPasswordErr = "do not match.";

const passwordValidationRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

const validateRegister = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`First name ${lengthErr(3, 255)}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`Last name ${lengthErr(3, 255)}`),
  body("username")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage(`Username ${lengthErr(3, 255)}`),
  body("email").trim().isEmail().withMessage(`Email ${emailErr}`),
  body("password")
    .trim()
    .isLength({ min: 8, max: 128 })
    .withMessage(`Password ${lengthErr(8, 128)}`)
    .matches(passwordValidationRegex)
    .withMessage([
      "Password must:",
      `• ${lowerCaseErr}`,
      `• ${upperCaseErr}`,
      `• ${digitErr}`,
      `• ${specialCharErr}`,
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
    console.log(req.user);
    res.render("index", { user: req.user, asteriskize });
  };

  const loginGet = (req, res) => {
    res.render("login");
  };

  const loginPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  });

  const registerGet = (req, res) => {
    res.render("register");
  };

  const registerPost = [
    validateRegister,
    (req, res, next) => {
      try {
        const errors = validationResult(req);
        const { password, confirmPassword, ...formData } = req.body;
        if (!errors.isEmpty()) {
          return res.status(400).render("register", {
            errors: errors.array(),
            ...formData,
          });
        }
        db.createUser({ ...formData, password });
        res.redirect("/");
      } catch (err) {
        console.error(err);
        next(err);
      }
    },
  ];

  return { loginGet, loginPost, homepageGet, registerGet, registerPost };
})();

export default indexController;
