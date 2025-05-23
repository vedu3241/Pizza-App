const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/admin/orders" : "/customers/orders";
  };

  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },

    register(req, res) {
      res.render("auth/register");
    },

    async postRegister(req, res) {
      const { name, email, password } = req.body;
      // Validate request
      if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);

        return res.redirect("/register");
      }

      // check for email exist

      let result = await User.findOne({ email: email });
      if (result) {
        req.flash("error", "Email already taken");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Hash passwords
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      // create user

      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          //login
          return res.redirect("/");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
        });
    },
    logout(req, res) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    },
  };
}
module.exports = authController;
