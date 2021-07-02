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
  const { user } = req;

  product.listedBy = user.id;
  try {
    const addedProduct = await productService.addProducts(product);
    console.log('product created:', addedProduct);
    return res.json(addedProduct);
  } catch (err) {
    console.log('catched error:', err);
    next(err);
  }
}

/**
 * List Products by seller.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function getAllProductsBySeller(req, res, next) {
  try {
    let query;
    const { user } = req;
    const {
      perPage,
      department: Department,
      category: Category,
      title: Title,
    } = req.body;

    // if sort is not given at the time of request
    if (!Department && !Category && !Title) {
      query = { listedBy: user.id };
    } else {
      query = {
        listedBy: user.id,
        $or: [
          { department: Department },
          { category: Category },
          { title: Title },
        ],
      };
    }

    const products = await productService.getAllProductsBySeller(
      query,
      perPage
    );
    console.log('listed products:', products);
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

/**
 * List Products by seller.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function updateProduct(req, res, next) {
  try {
    const { user } = req;
    const products = await productService.getAllProductsBySeller(user);
    console.log('listed products:', products);
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getAllProductsBySeller };
