const indexController = (() => {
  const homepageGet = (req, res) => {
    res.render("index");
  };

  const registerGet = (req, res) => {
    res.render("register");
  };

  return { registerGet, homepageGet };
})();

export default indexController;
