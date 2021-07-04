import express from 'express';
import passport from 'passport';
import customerController from '../controller/customer.product.controller';

const router = express.Router();

// search products
router.post(
  '/searchProducts',
  passport.authenticate('jwt', { session: false }),
  customerController.search
);

// add to cart
router.post(
  '/addToCart',
  passport.authenticate('jwt', { session: false }),
  customerController.addToCart
);

//  cart details
router.get(
  '/viewCart',
  passport.authenticate('jwt', { session: false }),
  customerController.viewCart
);

//  cart details
router.post(
  '/removeFromCart',
  passport.authenticate('jwt', { session: false }),
  customerController.removeCart
);

//  cart details
router.post(
  '/checkOut',
  passport.authenticate('jwt', { session: false })
  // customerController.checkOutOrder
);

module.exports = router;
