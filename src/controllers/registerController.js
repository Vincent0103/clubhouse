import { body, validationResult } from "express-validator";
import db from "../db/queries";
import { validationErrorMessages } from "../scripts/utilities";

const registerController = (() => {
  const {
    alphaErr,
    lengthErr,
    alphaNumericErr,
    emailErr,
    lowerCaseErr,
    upperCaseErr,
    digitErr,
    specialCharErr,
    matchPasswordErr,
  } = validationErrorMessages;

  const passwordValidationRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

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
      .withMessage(`Username ${lengthErr(3, 255)}`)
      .isAlphanumeric("en-US", { ignore: "_-" })
      .withMessage(`Username ${alphaNumericErr}`),
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
        res.redirect("/login");
      } catch (err) {
        console.error(err);
        next(err);
      }
    },
  ];

  return { registerGet, registerPost };
})();

export default registerController;
