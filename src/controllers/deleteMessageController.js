import db from "../db/queries";

const deleteMessageController = (() => {
  const deleteMessagePost = async (req, res, next) => {
    try {
      const { messageId } = req.params;
      if (req.isAuthenticated() && req.user.is_admin) {
        await db.deleteMessage(messageId);
        return res.redirect("/");
      }
      res.status(403).render("error", {
        message: "You do not have permission to delete this message.",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  return { deleteMessagePost };
})();

export default deleteMessageController;
