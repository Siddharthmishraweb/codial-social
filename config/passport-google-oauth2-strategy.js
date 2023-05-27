const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// Tell passport to use a new strategy for Google login
passport.use(new googleStrategy({
  clientID: "886467910780-va0gu6j2u2hp6uggn1gu24to5cdrm34i.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:8000/users/auth/google/callback"
}, async function(accessToken, refreshToken, profile, done) {
  try {
    // Find the user
    const user = await User.findOne({ email: profile.emails[0].value }).exec();
    console.log(profile);
    if (user) {
      // If found, set this user as req.user
      // If we found the user, return no error => null, user
      return done(null, user);
    } else {
      // If not found, create the user and set it as req.user
      // If the user is not there, we will create the user (sign up)
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: crypto.randomBytes(20).toString('hex')
      });
      return done(null, newUser);
    }
  } catch (err) {
    console.log('Error in Google strategy OAuth:', err);
    return done(err, false);
  }
}));

module.exports = passport;
