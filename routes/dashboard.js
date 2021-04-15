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
router.get("/dashboard", middleware.auth, (req, res) => {
  const sql_lowStock =
    "SELECT ingredients FROM stock WHERE stockQty <= amountThreshold";
  const sql_monthlySales =
    "SELECT strftime('%Y-%m', DT) AS sales_month , sum(totalPrice) AS total_sales FROM sales GROUP BY sales_month ORDER BY sales_month DESC LIMIT 2";
  const sql_weekly =
    "SELECT strftime('%W', DT) AS sales_week , sum(totalPrice) AS total_sales FROM sales GROUP BY sales_week ORDER BY sales_week DESC LIMIT 4 ";
  db.all(sql_lowStock, [], (err, rows) => {
    if (err) {
      console.log(err.message);
    } else {
      db.all(sql_monthlySales, [], (err, sales) => {
        if (err) {
          console.log(err.message);
        } else {
          db.all(sql_weekly, [], (err, weekly) => {
            var weekgraph = [];
            var i = 0;
            for (i = 0; i < 4; i++) {
              if (weekly[i].totalSales == undefined) {
              }
              weekgraph.push(weekly[i].total_sales);
            }

            if (err) {
              console.log(err.message);
            } else {
              res.render("dashboard/index", {
                model: rows,
                sales: sales,
                weekgraph: weekgraph,
                moment: moment,
                formatter: formatter,
              });
            }
          });
        }
      });
    }
  });
});
module.exports = router;
