const logoutController = (() => {
  const logoutGet = (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  };

  return { logoutGet };
})();

export default logoutController;
