import Boom from '@hapi/boom';
import Product from '../model/product.model';

/**
 * Get All products.
 *
 * @param   {Object}  password
 * @param   {Object}  user
 * @returns {Promise}
 */

async function getAllProductsBySeller(user) {
  return Product.find({ listedBy: user.id })
    .populate('listedBy')
    .exec((err, items) => {
      console.log('Populated User ' + items, items.listedBy);
      return items;
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
