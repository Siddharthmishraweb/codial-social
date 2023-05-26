const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use new strategy to google login
passport.use(new googleStrategy({
   clientID: "886467910780-va0gu6j2u2hp6uggn1gu24to5cdrm34i.apps.googleusercontent.com",
   clientSecret: "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",
   callbackURL: "http://localhost:8000/users/auth/google/callback"
},function(accessToken, refreshToken, profile, done){
   // find the user
   User.findOne({email: profile.emails[0].value}).exec(function(err, user){
      if(err){console.log('err in google strategy oAuth: ', err); return;}
      console.log(profile);
      if(user){
         // if found set this user as req.user
         // if we found user return no error => null, user
         return done(null, user);
      }else{
         // if not found , create the user and set it as req.user
         // if user is not there we will create user => sign up
         User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString('hex')
         }, function(err, user){
             if(err){console.log('err in creating user using google strategy oAuth: ', err); return;}
             return done(null, user);
         })
      }
   })
}))

module.exports = passport;