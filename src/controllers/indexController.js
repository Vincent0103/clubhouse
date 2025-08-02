const indexController = (() => {
  const homepageGet = (req, res) => {
    res.render("index");
  };

  return { homepageGet };
})();

export default indexController;
