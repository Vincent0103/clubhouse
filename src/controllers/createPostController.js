import { body, validationResult } from "express-validator";
import { validationErrorMessages } from "../scripts/utilities";
import db from "../db/queries";

const createPostController = (() => {
  const { alphaNumericErr, lengthErr } = validationErrorMessages;

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
        await db.createMessage(userId, title, content);
        res.redirect("/");
      } catch (err) {
        console.error(err);
        next(err);
      }
    },
  ];

  return { createPostGet, createPostPost };
})();

export default createPostController;
