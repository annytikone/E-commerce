import { Strategy, ExtractJwt } from 'passport-jwt';

import User from '../model/user.model';
import config from '../config/config';

const passport = require('passport');

const secret = config.JWTSecret;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

module.exports = () =>
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id).then((user) => {
        if (user) {
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
