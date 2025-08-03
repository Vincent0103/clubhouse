import passport from "passport";
import db from "../db/queries";
import { asteriskize } from "../scripts/utilities";

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
    res.render("index", { user: req.user, asteriskize, isRetrying: false });
  };

  const loginGet = (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.render("login");
  };

  const loginPost = [
    (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).render("login", {
            errors: [{ msg: info.message }],
            username: req.body.username,
          });
        }
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.redirect("/");
        });
      })(req, res, next);
    },
  ];

  const logoutPost = (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  };

  const registerGet = (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.render("register");
  };

  const registerPost = [
    validateRegister,
    (req, res, next) => {
      try {
        const errors = validationResult(req);
        const { password, confirmPassword, ...formData } = req.body;
        if (!errors.isEmpty()) {
          return res.status(401).render("register", {
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

  const loginClubPost = async (req, res, next) => {
    try {
      const { SECRET_PASSCODE } = process.env;
      const { passcode } = req.body;
      if (passcode.trim().toLowerCase() === SECRET_PASSCODE.toLowerCase()) {
        await db.grantClubMemberUser(req.user.id);
      } else {
        res
          .status(401)
          .render("index", { user: req.user, asteriskize, isRetrying: true });
        return;
      }
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  return {
    loginGet,
    loginPost,
    logoutPost,
    homepageGet,
    registerGet,
    registerPost,
    loginClubPost,
  };
})();

export default indexController;
