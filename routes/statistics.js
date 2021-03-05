const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const middleware = require('../middleware/middleware')
const db_name = path.join('./data', "PollyPizza.db");
const moment = require('moment');
const formatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2
})
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Successful connection to the database 'apptest.db'");
  });
router.get("/statistics",middleware.auth,(req,res)=>{
    const sql_best = "SELECT productName, SUM(sales_qty) AS TotalQuantity FROM Sales GROUP BY productName ORDER BY SUM(sales_qty) DESC LIMIT 5"
    const sql_least = "SELECT productName, SUM(sales_qty) AS TotalQuantity FROM Sales GROUP BY productName ORDER BY SUM(sales_qty) ASC LIMIT 5"
    const sql_most = "SELECT ingredients, SUM(stockQty) AS TotalQuantity FROM stock GROUP BY ingredients ORDER BY SUM(stockQty) ASC LIMIT 5"
    db.all(sql_best,[],(err,best)=>{
      if(err){
        console.log(err.message)
      }else{
        db.all(sql_least,[],(err,least)=>{
          if(err){
            console.log(err.message)
          }else{
            db.all(sql_most,[],(err,most)=>{
              if(err){
                console.log(err.message)
              }else{
                res.render("statistics", {best : best , least:least, most:most, moment:moment})
              }
            })
            
          }
        })
         
      }
    })
    
  })
  module.exports = router;