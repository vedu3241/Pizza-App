const order = require("../../../models/order");

function orderController() {
  return {
    index(req, res) {
      order
        .find({ Status: { $ne: "completed" } }, null, {
          sort: { createdAt: -1 },
        })
        .populate("customerId", "-password")
        .then((orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/orders");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };
}
module.exports = orderController;
