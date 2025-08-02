const indexController = (() => {
  const homepageGet = (req, res) => {
    res.render("index");
  };

  const registerGet = (req, res) => {
    res.render("register");
  };

  const loginGet = (req, res) => {
    res.render("login");
  };

  return { loginGet, homepageGet, registerGet };
})();

export default indexController;
