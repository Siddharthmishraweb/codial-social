module.exports.home = function(req,res){
   console.log("user ID is :: ",req.cookies);
   res.cookie('user_id', 12)
   return res.render('home', {
      title: 'WEB APP'
   })
}
