import passport from "passport";
import db from "../db/queries";
import { formatDistance } from "date-fns";
import { asteriskize, formatMessages } from "../scripts/utilities";

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const alphaNumericErr =
  "can only contain letters, numbers, spaces and one of these characters (_-.'\"@#%&*,!?:;()[]).";
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

const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage(`Title ${lengthErr(3, 255)}`)
    .isAlphanumeric("en-US", { ignore: "_- " })
    .withMessage(`Title ${alphaNumericErr}`),
  body("content")
    .trim()
    .isLength({ min: 10, max: 2500 })
    .withMessage(`Content ${lengthErr(10, 2500)}`)
    .isAlphanumeric("en-US", { ignore: "_- .'\"@#%&*,!?:;()[]" })
    .withMessage(`Content ${alphaNumericErr}`),
];

const indexController = (() => {
  const homepageGet = async (req, res) => {
    let messages = await db.getMessages();
    messages = formatMessages(messages);

    res.render("index", {
      user: req.user,
      messages,
      asteriskize,
    });
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
        res.redirect("/login");
      } catch (err) {
        console.error(err);
        next(err);
      }
    },
  ];

  const loginClubPost = async (req, res, next) => {
    try {
      const { SECRET_CLUB_PASSCODE } = process.env;
      const { passcode } = req.body;
      if (
        passcode.trim().toLowerCase() === SECRET_CLUB_PASSCODE.toLowerCase()
      ) {
        await db.grantClubMemberUser(req.user.id);
      } else {
        let messages = await db.getMessages();
        messages = formatMessages(messages);

        res.status(401).render("index", {
          user: req.user,
          messages,
          asteriskize,
          isRetryingClub: true,
        });
        return;
      }
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  const loginAdminPost = async (req, res, next) => {
    try {
      const { SECRET_ADMIN_PASSCODE } = process.env;
      const { passcode } = req.body;
      if (passcode === SECRET_ADMIN_PASSCODE) {
        await db.grantAdminUser(req.user.id);
      } else {
        let messages = await db.getMessages();
        messages = formatMessages(messages);

        res.status(401).render("index", {
          user: req.user,
          messages,
          asteriskize,
          isRetryingAdmin: true,
        });
        return;
      }
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  const createPostGet = (req, res) => {
    if (req.isAuthenticated()) {
      return res.render("createPost", { user: req.user });
    }
    res.redirect("/");
  };

  const createPostPost = [
    validatePost,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        const { title, content } = req.body;
        if (!errors.isEmpty()) {
          return res.status(401).render("createPost", {
            errors: errors.array(),
            title,
            content,
          });
        }

        const userId = req.user.id;
        console.log(userId);
        await db.createMessage(userId, title, content);
        res.redirect("/");
      } catch (err) {
        console.error(err);
        next(err);
      }
    },
  ];

  return {
    loginGet,
    loginPost,
    logoutPost,
    homepageGet,
    registerGet,
    registerPost,
    loginClubPost,
    loginAdminPost,
    createPostGet,
    createPostPost,
  };
})();

export default indexController;
