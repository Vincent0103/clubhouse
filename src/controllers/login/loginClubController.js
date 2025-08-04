import db from "../../db/queries";
import { asteriskize, formatMessages } from "../../scripts/utilities";

const loginClubController = (() => {
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

  return { loginClubPost };
})();

export default loginClubController;
