import productService from '../services/productService';
import userService from '../services/userService';

/**
 * search products for customer.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function search(req, res, next) {
  try {
    let query;
    //  const { user } = req;
    const {
      perPage,
      department: Department,
      category: Category,
      search: Title,
    } = req.body;

    // if sort is not given at the time of request
    if (!Department && !Category && !Title) {
      query = {};
    } else {
      query = {
        $or: [
          { department: Department },
          { category: Category },
          { title: { $regex: Title } },
        ],
      };
    }

    const products = await productService.getAllProducts(query, perPage);
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { user } = req;
    console.log('user query:', req.user);

    const product = req.body;
    const query = { email: user.email };
    console.log('query:', query);
    const userPayload = { $push: { cart: [product.id] } };
    const updateUserCart = await userService.updateUser(userPayload, query);
    res.json(updateUserCart);
  } catch (err) {
    next(err);
  }
}
async function viewCart(req, res, next) {
  try {
    const { user } = req;
    console.log('user query:', req.user);
    const query = { email: user.email };
    const cartDetails = await userService.viewUserCart(query);
    res.json(cartDetails);
  } catch (err) {
    next(err);
  }
}
async function removeCart(req, res, next) {
  try {
    const { user } = req;
    console.log('user query:', req.user);

    const product = req.body;
    const query = { email: user.email };

    const userPayload = { $pull: { cart: product.id } };

    const removeFromCart = await userService.updateUser(userPayload, query);
    res.json(removeFromCart);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  search,
  addToCart,
  viewCart,
  removeCart,
};
