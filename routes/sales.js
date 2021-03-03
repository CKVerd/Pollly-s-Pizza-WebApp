const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const multer = require('multer');
const db_name = path.join('./data', "PollyPizza.db");
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Successful connection to the database 'routertest.db'");
  });
  const formatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2
})
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
router.get("/sales",(req,res)=>{
    const sql = "SELECT * FROM Product"
    const sql_ingredients = "Select ingredients From stock"
    const sql_sales = "SELECT * FROM Sales"
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }else{
        db.all(sql_ingredients,[],(err,ing)=>{
          if(err){
            console.log(err.message)
          }else{
            db.all(sql_sales, [],(err,sales)=>{
              if(err){
                console.log(err.message)
              }else{
                res.render("sales", { rows: rows , model:ing , sales:sales , formatter:formatter, message: req.flash("eraddproduct")});
              }
            })
            
          }
        }
        
        
        )};
      
     
    });
  })
  
router.post("/addproduct" ,(req,res)=>{
    const sql_product = "INSERT INTO Product(productName,price,imageProduct)VALUES(?,?,?)";
    const sql_ingredients = "Insert INTO Recipe(ingredients,productName,recipe_qty)VALUES(?,?,?)"
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
                req.flash("eraddproduct", "Product already exists")
            }else{
              var i = 0;
              var flag = true;
              for (const inv of req.body.ingredients){  
                  db.run(sql_ingredients,[req.body.ingredients[i],req.body.productName,req.body.qty[i]],(err)=>{
                    console.log(req.body.ingredients[i] + "-" + inv + "-" + req.body.qty[i])
                    
                    if(err){
                      console.log(err.message)
                      
                     }else{ 
                      //req.flash("eraddproduct", "Product already exists")
                     }
                   })     
                  i++               
                 }                                                                               
            }//res.render("login", {message: req.flash("warn")});
            
            res.redirect("/sales")
        })   
        }
      }
    });
    });
router.get("/editProduct/:id", (req, res) => {
      const id = req.params.id;
      const sql = "SELECT * FROM Product WHERE productId = ?";
      const sql_ingredients = "Select ingredients From stock"
      db.get(sql, id, (err, row) => {
        const productName = row.productName
        if (err){
          console.log(err.message)
      }else{
        db.all(sql_ingredients,[],(err,ing)=>{
          if(err){
            console.log(err.message)
          }else{
            const sql_recipe= "SELECT ingredients,recipe_qty FROM Recipe WHERE productName = '"+productName+"'"
            db.all(sql_recipe,[],(err,recipe)=>{
              // console.log(productName)
              // console.log(recipe)
              if(err){
                console.log(err.message)
              }else{
                res.render("edit-product",{rows : row , model: ing , recipe:recipe})
              }
            })
          }
        })
      }
      });
    });
router.post("/editProduct/:id", (req, res) => {
      const id = req.params.id;
      const productName = req.body.productName;
      const price = req.body.price;
      const sql = "UPDATE Product SET productName = ?, price = ? WHERE (productId = ?)";
      const sql_update = `UPDATE Recipe set ingredients = ?,recipe_qty = ? WHERE productName = ? AND ingredients = ?`
      const sql_updateproduct = "UPDATE Recipe SET productName = ? WHERE (productName = ?)"
      const sql_product = "Select * From Product where (productId = ?) "
      const sql_recipe= "SELECT ingredients FROM Recipe WHERE productName = ?"
      var selectProduct;
      db.all(sql_product,[id],(err,product)=>{
        if(err){
          console.log(err.message)
        }else{
          db.run(sql, [productName,price,id], (err) => {
            console.log(product)
            if(err){
              console.log(err.message)    
              req.flash("eraddproduct", "Edit Product: Product name already exists")
              res.redirect("/sales")
            }else{
                db.run(sql_updateproduct,[req.body.productName,product[0].productName],(err,row)=>{
                    if(err){
                      console.log(err.message)
                    }else{
                    db.all(sql_recipe,[req.body.productName],(err,recipe)=>{ 
                        if(err){  
                            console.log(err.message)
                            
                        }else{

                          res.redirect("/sales")
                    
                    }
                  })
                    }
                  })       
            }
          })
        }
       })   
      });
