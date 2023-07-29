const { request } = require("express");
const Menu = require("../../../models/menu");

function productController() {
  return {
    async addPizza(req, res) {
      const { pizzaName, pizzaPrice, pizzaSize, pizzaImg } = req.body;
      const pizza = new Menu({
        name: pizzaName,
        image: pizzaImg,
        price: pizzaPrice,
        size: pizzaSize,
      });

      await pizza
        .save()
        .then((result) => {
          console.log("pizza added to menu!");
          res.redirect("/admin/controlPanel");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async editMenuIndex(req, res) {
      const menu = await Menu.find({});
      res.render("admin/editMenu", { menu: menu });
    },
    async editItem(req, res) {
      const item = await Menu.findOne({ _id: req.params.id });
      res.render("admin/editItem", { item: item });
    },
    updatePizza(req, res) {
      Menu.updateOne(
        { _id: req.body.pizzaId },
        {
          $set: {
            name: req.body.pizzaName,
            image: req.body.pizzaImg,
            price: req.body.pizzaPrice,
            size: req.body.pizzaSize,
          },
        }
      ).then((result) => {
        console.log("pizz updated");
        res.redirect("admin/editMenu");
      });
    },

    removePizza(req, res) {
      // req.params.id;
      Menu.deleteOne({ _id: req.params.id })
        .then((result) => {
          if (result.deletedCount) {
            console.log("pizz deleted");
            res.redirect("/admin/editMenu");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
}
module.exports = productController;
