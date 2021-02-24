
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const flash = require("connect-flash");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const e = require("express");
const bcrypt = require("bcrypt");
const multer = require('multer');
const saltRounds = 10;
const db_name = path.join(__dirname, "data", "PollyPizza.db");
var answer = new Array(3);
var question = new Array(3);
var pass;
var uN;

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
      maxAge:600000
    }
  }));
// Set Storage Engine
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
//forgot password routes
app.use(flash())
app.get("/", (req, res) => {
    res.render("login", {message: req.flash("warn")});
  });
  app.get("/forgot-pass1",(req,res)=>{
    res.render("forgot-pass-1", {message: req.flash("erpass1")})
});

app.get("/forgot-pass2",(req,res)=>{
  res.render("forgot-pass-2",{q1:question[0],q2:question[1],q3:question[2], message: req.flash("erpass2")})
});

app.get("/forgot-pass3",(req,res)=>{
  res.render("forgot-pass-3", {message: req.flash("erpass3")}) 
});
app.post("/forgot-pass2",(req,res)=>{
    const sql = "SELECT * FROM userAccount WHERE username = ?";
    const username = req.body.un;
    db.all(sql,[username],(err,row)=>{
      // console.log(row)
      if(err){
        console.log(err.message)
      }else
        if(row.length>0){
        question = [
           row[0].secQues1,
           row[0].secQues2,
           row[0].secQues3
         ];
         answer = [
           row[0].secAnsw1,
           row[0].secAnsw2,
           row[0].secAnsw3,
         ]
         uN = row[0].username
         pass = row[0].password
         res.render("forgot-pass-2",{q1:question[0],q2:question[1],q3:question[2], message:""})
        }
        
        else{
          req.flash("erpass1", "Username doesn't exist, please try again")
          res.redirect("back")
        }
        
      }
        
      
    );
  })
app.post("/forgot-pass3",(req,res)=>{
  const sql = "SELECT * FROM userAccount WHERE secAnsw1 = ? AND secAnsw2 = ? AND secAnsw3 = ?";
    const ans1 = req.body.a1;
    const ans2 = req.body.a2;
    const ans3 = req.body.a3;
    db.all(sql,[ans1,ans2,ans3],(err,row)=>{
      if(err){
        console.log(err.message)
      }else
        if((ans1==answer[0]&&(ans2==answer[1]&&(ans3==answer[2])))){ 
         
          res.redirect("/forgot-pass3")
        }
        else{
          req.flash("erpass2", "Incorrect answers, please try again")
          res.redirect("back")
        }
    
      })
})
app.post("/forgot-changePass3",(req,res)=>{
  const sql = "UPDATE userAccount SET password = ? WHERE (username = '"+uN+"')";
  const password = req.body.pass
  bcrypt.hash(password,saltRounds,(err,hash)=>{
    if(req.body.pass == req.body.confirmPass){
        db.run(sql,[hash],(err,row)=>{
            if(err){
              return console.log(err.message)
            } res.redirect("/");
    });
}else{
        req.flash("erpass3", "Passwords don't match, please try again")
        res.redirect("back");
      }
      
    })
  })

//account routes
app.get("/account",(req,res)=>{
    res.render("account",{
      username:req.session.username,
      q1:req.session.secQues1,
      q2:req.session.secQues2,
      q3:req.session.secQues3,
      a1:req.session.secAnsw1,
      a2:req.session.secAnsw2,
      a3:req.session.secAnsw3,
      message: req.flash("ernamepass")
    });
});
app.post("/login", (req,res) => {
    const sql = "SELECT * FROM userAccount WHERE username = ?";
    const username = req.body.un;
    const password = req.body.pw;
    
    db.all(sql,username,(err,row)=>{
        
        if (err){
          res.redirect("back");
        }
          if (row.length>0){
            bcrypt.compare(password,row[0].password,(err,response)=>{
              if(response){
              req.session.loggedin = true;
              req.session.username = username;
              req.session.password = password;
              req.session.secQues1 = row[0].secQues1;
          req.session.secQues2 = row[0].secQues2;
          req.session.secQues3 = row[0].secQues3;
          req.session.secAnsw1 = row[0].secAnsw1;
          req.session.secAnsw2 = row[0].secAnsw2;
          req.session.secAnsw3 = row[0].secAnsw3;
              res.redirect('/account')
            }else{
              req.flash("warn", "The credentials you entered did not match our records")
              res.redirect("back");
            }
          });
         } else{
          req.flash("warn", "The credentials you entered did not match our records")
          res.redirect("back");
            }
          }
      );
    });

app.post("/changeUsername",(req,res)=>{
  const sql = "UPDATE userAccount SET username = ? WHERE (username = '"+req.session.username+"')";
  const username = req.body.username;
  if(req.body.password == req.session.password){
  db.run(sql,[username],(err,row)=>{
    if(err){
      console.log(err.message)
    }else{
      req.session.username = username;
      res.redirect("/account")
    }    
    })
  }else{
     //error "Change username = Incorrect password"
      req.flash("ernamepass", "Incorrect password, please try again")
      res.redirect("/account")
    }
  })
