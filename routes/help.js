const express = require('express');
const middleware = require('../middleware/middleware');
const router = express.Router({ mergeParams: true });
router.get("/help",middleware.auth,(req,res)=>{
    res.render("help/help");
  });
module.exports = router;