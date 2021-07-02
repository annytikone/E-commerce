/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import productController from '../controller/product.controller';
import isSeller from '../middlewares/roleAuthentication';

const router = express.Router();

// add product
router.post(
  '/addProduct',
  passport.authenticate('jwt', { session: false }),
  isSeller,
  productController.create
);

// get products of seller
router.post(
  '/getProductsbySeller',
  passport.authenticate('jwt', { session: false }),
  productController.getAllProductsBySeller
);
// update product
router.post(
  '/updateProduct',
  passport.authenticate('jwt', { session: false }),
  productController.updateProduct
);

// delete product
router.post(
  '/deleteProduct',
  passport.authenticate('jwt', { session: false }),
  productController.deleteProduct
);

module.exports = router;
