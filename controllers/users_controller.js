const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const queue = require('../config/kue');
const crypto = require('crypto');
const userEmailWorker = require('../mailers/users_mailer');

module.exports.profile = async function(req, res) {
   try {
     const user = await User.findById(req.params.id).exec();
     res.render('user_profile', {
       title: 'Codial Profile Page',
       profile_user: user
     });
   } catch (err) {
     // Handle the error
     console.error(err);
     // Render an error page or return an error response
     res.status(500).send('Internal Server Error');
   }
 };
 
 
 module.exports.update = async function(req, res) {
   if (req.user.id == req.params.id) {
      try {
         // const user = await User.findByIdAndUpdate(req.params.id, req.body);
         // return res.redirect('back');
         let user = await User.findById(req.params.id);
         User.uploadedAvatar(req, res, function(err){
            if(err){ console.log('*MulterError*',err) }
            // console.log(req.file);
            user.name =  req.body.name;
            user.email = req.body.email;
            if(req.file){
               if(user.avatar){
                  // to delete the priviously existing file
                  fs.unlinkSync(path.join(__dirname, '..', user.avatar));
               }
               user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
         })
      } catch (err) {
         // Handle any errors that occur during the update
         console.error(err);
         return res.status(500).send('Internal Server Error');
      }
   } else {
      return res.status(401).send('Unauthorized');
   }
}


module.exports.signUp = function(req, res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile');
   }
   return res.render('user_sign_up',{
      title: 'Codial | Sign Up'
   });
}
module.exports.signIn = function(req, res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile');
   }
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
   //console.log('************************', User)
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
   req.flash('success', 'Logged in Successfully');
   return res.redirect('/');
}

module.exports.destroySession = function(req, res){
   req.logout(function(err){
      if(err){
         console.log("Error from users_controller ",err);
      }
      req.flash('success', 'Logged out Successfully');
      return res.redirect('/');
   });
}

module.exports.resetPassword = function(req, res)
{
   console.log('Inside controller')
    return res.render('reset_password',
    {
        title: 'Codeial | Reset Password',
        access: false
    });
}


module.exports.resetPassMail = async function(req, res) {
   console.log('AA GYE')
   try {
     const user = await User.findOne({ email: req.body.email });
     console.log(user)
     if (user) {
       if (user.isTokenValid === false) {
         user.accessToken = crypto.randomBytes(30).toString('hex');
         user.isTokenValid = true;
         await user.save();
       }
 
       let job = queue.create('user-emails', user).save(function(err) {
         if (err) {
           console.log('Error in sending to the queue', err);
           return;
         }
         console.log('Job enqueued', job.id);
       });
 
       req.flash('success', 'Password reset link sent. Please check your mail');
       return res.redirect('/');
     } else {
       req.flash('error', 'User not found. Try again!');
       return res.redirect('back');
     }
   } catch (err) {
     console.log('Error in finding user', err);
     return;
   }
 };
 


module.exports.setPassword = function(req, res)
{
    User.findOne({accessToken: req.params.accessToken}, function(err, user)
    {
        if(err)
        {
            console.log('Error in finding user', err);
            return;
        }
        if(user.isTokenValid)
        {
            return res.render('reset_password',
            {
                title: 'Codeial | Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
}

module.exports.updatePassword = function(req, res)
{
    User.findOne({accessToken: req.params.accessToken}, function(err, user)
    {
        if(err)
        {
            console.log('Error in finding user', err);
            return;
        }
        if(user.isTokenValid)
        {
            if(req.body.newPass == req.body.confirmPass)
            {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                user.save();
                req.flash('success', "Password updated. Login now!");
                return res.redirect('/users/sign-in') 
            }
            else
            {
                req.flash('error', "Passwords don't match");
                return res.redirect('back');
            }
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
}