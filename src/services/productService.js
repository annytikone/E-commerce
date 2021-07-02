import Boom from '@hapi/boom';
import Product from '../model/product.model';

/**
 * Get All products.
 *
 * @param   {Object}  query
 * @param   {Object}  perPage
 * @returns {Promise}
 */

async function getAllProducts(query, perPage) {
  return Promise.all([
    Product.find(query).limit(Number(perPage)).populate('listedBy').exec(),
  ])
    .then((result) => result)
    .catch((err) => err);
}

/**
 * Add Products For Seller.
 *
 * @param   {Object}  product
 * @returns {Promise}
 */
async function addProducts(product) {
  return Product.create(product)
    .then((addedproduct) => addedproduct)
    .catch((err) => {
      console.log('add product err:', err);
    });
}

/**
 * Update Products For Seller.
 *
 * @param   {Object}  productPayload
 * @param   {Object}  query
 * @returns {Promise}
 */
async function updateProducts(productPayload, query) {
  return Product.findOneAndUpdate(
    query,
    productPayload,
    { upsert: true },
    async (err, updatedProduct) => {
      if (err || !updatedProduct) {
        throw Boom.notAcceptable(`something went wrong during update ${err}`);
      }
      updatedProduct.save();
      return updatedProduct;
    }
  );
}

/**
 * Delete Products For Seller.
 *
 * @param   {Object}  query
 * @returns {Promise}
 */
async function deleteProducts(query) {
  return Product.findOne(query).remove(query).exec();
}

module.exports = {
  getAllProducts,
  addProducts,
  updateProducts,
  deleteProducts,
};
