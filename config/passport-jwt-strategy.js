const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'codial'
};

passport.use(new JWTStrategy(opts, async function (jwtPayload, done) {
  try {
    const user = await User.findById(jwtPayload._id);
    if (user) {
      return done(null, user);
    } else {
      console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
      return done(null, false);
    }
  } catch (err) {
    console.log('Error in finding the user from JWT:', err);
    return done(err, false);
  }
}));

module.exports = passport;
