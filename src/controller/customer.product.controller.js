import productService from '../services/productService';
/**
 * List Products by seller.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function search(req, res, next) {
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
          { title: { $regex: '^DSLR' } },
        ],
      };
    }

    const products = await productService.getAllProducts(query, perPage);
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
