/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import productController from '../controller/product.controller';
import roleAuth from '../middlewares/roleAuthentication';

const router = express.Router();

//add product
router.post(
  '/addProduct',
  passport.authenticate('jwt', { session: false }),
  roleAuth,
  productController.create
);

router.post(
  '/getProductsbySeller',
  passport.authenticate('jwt', { session: false }),
  productController.getAllProductsBySeller
);

module.exports = router;
