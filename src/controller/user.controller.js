import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../model/user.model.js.js';
import ErrorHandler from '../middlewares/errorHandler';

/**
 * Create a new user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const create = async (req, res, next) => {
  const newUser = req.body;
  console.log(newUser);
  try {
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    newUser.password = hashedPassword;
    newUser.passwordConfirm = hashedPassword;

    return User.create(newUser).then((result) => res.json(result));
  } catch (err) {
    return next(
      new ErrorHandler(
        401,
        `Email Or Mobile Number Already Exist ||${err.message}`
      )
    );
  }
};

/**
 * Login.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

const login = async (req, res) => {
  let errors;
  const { email, password } = req.body;
  const secret = 'secret';
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        errors.email = 'No Account Found';
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.userName,
          };
          jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
            if (err)
              res.status(500).json({ error: 'Error signing token', raw: err });
            res.json({
              success: true,
              token: `Bearer ${token}`,
            });
          });
        } else {
          errors.password = 'Password is incorrect';
          res.status(400).json(errors);
        }
      });
    });
};

/**
 * view profile of logged in user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const viewProfile = async (req, res) => {
  const user = await User.find({ email: req.user.email });
  res.json(user);
};

const updateProfile = async (req, res) => {
  const query = { email: req.user.email };

  User.findOneAndUpdate(query, req.body, { upsert: true }, async (err, doc) => {
    if (err) return res.send(500, { error: err });
    return res.send('Succesfully saved.');
  });
};

module.exports = {
  create,
  login,
  viewProfile,
  updateProfile,
};
