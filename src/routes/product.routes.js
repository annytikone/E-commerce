/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import productController from '../controller/product.controller';
import roleAuth from '../middlewares/roleAuthentication';

const router = express.Router();

//add product
router.post('/addProduct', productController.create);

module.exports = router;
