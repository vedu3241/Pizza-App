const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
  return {
    store(req, res) {
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        console.log("phone add error");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });
      console.log("here");
      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }).then(
            (err, placedOrder) => {
              req.flash("success", "Order placed successfully");
              console.log("order placed successfully");
              delete req.session.cart;
              // Emmit
              const eventEmitter = req.app.get("eventEmitter");
              eventEmitter.emit("orderPlaced", placedOrder);

              return res.redirect("/customers/orders");
            }
          );
        })
        .catch((err) => {
          return res.redirect("/register");
        });
    },

    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "cache-control",
        "no-cache, private, no-store, must-revalidate,max-stale=0, post-check=0, pre-check=0"
      );
      res.render("customers/orders", { orders: orders, moment: moment });
    },

    async trackOrder(req, res) {
      const order = await Order.findOne({ _id: req.params.id });
      // Autherize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order: order });
      }
      return res.redirect("/");
    },
  };
}
module.exports = orderController;
