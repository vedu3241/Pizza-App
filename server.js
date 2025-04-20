require("dotenv").config();
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();

const PORT = process.env.PORT || 9000;

const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");
const Emitter = require("events");

// Database connection

// mongodb://127.0.0.1:27017/pizza

mongoose
  .connect("mongodb+srv://ved:test123@cluster0.1goshc7.mongodb.net/pizza_app", {
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
// Emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

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
  // console.log(res.locals.user.role);
  next();
});

app.set("views", path.join(__dirname, "/resources/views/"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

const initRoutes = require("./routes/web"); //routes stored in routes>web.js
const MongoStore = require("connect-mongo");
initRoutes(app);

const server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

//socket

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
