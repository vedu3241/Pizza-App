const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const PORT = process.env.PORT || 9000;
// const expressLayout = require("express-ejs-layouts");

// app.use(expressLayout);

app.use(express.static("public"));

app.set("views", path.join(__dirname, "/resources/views/"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/cart", (req, res) => {
  res.render("customers/cart");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});
app.get("/register", (req, res) => {
  res.render("auth/register");
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
