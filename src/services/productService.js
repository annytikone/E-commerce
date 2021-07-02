import Boom from '@hapi/boom';
import Product from '../model/product.model';

/**
 * Get All products.
 *
 * @param   {Object}  password
 * @param   {Object}  user
 * @returns {Promise}
 */

async function getAllProductsBySeller(query, perPage) {
  return Promise.all([
    Product.find(query).limit(Number(perPage)).populate('listedBy').exec(),
  ])
    .then((result) => {
      console.log('result::', result);
      return result;
    })
    .catch((err) => {
      console.log('catch err:', err);
      return err;
    });
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
    .catch((err) => {
      console.log('add product err:', err);
    });
}

module.exports = {
  getAllProductsBySeller,
  addProducts,
};
