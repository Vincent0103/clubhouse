import db from "../../db/queries";
import { asteriskize, formatMessages } from "../../scripts/utilities";

const loginAdminController = (() => {
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

  return { loginAdminPost };
})();

export default loginAdminController;
