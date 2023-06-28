const order = require("../../../models/order");

function orderController() {
  return {
    index(req, res) {
      oroder
        .find({ status: { $nq: "completed" } }, null, { sort: { created: -1 } })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/orders");
          }
        });
    },
  };
}
module.exports = orderController;
