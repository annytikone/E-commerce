import hashPassword from '../helper/getHashedPassword';
import { ErrorHandler } from '../middlewares/errorHandler';
import config from '../config/config';
import verifyToken from '../helper/emailAuthorization';
import productService from '../services/productService';
import authService from '../services/authService';

const secret = config.JWTSecret;

/**
 * Create a new user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function create(req, res, next) {
  const product = req.body;
  const user = {
    cart: [],
    role: ['user'],
    address: ['pune', 'mumbai'],
    isActive: false,
    name: 'aniket',
    email: 'aniket8@gmail.com',
    mobileNo: '76686957306',
    password: '$2a$10$kCbVtq0zi70XnBaMuHe1aO/3XsOufF4S4DsHoTsW1QLWLhdwsL0r2',
    passwordConfirm:
      '$2a$10$kCbVtq0zi70XnBaMuHe1aO/3XsOufF4S4DsHoTsW1QLWLhdwsL0r2',
    __v: 0,
  };
  product.listedBy = '60d5f138e0181019d1e191fc';
  try {
    const addedProduct = await productService.addProducts(product);
    console.log('product created:', addedProduct);
  } catch (err) {
    console.log('catched error:', err);
    next(err);
  }
}

module.exports = { create };
