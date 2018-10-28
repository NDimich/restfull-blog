const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const Author = mongoose.model('authors');
const errorHandler = require('../utils/errorHandler');


const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
};
module.exports = passport => {
  passport.use(
      new JwtStrategy(option, async (payload, done) => {
        try {
          const user = await Author.findById(payload.userId).select('email id');

          if(user) {
            done(null, user)
          } else {
            done(null, false)
          }

        } catch (e) {
          errorHandler(e)
        }
      })
  )
};