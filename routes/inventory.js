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
router.get("/inventory",(req,res)=>{
    const sql = "SELECT * FROM stock"
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }else{
        
        res.render("inventory", { rows: rows, message: req.flash("erinventory") });
      }
      
     
    });
  }) 
  router.post("/addStock",(req,res)=>{
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
    router.post("/edit/:id", (req, res) => {
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
    router.post("/delete/:id", (req, res) => {
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
  router.post("/sort",(req,res)=>{
      const sql_high = "SELECT * FROM stock ORDER BY stockQty DESC"
      const sql_low = "SELECT * FROM stock ORDER BY stockQty ASC"
      const sql_recently = "SELECT * FROM stock ORDER BY stockID DESC"
      const sql_sort = "SELECT * FROM stock WHERE category ='"+req.body.sort+"'"
      if(req.body.sort == "High to Low"){
        db.all(sql_high, [], (err, rows) => {
          if (err) {
            console.error(err.message);
          }else{
            console.log(rows)
            res.render("inventory", { rows: rows, message: req.flash("erinventory") });
          }  
        });
      }else if (req.body.sort == "Low to High"){
        db.all(sql_low, [], (err, rows) => {
          if (err) {
            console.error(err.message);
          }else{
            console.log(rows)
            res.render("inventory", { rows: rows, message: req.flash("erinventory") });
          }      
        });
      }else if (req.body.sort == "Recently Added"){
        db.all(sql_recently,[],(err,rows)=>{
          if (err) {
            console.error(err.message);
          }else{
            console.log(rows)
            res.render("inventory", { rows: rows, message: req.flash("erinventory") });
          }
        })
      }
      else if (req.body.sort){
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
  
  router.get("/edit/:id", (req, res) => {
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
  router.get("/delete/:id", (req, res) => {
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
  router.post("/search",(req,res)=>{
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
  module.exports = router;