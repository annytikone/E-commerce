import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../model/user.model';
import { ErrorHandler } from '../middlewares/errorHandler';
import config from '../config/config';
import mail from '../utils/nodemailer';
import verifyToken from '../helper/emailAuthorization';

const secret = config.JWTSecret;

const getHashedPassword = async (password) =>
  await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

/**
 * Create a new user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const create = async (req, res, next) => {
  const newUser = req.body;
  try {
    const hashedPassword = await getHashedPassword(newUser.password);
    newUser.password = hashedPassword;
    newUser.passwordConfirm = hashedPassword;

    return User.create(newUser)
      .then(async (user) => {
        const payload = {
          id: user.id,
          name: user.userName,
        };
        const token = await jwt.sign(payload, secret, { expiresIn: 36000 });

        const message = {
          subject: 'Account Verification Token',
          html: `Hello ${user.name},\n\n Please verify your account by clicking the link: \n  <a href=http://${req.headers.host}/v1/ecommerce/confirmation/?auth=${token}\n>here</a>\n`,
          text: `\n ${user.name},Link Will Expire in 1 hour`,
        };

        const isMailSent = await mail.sendEmailByNodemailer(
          user.email,
          message
        );
        if (isMailSent) return res.json('Please verify your mail');
        return res.json('something went wrong..');
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

/**
 * Login.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

const login = async (req, res, next) => {
  try {
    const errors = {};
    const { email, password } = req.body;

    User.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user || !user.isActive) {
          next(
            new ErrorHandler(404, 'Account not found || Account Not Verified')
          );
        }
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              const payload = {
                id: user.id,
                name: user.userName,
              };
              jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
                if (err) next(err);

                res.json({
                  success: true,
                  accessToken: ` ${token}`,
                });
              });
            } else {
              errors.password = 'Password is incorrect';
              return res.json(errors);
            }
          })
          .catch((err) => {
            next(err);
          });
      });
  } catch (err) {
    next(err);
  }
};

/**
 * view profile of logged in user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const viewProfile = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.user.email });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * update profile of logged in user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const updateProfile = async (req, res, next) => {
  try {
    const errors = {};
    const { newpassword, oldpassword } = req.body;
    const query = { email: req.user.email };

    if (newpassword && oldpassword) {
      await User.findOne(query)
        .select('+password')
        .then(async (user) => {
          if (!user) {
            errors.email = 'No Account Found';
            return res.status(404).json(errors);
          }
          await bcrypt
            .compare(oldpassword, user.password)
            .then(async (isMatch) => {
              if (isMatch) {
                const newHashedPassword = await getHashedPassword(newpassword);
                req.body.password = newHashedPassword;
                req.body.passwordConfirm = newHashedPassword;
              } else {
                errors.email = 'Password does not match';
                return res.send(errors);
              }
            });
        });
    }
    await User.findOneAndUpdate(
      query,
      req.body,
      { upsert: true },
      async (err, user) => {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
      }
    );
  } catch (err) {
    next(err);
  }
};

// email verification
const confirmation = async (req, res, next) => {
  try {
    const token = req.query.auth;
    const temp = await verifyToken.verifyToken(token, secret);

    if (temp) {
      const query = { email: temp.email };
      await User.findOneAndUpdate(
        query,
        { $set: { isActive: true } },
        { upsert: true },
        async (err, user) => {
          if (err) return res.send(500, { error: err });
          user.isActive = true;
          user.save();
          return res.send('Succesfully Account is verified ,now login again.');
        }
      );
    }
    throw new ErrorHandler(401, 'Invalid');
  } catch (err) {
    next(err);
  }
};

async function changeRoleToSeller(req, res, next) {
  try {
    const { user } = req;
    const changeRole = await User.updateOne(
      { email: user.email },
      { $addToSet: { role: ['seller'] } }
    );
    return res.json(changeRole);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  login,
  viewProfile,
  updateProfile,
  confirmation,
  changeRoleToSeller,
};
