const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const flash = require("connect-flash");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const db_name = path.join(__dirname, "data", "PollyPizza.db");
const indexRoutes = require('./routes/account')
const inventoryRoutes = require('./routes/inventory')
const salesRoutes = require('./routes/sales')
const statRoute = require('./routes/statistics')
const dashboardRoutes = require('./routes/dashboard')
const helpRoutes = require('./routes/help')

const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Successful connection to the database 'apptest.db'");
  });
  // const sql_login =  `CREATE TABLE IF NOT EXISTS userAccount (
  //   userID INTEGER PRIMARY KEY AUTOINCREMENT,
  //   username VARCHAR(50) UNIQUE NOT NULL,
  //   password VARCHAR(50) NOT NULL,
  //   secQues1 VARCHAR(100) NOT NULL,
  //   secQues2 VARCHAR(100) NOT NULL,
  //   secQues3 VARCHAR(100) NOT NULL,
  //   secAnsw1 VARCHAR(100) NOT NULL,
  //   secAnsw2 VARCHAR(100) NOT NULL,
  //   secAnsw3 VARCHAR(100) NOT NULL
  // );`;
  // db.run(sql_login, (err) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   // console.log("Successful creation of the 'Login' table");
  // });
  // const sql_insert =  `CREATE TABLE IF NOT EXISTS stock (
  //   stockID INTEGER PRIMARY KEY AUTOINCREMENT,
  //   ingredients VARCHAR(50) UNIQUE NOT NULL,
  //   category VARCHAR(50) NOT NULL,
  //   stockQty INT(50) NOT NULL,
  //   amountThreshold INT(50) NOT NULL
  // );`;
  // db.run(sql_insert, (err) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   // console.log("Successful creation of the 'Login' table");
  // });
  // const sql_product =  `CREATE TABLE IF NOT EXISTS Product (
  //   productId INTEGER PRIMARY KEY AUTOINCREMENT,
  //   productName VARCHAR(50) UNIQUE NOT NULL,
  //   price INT(50) NOT NULL,
  //   imageProduct VARCHAR(100) NOT NULL
  // );`;
  // db.run(sql_product, (err) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   console.log("Successful creation of the 'Login' table");
  // });
  // const sql_recipe =  `CREATE TABLE IF NOT EXISTS Recipe (
  //   ingredients VARCHAR(50),
  //   productName VARCHAR(50) ,
  //   recipe_qty INT(50)
    
  // );`;
  // db.run(sql_recipe, (err) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   console.log("Successful creation of the 'Login' table");
  // });
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{
      maxAge:6000000
    }
  }));
// // Set Storage Engine
// const storage = multer.diskStorage({
//   destination: 'public/uploads',
//   filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init Upload
// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000000},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).single('myImage');

// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use(indexRoutes);
app.use(inventoryRoutes);
app.use(salesRoutes);
app.use(statRoute);
app.use(dashboardRoutes);
app.use(helpRoutes);









app.listen(5000, function () {
    console.log("listening");
  });
