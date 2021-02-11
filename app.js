const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const e = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db_name = path.join(__dirname, "data", "PollyPizza.db");
var answer = new Array(3);
var pass;
var uN;

const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Successful connection to the database 'apptest.db'");
  });
  const sql_login =  `CREATE TABLE IF NOT EXISTS userAccount (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    secQues1 VARCHAR(100) NOT NULL,
    secQues2 VARCHAR(100) NOT NULL,
    secQues3 VARCHAR(100) NOT NULL,
    secAnsw1 VARCHAR(100) NOT NULL,
    secAnsw2 VARCHAR(100) NOT NULL,
    secAnsw3 VARCHAR(100) NOT NULL
  );`;
  db.run(sql_login, (err) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Successful creation of the 'Login' table");
  });
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{
      maxAge:600000
    }
  }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.render("login");
  });
app.get("/forgot-pass1",(req,res)=>{
    res.render("forgot-pass-1")
    
    
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
         const question = [
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
         res.render("forgot-pass-2",{q1:question[0],q2:question[1],q3:question[2]})
        }
        
        else{
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
         
          res.render('forgot-pass-3')
        }
        else{
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
        res.redirect("back");
      }
      
    })
  })

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
                res.redirect("back");
              }
            });
           } else{
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
      res.redirect("/")
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
        res.redirect("/");
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
        //"error" password doesnt match
          res.redirect("/");
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
            //error "username naulit"
            res.redirect("back")
          }else{
            res.redirect("back");
          }
          
        })
      }else{
      //error password and confirm password doesnt match
      res.redirect("back")
      }
      
    })
    
  })
  app.post("/delete", (req, res) => {
    const sql = "DELETE FROM userAccount WHERE username = ?";
    if(req.body.delAccount == req.session.password){
      db.run(sql, req.session.username, err => {
        if(err){
          console.log(err.message)
        }else{
          res.redirect("/");
        }
        
      });
    }else{
      console.log(err.message)
      res.redirect("back")
    }
   
  });
  app.get("/account",(req,res)=>{
    res.render("account",{
      username:req.session.username,
      q1:req.session.secQues1,
      q2:req.session.secQues2,
      q3:req.session.secQues3,
      a1:req.session.secAnsw1,
      a2:req.session.secAnsw2,
      a3:req.session.secAnsw3,
    });
});
app.get("/help",(req,res)=>{
  res.render("help")
})
app.get("/statistics",(req,res)=>{
  res.render("statistics")
})
app.get("/sales",(req,res)=>{
  res.render("sales")
})
app.get("/inventory",(req,res)=>{
  res.render("inventory")
})
app.get("/dashboard",(req,res)=>{
  res.render("index")
})






app.post("/logout",(req,res)=>{
  req.session.destroy((err) => {
    res.redirect('/') // will always fire after session is destroyed
  })
})
app.listen(5000, function () {
    console.log("listening");
  });
