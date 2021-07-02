import Boom from '@hapi/boom';
import Product from '../model/product.model';

/**
 * Get All products.
 *
 * @param   {Object}  password
 * @param   {Object}  user
 * @returns {Promise}
 */
async function getAllProducts(query, sort) {
  return Product.find(query, null, sort);
}

/**
 * Add Products For Seller.
 *
 * @param   {Object}  password
 * @param   {Object}  user
 * @returns {Promise}
 */
async function addProducts(product) {
  return Product.create(product)
    .then((addedproduct) => addedproduct)
    .catch(User.NotFoundError, () => {
      throw Boom.notFound('User not found');
    });
}

module.exports = {
  getAllProducts,
  addProducts,
};
