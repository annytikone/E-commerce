import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
// const passport = require('./Passport/passport-config')(passport);

import userRoutes from './routes/user.routes';
import { handleError } from './middlewares/errorHandler';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8080, () => {
  console.log('Ecommerce App is running on 8080');
});

app.use(passport.initialize());

app.use(passport.session());
require('./utils/passport')(passport);

app.use('/v1/ecommerce/', userRoutes);

app.use(async (err, req, res, next) => {
  console.log('Fired this api:->: %s %s ', await req.url, await req.meth);
  handleError(req, res, err);
});
