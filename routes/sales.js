const express = require("express");
const router = express.Router({ mergeParams: true });
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const middleware = require("../middleware/middleware");
const db_name = path.join("./data", "PollyPizza.db");
const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});
var arrayStock = [];

const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
});

// Set Storage Engine
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
router.get("/sales", middleware.auth, (req, res) => {
  const sql = "SELECT * FROM Product ORDER by productId DESC";
  const sql_ingredients = "Select ingredients From stock";
  const sql_sales = "SELECT * FROM Sales ORDER by salesID DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    } else {
      db.all(sql_ingredients, [], (err, ing) => {
        if (err) {
          console.log(err.message);
        } else {
          db.all(sql_sales, [], (err, sales) => {
            if (err) {
              console.log(err.message);
            } else {
              res.render("sales/sales", {
                rows: rows,
                model: ing,
                sales: sales,
                formatter: formatter,
                message: req.flash("eraddproduct"),
                success: req.flash("succsale"),
              });
            }
          });
        }
      });
    }
  });
});

router.post("/addproduct", (req, res) => {
  const sql_product =
    "INSERT INTO Product(productName,price,imageProduct)VALUES(?,?,?)";
  const sql_ingredients =
    "Insert INTO Recipe(ingredients,productName,recipe_qty)VALUES(?,?,?)";
  upload(req, res, (err) => {
    const filename = req.file.filename;
    if (err) {
      console.log(err.message);
    } else {
      if (req.file == undefined) {
      } else {
        db.run(
          sql_product,
          [req.body.productName, req.body.price, req.file.filename],
          (err) => {
            const filename = req.file.filename;
            if (err) {
              console.log(err.message);
              req.flash("eraddproduct", "Product already exists");
            } else {
              req.flash("succsale", "Product successfully added");
              var i = 0;
              var flag = true;
              for (const inv of req.body.ingredients) {
                db.run(
                  sql_ingredients,
                  [
                    req.body.ingredients[i],
                    req.body.productName,
                    req.body.qty[i],
                  ],
                  (err) => {
                    if (err) {
                      console.log(err.message);
                    } else {
                      //req.flash("eraddproduct", "Product already exists")
                    }
                  }
                );
                i++;
              }
            } //res.render("login", {message: req.flash("warn")});

            res.redirect("/sales");
          }
        );
      }
    }
  });
});
router.get("/editProduct/:id", middleware.auth, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Product WHERE productId = ?";
  const sql_ingredients = "Select ingredients From stock";
  db.get(sql, id, (err, row) => {
    const productName = row.productName;
    if (err) {
      console.log(err.message);
    } else {
      db.all(sql_ingredients, [], (err, ing) => {
        if (err) {
          console.log(err.message);
        } else {
          const sql_recipe =
            "SELECT ingredients,recipe_qty FROM Recipe WHERE productName = '" +
            productName +
            "'";
          db.all(sql_recipe, [], (err, recipe) => {
            if (err) {
              console.log(err.message);
            } else {
              res.render("sales/edit-product", {
                rows: row,
                model: ing,
                recipe: recipe,
              });
            }
          });
        }
      });
    }
  });
});
router.post("/editProduct/:id", (req, res) => {
  const id = req.params.id;
  const productName = req.body.productName;
  const price = req.body.price;
  const sql =
    "UPDATE Product SET productName = ?, price = ? WHERE (productId = ?)";
  const sql_update = `UPDATE Recipe set ingredients = ?,recipe_qty = ? WHERE productName = ? AND ingredients = ?  AND recipe_qty = ?`;
  const sql_updateproduct =
    "UPDATE Recipe SET productName = ? WHERE (productName = ?)";
  const sql_product = "Select * From Product where (productId = ?) ";
  const sql_recipe = "SELECT * FROM Recipe WHERE productName = ?";
  const sql_ingredients =
    "Insert INTO Recipe(ingredients,productName,recipe_qty)VALUES(?,?,?)";
  db.all(sql_product, [id], (err, product) => {
    if (err) {
      console.log(err.message);
    } else {
      db.run(sql, [productName, price, id], (err) => {
        if (err) {
          console.log(err.message);
          req.flash(
            "eraddproduct",
            "Edit Product: Product name already exists"
          );
          res.redirect("/sales");
        } else {
          req.flash("succsale", productName + " Successfully edited");
          db.run(
            sql_updateproduct,
            [req.body.productName, product[0].productName],
            (err, row) => {
              if (err) {
                console.log(err.message);
              } else {
                db.all(sql_recipe, [req.body.productName], (err, recipe) => {
                  if (err) {
                    console.log(err.message);
                  } else {
                    var i = 0;
                    for (const inv of req.body.ingredients) {
                      db.run(
                        sql_update,
                        inv,
                        req.body.qty[i],
                        req.body.productName,
                        recipe[i].ingredients,
                        recipe[i].recipe_qty,
                        (err, update) => {
                          if (err) {
                            console.log(err.message);
                          } else {
                          }
                        }
                      );
                      i++;
                    }
                    if (req.body.ingredient) {
                      var a = 0;
                      for (const inv of req.body.ingredient) {
                        db.run(
                          sql_ingredients,
                          [
                            req.body.ingredient[a],
                            req.body.productName,
                            req.body.qtya[a],
                          ],
                          (err) => {
                            if (err) {
                              console.log(err.message);
                            } else {
                              //req.flash("eraddproduct", "Product already exists")
                            }
                          }
                        );
                        a++;
                      }
                    }

                    res.redirect("/sales");
                  }
                });
              }
            }
          );
        }
      });
    }
  });
});
router.get("/deleteProduct/:id", middleware.auth, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Product WHERE productId = ?";
  const sql_ingredients = "Select ingredients From stock";
  db.get(sql, id, (err, row) => {
    const productName = row.productName;
    if (err) {
      console.log(err.message);
    } else {
      db.all(sql_ingredients, [], (err, ing) => {
        if (err) {
          console.log(err.message);
        } else {
          const sql_recipe =
            "SELECT ingredients,recipe_qty FROM Recipe WHERE productName = '" +
            productName +
            "'";
          db.all(sql_recipe, [], (err, recipe) => {
            if (err) {
              console.log(err.message);
            } else {
              res.render("sales/delete-product", {
                rows: row,
                model: ing,
                recipe: recipe,
              });
            }
          });
        }
      });
    }
  });
});
router.post("/deleteProduct/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Product WHERE (productId = ?)";
  const sql_Recipe = "DELETE FROM Recipe WHERE (productName = ?)";
  db.run(sql, id, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      req.flash("succsale", "Product Successfully deleted");
      db.run(sql_Recipe, [req.body.productName], (err) => {
        if (err) {
          console.log(err.message);
        } else {
          res.redirect("/sales");
        }
      });
    }
  });
});
router.get("/addSale/:id", middleware.auth, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Product WHERE productId = ?";
  const sql_ingredients = "Select ingredients From stock";
  db.get(sql, id, (err, row) => {
    const productName = row.productName;
    if (err) {
      console.log(err.message);
    } else {
      db.all(sql_ingredients, [], (err, ing) => {
        if (err) {
          console.log(err.message);
        } else {
          const sql_recipe =
            "SELECT ingredients,recipe_qty FROM Recipe WHERE productName = '" +
            productName +
            "'";
          db.all(sql_recipe, [], (err, recipe) => {
            if (err) {
              console.log(err.message);
            } else {
              res.render("sales/add-sale", {
                rows: row,
                recipe: recipe,
                model: ing,
              });
            }
          });
        }
      });
    }
  });
});

