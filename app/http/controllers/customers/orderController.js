const order = require("../../../models/order");
const Order = require("../../../models/order");
const moment = require("moment");
function orderController() {
  return {
    store(req, res) {
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });

      order
        .save()
        .then((result) => {
          req.flash("success", "Order placed successfully");
          console.log("order placed successfully");
          delete req.session.cart;
          return res.redirect("/customers/orders");
        })
        .catch((err) => {
          return res.redirect("/register");
        });
    },

    async index(req, res) {
      const orders = await order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.render("customers/orders", { orders: orders, moment: moment });
    },
  };
}
module.exports = orderController;
