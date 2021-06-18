import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../Model/User';
const passport = require('passport');

const secret = 'secret';
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

module.exports = () =>
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id).then((user) => {
        if (user) {
          console.log('Authenticating user through passport:', user);
          return done(null, {
            id: user.id,
            name: user.name,
            email: user.email,
          });
        }
        return done(null, false);
      });
    })
  );
