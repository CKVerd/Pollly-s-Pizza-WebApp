const bcrypt = require("bcrypt"); 
const saltRounds = 10;
const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const db_name = path.join('./data', "PollyPizza.db");
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Successful connection to the database 'apptest.db'");
  });

router.get("/", (req, res) => {
    res.render("login", {message: req.flash("warn")});
  });
  router.get("/forgot-pass1",(req,res)=>{
    res.render("forgot-pass-1", {message: req.flash("erpass1")})
});

router.get("/forgot-pass2",(req,res)=>{
  res.render("forgot-pass-2",{q1:question[0],q2:question[1],q3:question[2], message: req.flash("erpass2")})
});

router.get("/forgot-pass3",(req,res)=>{
  res.render("forgot-pass-3", {message: req.flash("erpass3")}) 
});
router.post("/forgot-pass2",(req,res)=>{
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
router.post("/forgot-pass3",(req,res)=>{
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
router.post("/forgot-changePass3",(req,res)=>{
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
router.get("/account",(req,res)=>{
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
router.post("/login", (req,res) => {
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
              res.redirect('/dashboard')
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

router.post("/changeUsername",(req,res)=>{
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
router.post("/changePass",(req,res)=>{
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
  router.post("/changeSec",(req,res)=>{
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
router.post("/new",(req, res)=>{
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

  router.post("/delete", (req, res) => {
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

  router.post("/logout",(req,res)=>{
    req.session.destroy((err) => {
      res.redirect('/') // will always fire after session is destroyed
    })
  })
  module.exports = router;