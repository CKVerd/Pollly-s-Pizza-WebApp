const middlewareObj = {}

middlewareObj.auth =  function(req,res,next){
  if(req.session.loggedin == true){
    next()
  }else{
    req.flash('error', 'You need to be logged in to access that route')
    res.redirect("/")
  }
}
module.exports = middlewareObj;