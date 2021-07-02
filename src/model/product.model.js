import validator from 'validator';
import mongoose from '../utils/connect';

const { Schema } = mongoose;

const productSchema = mongoose.Schema({
  imageUrl: {
    type: String,
  },
  title: {
    required: [true, 'Title Cannot Be Empty'],
    type: String,
  },
  description: {
    type: String,
  },
  department: {
    type: String,
    enum: ['Management', 'IT & Network', 'R&D', 'Manufacturing'],
    default: ['Manufacturing'],
  },
  category: {
    type: String,
    enum: ['Hardware', 'Software', 'Toys', 'Electronics', 'Fashion', 'Beauty'],
    default: ['Electronics'],
  },
  price: {
    type: Number,
    validate: {
      validator(p) {
        return p > 0;
      },
      message: 'Invalid Price,should be more than 0',
    },
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  listedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

module.exports.getAllProducts = function (query, sort, callback) {
  Product.find(query, null, sort, callback);
};

module.exports.getProductByDepartment = function (query, sort, callback) {
  Product.find(query, null, sort, callback);
};

module.exports.getProductByCategory = function (query, sort, callback) {
  Product.find(query, null, sort, callback);
};

module.exports.getProductByTitle = function (query, sort, callback) {
  Product.find(query, null, sort, callback);
};

module.exports.filterProductByDepartment = function (department, callback) {
  const regexp = new RegExp(`${department}`, 'i');
  const query = { department: { $regex: regexp } };
  Product.find(query, callback);
};

module.exports.filterProductByCategory = function (category, callback) {
  const regexp = new RegExp(`${category}`, 'i');
  const query = { category: { $regex: regexp } };
  Product.find(query, callback);
};

module.exports.filterProductByTitle = function (title, callback) {
  const regexp = new RegExp(`${title}`, 'i');
  const query = { title: { $regex: regexp } };
  Product.find(query, callback);
};

module.exports.getProductByID = function (id, callback) {
  Product.findById(id, callback);
};
