const middlewareObj = {}

middlewareObj.auth =  function(req,res,next){
  if(req.session.loggedin == true){
    next()
  }else{
    req.flash('error', 'Please login using your credentials')
    res.redirect("/")
  }
}
module.exports = middlewareObj;