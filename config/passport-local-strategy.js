const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
   usernameField: 'email',
   passReqToCallback: true
}, function(req, email, password, done){
   User.findOne({email : email}).exec()
      .then(user => {
         if(user){
            return done(null, user);
         }else if(!user || user.password != password){
            req.flash('error', "Wrong username / password");
            return done(null, false);
         }
      })
      .catch(err => {
         req.flash('error', err)
         // console.log('Error in finding user  --> passport');
         return done(err);
      });
}
));

// serialize the user to decide which key is going to kept in cookie
passport.serializeUser(function(user, done){
   // want to store user id in the cookie
   done(null, user.id)
})



// deserialize the user from key in the cookies

passport.deserializeUser(function(id, done){
   User.findOne({_id: id}).exec()
   .then(user => {
      if(!user){
         console.log('Error in finding thr user ==> passport.js ');
         return done(err);
      }else{
         return done(null, user);
      }
   })
   .catch(err => {
      console.log('Error in finding thr user ==> passport.js ');
      return done(err);
   });
})



// check if user is authenticated
passport.checkAuthentication = function(req, res, next){
   // if user is Signed in pass in the request to the next function (controllers action)
   if(req.isAuthenticated()){
      return next();
   }

   // if user is not signed in
   return res.redirect('/users/signIn');
}


// // check if user is authenticated
// passport.isUserNotSignedIn = function(req, res, next){
//    // if user is Signed in pass in the request to the next function (controllers action)
//    if(!req.isAuthenticated()){
//       return res.redirect('/users/signIn');
//    }

//    // if user is not signed in
//    //return res.redirect('/users/signIn');
// }



// send users info to the the views
passport.setAuthenticatedUser = function(req, res, next){
   if(req.isAuthenticated()){
      //req.user  contains the information of the current signedIn user from the session cookie and we are just sending this 
      // to the locals for views
      res.locals.user = req.user;
   }
   next();
} 

module.exports = passport;

// FindByOne new syntax

// User.findOne({email : req.body.email}).exec()
// .then(user => {
//    if(!user){
//    }else{
//    }
// })
// .catch(err => {

// });