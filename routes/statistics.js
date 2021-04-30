const express = require("express");
const router = express.Router({ mergeParams: true });
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const middleware = require("../middleware/middleware");
const db_name = path.join("./data", "PollyPizza.db");
const moment = require("moment");
const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
});
router.get("/statistics", middleware.auth, (req, res) => {
  const sql_best =
    "SELECT productName, SUM(sales_qty) AS TotalQuantity FROM Sales GROUP BY productName ORDER BY SUM(sales_qty) DESC LIMIT 5";
  const sql_least =
    "SELECT productName, SUM(sales_qty) AS TotalQuantity FROM Sales GROUP BY productName ORDER BY SUM(sales_qty) ASC LIMIT 5";
  const sql_most = "SELECT avg(totalPrice) AS TotalSales FROM Sales ";
  const sql_bar =
    "SELECT   DT, sum(totalPrice) as totalSum FROM Sales GROUP BY DT ORDER by DT DESC LIMIT 7";
    const sql_sales = "SELECT * FROM Sales ";
  db.all(sql_sales,[],(err,sales)=>{
    if(err){
      console.log(err.message)
    }else{
      db.all(sql_best, [], (err, best) => {
        if (err) {
          console.log(err.message);
        } else {
          db.all(sql_least, [], (err, least) => {
            if (err) {
              console.log(err.message);
            } else {
              db.all(sql_most, [], (err, most) => {
                if (err) {
                  console.log(err.message);
                } else {
                  db.all(sql_bar, [], (err, bar) => {
                    var DT = [];
                    var totalSum = [];
                    var i = 0;
                    for (i = 0; i < 7; i++) {
                      if (bar[i].totalSum == undefined || bar[i].DT == undefined) {
                      }
                      DT.push(bar[i].DT);
                      totalSum.push(bar[i].totalSum);
                    }
    
                    if (err) {
                      console.log(err.message);
                    } else {
                      res.render("statistics/statistics", {
                        best: best,
                        least: least,
                        most: most,
                        date: DT,
                        sum: totalSum,
                        sales:sales,
                        moment: moment,
                        formatter: formatter,
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  })

});
module.exports = router;
