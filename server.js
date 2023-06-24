require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const PORT = process.env.PORT || 9000;

const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");

// Database connection

mongoose
  .connect("mongodb://127.0.0.1:27017/pizza", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Databse connected.."))
  .catch((err) => console.log(err));
const connection = mongoose.connection;

//session store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

// Session config

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 100 * 60 * 60 * 24 }, //24 hours
    // cookie: { maxAge: 100 * 60 },
  })
);

//passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.set("views", path.join(__dirname, "/resources/views/"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

const initRoutes = require("./routes/web"); //routes stored in routes>web.js
const MongoStore = require("connect-mongo");
initRoutes(app);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