app.post("/changePass",(req,res)=>{
  const sql = "UPDATE userAccount SET password = ? WHERE (username = '"+req.session.username+"')";
  const password = req.body.newPass;
  bcrypt.hash(password,saltRounds,(err,hash)=>{
    if((req.body.newPass == req.body.confirmPass)&&(req.body.oldPass == req.session.password)){
        db.run(sql,[hash],(err,row)=>{
            if(err){
              return console.log(err.message)
            }else{
              req.session.password = password
              res.redirect("/account");
            } 
    });
    }else{
      //error "Change Password = Incorrect password"
        req.flash("ernamepass", "Passwords don't match, please try again")
        res.redirect("/account");

      }
      
    })
  })
  app.post("/changeSec",(req,res)=>{
    const sql = "UPDATE userAccount SET secQues1= ?, secQues2 = ?, secQues3 = ?,secAnsw1 = ?, secAnsw2 = ?, secAnsw3 = ? WHERE (username = '"+req.session.username+"')";
    const password = req.body.oldpw;
    const secq1 = req.body.security1;
    const secq2 = req.body.security2;
    const secq3 = req.body.security3;
    const seca1 = req.body.ua1;
    const seca2 = req.body.ua2;
    const seca3 = req.body.ua3;
      if(password == req.session.password){
          db.run(sql,[secq1,secq2,secq3,seca1,seca2,seca3],(err,row)=>{
                req.session.secQues1 =secq1
                req.session.secQues2 = secq2
                req.session.secQues3 = secq3 
                req.session.secAnsw1 =seca1
                req.session.secAnsw2 = seca2
                req.session.secAnsw3 = seca3 
            if(err){
                console.log(err.message)  
              }else{
                
                res.redirect("/account")
              } 
      });
      }else{
        //"error" Security Questions update: password doesnt match
          req.flash("ernamepass", "Incorrect Password, please try again")
          res.redirect("/account");
        }
        
      })
app.post("/new",(req, res)=>{
    const sql_insert = "INSERT INTO userAccount(username,password,secQues1,secQues2,secQues3,secAnsw1,secAnsw2,secAnsw3)VALUES(?,?,?,?,?,?,?,?)"
    const username = req.body.user;
    const password = req.body.pw;
    const secq1 = req.body.s1;
    const secq2 = req.body.s2;
    const secq3 = req.body.s3;
    const seca1 = req.body.sa1;
    const seca2 = req.body.sa2;
    const seca3 = req.body.sa3;
    bcrypt.hash(password,saltRounds,(err,hash)=>{
      if(req.body.cpw == password){
        db.run(sql_insert,[username,hash,secq1,secq2,secq3,seca1,seca2,seca3],(err,row)=>{
          if(err){
            //error "Add account = username naulit"
            req.flash("ernamepass", "Username already exists")
            res.redirect("back")
          }else{
            res.redirect("back");
          }
          
        })
      }else{
      //error password and confirm password doesnt match = Add Account: 
      req.flash("ernamepass", "Passwords don't match")
      res.redirect("back")
      }  
    })
  })

  app.post("/delete", (req, res) => {
    const sql = "DELETE FROM userAccount WHERE username = ?";
    if(req.body.delAccount == req.session.password){
      db.run(sql, req.session.username, (err,rows) => {
        if(err){
          console.log(err.message)
        }else{
          res.redirect("/");
        }        
      });
    }else{
      //error "Delete acc = Incorrect password"
      req.flash("ernamepass", "Incorrect password, please try again")
      res.redirect("back")
    }
  });

  app.post("/logout",(req,res)=>{
    req.session.destroy((err) => {
      res.redirect('/') // will always fire after session is destroyed
    })
  })

//inventory   
app.get("/inventory",(req,res)=>{
  const sql = "SELECT * FROM stock"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }else{
      
      res.render("inventory", { rows: rows, message: req.flash("erinventory") });
    }
    
   
  });
}) 
app.post("/addStock",(req,res)=>{
    const sql_insert = "INSERT INTO stock(ingredients,category,stockQty,amountThreshold)VALUES(?,?,?,?)"
    const ingredients = req.body.Item;
    const category = req.body.category;
    const Threshold = req.body.threshold;
    const Stock = req.body.AmountStock
    db.run(sql_insert,[ingredients,category,Stock,Threshold],(err,row)=>{
      if(err){
        console.log(err.message)
        req.flash("erinventory", "Ingredient already exists")
        res.redirect("/inventory")
      }else{
        res.redirect("/inventory")
      }
    })

  })
  app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const ingredients = req.body.eName;
    const category = req.body.eCategory;
    const Threshold = req.body.eThres;
    const Stock = req.body.eStock
    const sql = "UPDATE stock SET ingredients = ?, category = ?, stockQty = ?, amountThreshold = ? WHERE (stockID = ?)";
    db.run(sql, [ingredients,category,Stock,Threshold,id], err => {
      if(err){
        //res.render("/edit", {message: req.flash("erinventory") });
        req.flash("erinventory", "Ingredient name already exists")
        res.redirect("/inventory")
        console.log(err.message)
      }else{
        res.redirect("/inventory")
      }
    });
  });
  app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM stock WHERE (stockID = ?)";
    db.run(sql, id, err => {
      if(err){
        console.log(err.message)
      }else{
        res.redirect("/inventory")
      }
    });
  });
