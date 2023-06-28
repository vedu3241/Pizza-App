const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");

const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");

function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/logout", authController().logout);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // customers routes
  app.post("/orders", guest, orderController().store);
  app.get("/customers/orders", auth, orderController().index);

  //Admin routes
  app.get("/admin/orders", AdminOrderController().index);
}
module.exports = initRoutes;
