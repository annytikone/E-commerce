import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from './config/config';
// const passport = require('./Passport/passport-config')(passport);

import userRoutes from './routes/user.routes';
import productSellerRoutes from './routes/seller.routes';
import productCustomerRoutes from './routes/customer.routes';
import { handleError } from './middlewares/errorHandler';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(config.PORT, () => {
  console.log(`Ecommerce App is running on ${config.PORT} `);
});

app.use(passport.initialize());

app.use(passport.session());
require('./utils/passport')(passport);

app.use('/v1/ecommerce/', userRoutes);
app.use('/v1/ecommerce/products', productSellerRoutes);
app.use('/v1/ecommerce/products/customer', productCustomerRoutes);

app.use(async (err, req, res, next) => {
  console.log('Fired this api:->: %s %s ', await req.url, await req.meth);
  handleError(req, res, err);
});
