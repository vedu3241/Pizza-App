function controlPanelController() {
  return {
    index(req, res) {
      return res.render("admin/controlPanel");
    },
    addPizzaIndex(req, res) {
      return res.render("admin/addPizza");
    },
    editMenuIndex(req, res) {
      return res.render("admin/editMenu");
    },
  };
}
module.exports = controlPanelController;
