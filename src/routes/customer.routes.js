import express from 'express';
import passport from 'passport';
import customerController from '../controller/customer.product.controller';

const router = express.Router();
// search products
router.post(
  '/addProduct',
  passport.authenticate('jwt', { session: false }),
  customerController.search
);
module.exports = router;
