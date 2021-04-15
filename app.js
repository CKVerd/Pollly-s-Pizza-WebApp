const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const flash = require("connect-flash");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db_name = path.join(__dirname, "data", "PollyPizza.db");
const indexRoutes = require("./routes/account");
const inventoryRoutes = require("./routes/inventory");
const salesRoutes = require("./routes/sales");
const statRoute = require("./routes/statistics");
const dashboardRoutes = require("./routes/dashboard");
const helpRoutes = require("./routes/help");

const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }

});

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 6000000,
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(indexRoutes);
app.use(inventoryRoutes);
app.use(salesRoutes);
app.use(statRoute);
app.use(dashboardRoutes);
app.use(helpRoutes);

app.listen(5000, function () {
  console.log("listening");
});
