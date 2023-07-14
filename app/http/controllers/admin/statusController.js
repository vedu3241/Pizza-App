const Order = require("../../../models/order");
function statusController() {
  return {
    update(req, res) {
      Order.updateOne(
        { _id: req.body.orderId },
        { Status: req.body.status }
      ).then((result) => {
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderUpdated", {
          id: req.body.orderId,
          Status: req.body.status,
        });
        return res.redirect("/admin/orders");
      });
    },
  };
}

module.exports = statusController;
