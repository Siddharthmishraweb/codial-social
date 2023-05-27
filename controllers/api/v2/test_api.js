module.exports.index = function(req, res){
   return res.json(200,{
      message: "Testing of test api",
      posts: [{name:'Abhishek'}]
   })
}