router.get("/deleteProduct/:id", (req, res) => {
          const id = req.params.id;
          const sql = "SELECT * FROM Product WHERE productId = ?";
          const sql_ingredients = "Select ingredients From stock"
          db.get(sql, id, (err, row) => {
            const productName = row.productName
            if (err){
              console.log(err.message)
          }else{
            db.all(sql_ingredients,[],(err,ing)=>{
              if(err){
                console.log(err.message)
              }else{
                const sql_recipe= "SELECT ingredients,recipe_qty FROM Recipe WHERE productName = '"+productName+"'"
                db.all(sql_recipe,[],(err,recipe)=>{
                  // console.log(productName)
                  // console.log(recipe)
                  if(err){
                    console.log(err.message)
                  }else{
                    res.render("delete-product",{rows : row , model: ing , recipe:recipe})
                  }
                })
              }
            })
          }
          });
        });
router.post("/deleteProduct/:id", (req, res) => {
          const id = req.params.id;
          const sql = "DELETE FROM Product WHERE (productId = ?)";
          const sql_Recipe = "DELETE FROM Recipe WHERE (productName = ?)";
          db.run(sql, id, err => {
            if(err){
              console.log(err.message)
            }else{
            db.run(sql_Recipe,[req.body.productName],err=>{
              if(err){
                console.log(err.message)
              }else{
                res.redirect("/sales")
              }
            })
            }
          });
        });
router.get("/addSale/:id", (req, res) => {
          const id = req.params.id;
          const sql = "SELECT * FROM Product WHERE productId = ?";
          const sql_ingredients = "Select ingredients From stock"
          db.get(sql, id, (err, row) => {
            const productName = row.productName
            if (err){
              console.log(err.message)
          }else{
            db.all(sql_ingredients,[],(err,ing)=>{
              if(err){
                console.log(err.message)
              }else{
                const sql_recipe= "SELECT ingredients,recipe_qty FROM Recipe WHERE productName = '"+productName+"'"
                db.all(sql_recipe,[],(err,recipe)=>{
                  // console.log(productName)
                  // console.log(recipe)
                  if(err){
                    console.log(err.message)
                  }else{
                    var a = 0;
                  var b = 0;
                    res.render("add-sale",{rows : row, recipe:recipe ,a:a,b:b, model:ing});
                  }
                })
              }
            })
          }
          });
        });

  router.post("/addSales",(req,res)=>{
    const sql_addSales = "INSERT INTO Sales(productName,price,sales_qty,totalPrice)VALUES(?,?,?,?)"
    const sql_search = " Select * FROM Recipe WHERE productName = ?"
    const sql_stock = " Select * FROM Stock WHERE ingredients = ?"
    const sql_update = "UPDATE stock set stockQty =stockQty - (? * ?) WHERE ingredients = ?"
    var qty = []
    for(const recipe of req.body.qty){
    
    var b = 0
                qty.push(recipe)
                b++
                console.log(qty)
  }
  console.log(qty)
  
    db.run(sql_addSales,[req.body.ProductName,req.body.Price,req.body.Qty,req.body.Total],(err,row)=>{
      if(err){
        console.log(err.message)
        
      }else{
        var a = 0;
        db.all(sql_search,[req.body.ProductName],(err,product)=>{
          console.log(product)
          if(err){
            console.log(err.message)
          }else{
            for(const inv of product){
         
            db.all(sql_stock,[inv.ingredients],(err,stock)=>{
              // console.log(stock[0].stockQty + "-" + stock[0].ingredients + ' -' + req.body.qty[a])
              
              if(err){
                console.log(err.message)
                
              }else{
                console.log("===========================================================")
                
                
                  db.run(sql_update,inv.recipe_qty,req.body.Qty,inv.ingredients,(err,row)=>{
                   
                    console.log(stock[0].stockQty + " "+  inv.recipe_qty + "-" + inv.ingredients + ' =' + qty[3])//need maiterate
                    if(err){
                      console.log(err.message)
                    }else{
                      console.log("updated")
                    }
                    
                  })
                  a++
                  
                
                
              }
               
            })}res.redirect("/sales")
            
          }
        })
      }
    })
  })
module.exports = router;