const User = require('../models/user');
module.exports.profile = function(req, res){
   // return res.end('<h1> You are in users controller </h1>');
   return res.render('user_profile', {
      title: "Codial Profile Page"
   });
}


module.exports.signUp = function(req, res){
   return res.render('user_sign_up',{
      title: 'Codial | Sign Up'
   });
}
module.exports.signIn = function(req, res){
   return res.render('user_sign_in',{
      title: 'Codial | Sign In'
   });
}

// get the user detail on sign Up
// module.exports.create = function(req, res){
//    if(req.body.password != req.body.confirm_password){
//       return res.redirect('back');
//    }
//    console.log('************************', User)
//    User.findOne({email : req.body.email}, function(err, user){
//       if(err){console.log('Getting error while sign up'); return };
//       if(!user){
//          User.create(req.body, function(err, user){
//             if(err){console.log('Getting error while creating user in sign up'); return };

//             return res.redirect('/users/signIn');
//          })
//       }else{
//          // if user Already Exist
//          return res.redirect('back');
//       }
//    });
// }



module.exports.create = function(req, res){
   if(req.body.password != req.body.confirm_password){
      return res.redirect('back');
   }
   console.log('************************', User)
   User.findOne({email : req.body.email}).exec()
      .then(user => {
         if(!user){
            User.create(req.body)
               .then(user => {
                  console.log('User created');
                  return res.redirect('/users/signIn');
               })
               .catch(err => {
                  console.log('Getting error while creating user in sign up', err);
                  return res.redirect('back');
               });
         }else{
            // if user Already Exist
            return res.redirect('back');
         }
      })
      .catch(err => {
         console.log('Getting error while sign up', err);
         return res.redirect('back');
      });
}


// module.exports.create = function(req, res){
//    if(req.body.password != req.body.confirm_password){
//       return res.redirect('back');
//    }
//    console.log('************************', User);
//    User.findOne({email: req.body.email}).exec()
//       .then(user => {
//          if(!user){
//             User.create(req.body)
//                .then(user => {
//                   console.log('User created');
//                   return res.redirect('/users/signIn');
//                })
//                .catch(err => {
//                   console.log('Getting error while creating user in sign up', err);
//                   return res.redirect('back');
//                });
//          }else{
//             // if user Already Exist
//             return res.redirect('back');
//          }
//       })
//       .catch(err => {
//          console.log('Getting error while sign up', err);
//          return res.redirect('back');
//       });
// }



// get the user detail on sign In
module.exports.createSession = function(req, res){
   return res.redirect('/');
}