app.post("/sort",(req,res)=>{
    const sql_high = "SELECT * FROM stock ORDER BY stockQty DESC"
    const sql_low = "SELECT * FROM stock ORDER BY stockQty ASC"
    const sql_sort = "SELECT * FROM stock WHERE category ='"+req.body.sort+"'"
    if(req.body.sort == "Stock Amount (High)"){
      db.all(sql_high, [], (err, rows) => {
        if (err) {
          console.error(err.message);
        }else{
          console.log(rows)
          res.render("inventory", { rows: rows, message: req.flash("erinventory") });
        }  
      });
    }else if (req.body.sort == "Stock Amount (Low)"){
      db.all(sql_low, [], (err, rows) => {
        if (err) {
          console.error(err.message);
        }else{
          console.log(rows)
          res.render("inventory", { rows: rows, message: req.flash("erinventory") });
        }      
      });
    }else if (req.body.sort){
      db.all(sql_sort, [], (err, rows) => {
        if (err) {
          console.error(err.message);
        }else{
          console.log(rows)
          res.render("inventory", { rows: rows, message: req.flash("erinventory") });
        }
      });
    }
  });

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM stock WHERE stockID = ?";
    db.get(sql, id, (err, row) => {
      if (err){

        console.log(err.message)
    }else{
      console.log(row)
      res.render("edit-stock",{model:row});
    }
     
    });
  });
app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM stock WHERE stockID = ?";
    db.get(sql, id, (err, row) => {
      if (err){
        console.log(err.message)
    }else{
      res.render("delete-stock",{model:row});
    }
     
    });
  });
app.post("/search",(req,res)=>{
  const item = req.body.search;
  const sql_search = "SELECT * from stock where ingredients LIKE '"+req.body.search+"%'"
  db.all(sql_search,[],(err,rows)=>{
    if(err){
      console.log(err.message)
    }else{
      res.render("inventory", { rows: rows, message: req.flash("erinventory") });
    }
  })
})
//sales
app.get("/sales",(req,res)=>{
  const sql = "SELECT * FROM Product"
  const sql_ingredients = "Select ingredients From stock"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }else{
      db.all(sql_ingredients,[],(err,ing)=>{
        if(err){
          console.log(err.message)
        }else{
          res.render("sales", { rows: rows , model:ing });
        }
      }
      
      
      )};
    
   
  });
})

app.post("/addproduct" ,(req,res)=>{
  const sql_product = "INSERT INTO Product(productName,price,imageProduct)VALUES(?,?,?)";
  const sql_ingredients = "Insert INTO Recipe(ingredients,productName,recipe_qty)VALUES(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?)"
  upload(req, res, (err) => {
    const filename = req.file.filename
    if(err){
      console.log(err.message)
    } else {
      if(req.file == undefined){
        console.log(req.file)
      } else {
        db.run(sql_product,[req.body.productName,req.body.price,req.file.filename],(err)=>{
          const filename = req.file.filename
          
          if(err){
              console.log(err.message);
          }else{
            var insert = []
            var i = 0;
            var flag = true;
           
            
               while(flag == true){
                insert.push(req.body.ingredients[i],req.body.productName,req.body.qty[i])
                i++
                
                if(req.body.qty[i]==""){
                  flag = false;
                }
                else if(i == 20){
                  flag = false;
                }
                
               }
               db.run(sql_ingredients,insert,(err)=>{
                if(err){
                  console.log(err.message)
                 }else{
                  res.redirect("/sales")
                 }
               })
              
              
               
              
                
             
            
          }
      })
        
      }
    }
  });
  
  });


app.get("/help",(req,res)=>{
  res.render("help")
})
app.get("/statistics",(req,res)=>{
  res.render("statistics")
})


app.get("/dashboard",(req,res)=>{
  const sql_lowStock = "SELECT ingredients FROM stock WHERE stockQty <= amountThreshold";
  db.all(sql_lowStock,[],(err,rows)=>{
    if(err){
      console.log(err.message)
    }else{
      console.log(rows)
      res.render("index",{model:rows})
    }
  })
  
})







app.listen(5000, function () {
    console.log("listening");
  });
