import db from "../db/queries";
import { asteriskize, formatMessages } from "../scripts/utilities";

const indexController = (() => {
  const indexGet = async (req, res) => {
    let messages = await db.getMessages();
    messages = formatMessages(messages);

    res.render("index", {
      user: req.user,
      messages,
      asteriskize,
    });
  };

  return {
    indexGet,
  };
})();

export default indexController;
