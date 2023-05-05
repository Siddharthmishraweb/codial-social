module.exports.profile = function(req, res){
   // return res.end('<h1> You are in users controller </h1>');
   return res.render('user_profile', {
      title: "Codial Profile Page"
   });
}