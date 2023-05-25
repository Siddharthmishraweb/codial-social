const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){
   try{
      let user = await User.findOne({email: req.body.email});
      if(!user || user.password != req.body.password){
         return res.json(422, {
            message: 'Invalid Username or Password'
         })
      }
      return res.json(200, {
         message: 'Session Created Successfully, Sign In successfully and here is your token: ',
         data:{
            token: jwt.sign(user.toJSON(), 'codial', {expiresIn: '10000'})
         }
      })
   }catch(err){
      console.log("***** -ERROR- *****", err)
      return res.json(500,{
         message: 'Internal Server Error'
      });
   }
}