const middlewareObj = {}

middlewareObj.auth =  function(req,res,next){
  if(req.session.loggedin == true){
    next()
  }else{
    res.redirect("/")
  }
}
module.exports = middlewareObj;