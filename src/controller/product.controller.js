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
    return res.json(addedProduct);
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

    const products = await productService.getAllProducts(query, perPage);
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
    const product = req.body;
    const query = { listedBy: user.id, _id: product.id };

    const products = await productService.updateProducts(product, query);
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

// eslint-disable-next-line consistent-return
async function deleteProduct(req, res, next) {
  try {
    const { user } = req;
    const product = req.body;
    const query = { listedBy: user.id, _id: product.id };
    const deletedProduct = await productService.deleteProducts(query);
    return res.json(deletedProduct);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAllProductsBySeller,
  updateProduct,
  deleteProduct,
};
