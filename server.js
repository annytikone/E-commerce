import express from 'express';
import bodyParser from 'body-parser';
import routes from './Routes/ecommerceRoutes';

import { handleError } from './ErrorHandler/error';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8080, () => {
  console.log('Ecommerce App is running on 8080');
});

app.use('/v1/ecommerce/', routes);

app.use(async (err, req, res, next) => {
  console.log('Fired this api:->: %s %s ', await req.url, await req.meth);
  handleError(req, res, err);
});
