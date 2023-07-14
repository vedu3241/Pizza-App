const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");

// middlewares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

const Order = require("../app/models/order");

function initRoutes(app) {
  // home route
  app.get("/", homeController().index);

  //auth routes
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/logout", authController().logout);

  // cart routes
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // customers routes
  app.post("/orders", auth, orderController().store);
  app.get("/customers/orders", auth, orderController().index);
  app.get("/customers/orders/:id", auth, orderController().trackOrder);

  //Admin routes
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/orders/status", admin, statusController().update);
}
module.exports = initRoutes;