router.post("/addSales", (req, res) => {
  const sql_addSales =
    "INSERT INTO Sales(productName,price,sales_qty,totalPrice)VALUES(?,?,?,?)";
  const sql_search = " Select * FROM Recipe WHERE productName = ?";
  const sql_stock = " Select * FROM Stock WHERE ingredients = ?";
  const sql_update =
    "UPDATE stock set stockQty =stockQty - (? * ?) WHERE ingredients = ?";
  const sql_lowStock =
    "SELECT stock.ingredients,stock.stockQty FROM stock,Recipe WHERE stock.ingredients = Recipe.ingredients AND Recipe.productName = ? And (Recipe.recipe_qty * ?) > stock.stockQty";
  db.all(sql_lowStock, [req.body.ProductName, req.body.Qty], (err, row) => {
    if (err) {
    } else {
      if (row.length == 0) {
        db.run(
          sql_addSales,
          [req.body.ProductName, req.body.Price, req.body.Qty, req.body.Total],
          (err, row) => {
            if (err) {
              console.log(err.message);
            } else {
              db.all(sql_search, [req.body.ProductName], (err, product) => {
                if (err) {
                  console.log(err.message);
                } else {
                  for (const inv of product) {
                    db.all(sql_stock, [inv.ingredients], (err, stock) => {
                      if (err) {
                        console.log(err.message);
                      } else {
                        db.run(
                          sql_update,
                          inv.recipe_qty,
                          req.body.Qty,
                          inv.ingredients,
                          (err, row) => {
                            if (err) {
                              console.log(err.message);
                            } else {
                            }
                          }
                        );
                      }
                    });
                  }
                  req.flash("succsale", "Sale transaction successfully added");
                  res.redirect("/sales");
                }
              });
            }
          }
        );
      } else {
        req.flash("eraddproduct", "Not enough ingredients");
        res.redirect("/sales");
      }
    }
  });
});

router.get("/deleteSale/:id", middleware.auth, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Sales WHERE salesID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("sales/delete-sale", { model: row });
    }
  });
});
router.post("/deleteSale/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Sales WHERE (salesID = ?)";
  const sql_search = " Select * FROM Recipe WHERE productName = ?";
  const sql_stock = " Select * FROM Stock WHERE ingredients = ?";
  const sql_update =
    "UPDATE stock set stockQty =stockQty + (? * ?) WHERE ingredients = ?";
  db.run(sql, id, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      db.all(sql_search, [req.body.ProductName], (err, product) => {
        if(err){

        }else{
          for (const inv of product) {
            db.all(sql_stock, [inv.ingredients], (err, stock) => {
              if (err) {
                console.log(err.message);
              } else {
    
                db.run(
                  sql_update,
                  inv.recipe_qty,
                  req.body.Qty,
                  inv.ingredients,
                  (err, row) => {
                    if (err) {
                      console.log(err.message);
                    } else {
                    }
                  }
                );
              }
            });
          }
        }
      })
     
      req.flash("succsale", "Sale transaction successfully voided");
      res.redirect("/sales");
    }
  });
});
module.exports = router;
