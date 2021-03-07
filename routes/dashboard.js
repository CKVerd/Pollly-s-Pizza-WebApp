const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const middleware = require('../middleware/middleware');
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
router.get("/dashboard",middleware.auth,(req,res)=>{
    const sql_lowStock = "SELECT ingredients FROM stock WHERE stockQty <= amountThreshold";
    const sql_monthlySales = "SELECT strftime('%Y-%m', DT) AS sales_month , sum(totalPrice) AS total_sales FROM sales GROUP BY sales_month ORDER BY sales_month ASC LIMIT 2;"
    db.all(sql_lowStock,[],(err,rows)=>{
      if(err){
        console.log(err.message)
      }else{
        console.log(rows)
        db.all(sql_monthlySales,[],(err,sales)=>{
          console.log(sales)
          if(err){
            console.log(err.message)
          }else{
            res.render("index",{model:rows , sales:sales , moment:moment , formatter:formatter})
          }
        })
         
      }
    })
    
  })
module.exports = router;