import hashPassword from '../helper/getHashedPassword';
import { ErrorHandler } from '../middlewares/errorHandler';
import config from '../config/config';
import verifyToken from '../helper/emailAuthorization';
import userService from '../services/userService';
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
  const newUser = req.body;

  try {
    const isUser = await userService.findOneByEmail(newUser.email);
    if (isUser) throw new ErrorHandler(406, 'User Already Exist');
    const user = await userService.createUser(newUser);
    const verifyEmail = await authService.verifyEmail(req, user);
    if (verifyEmail) return res.json('verify your mail');
    throw new ErrorHandler(404, 'Something Went Wrong');
  } catch (err) {
    next(err);
  }
}

/**
 * Login.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

// eslint-disable-next-line consistent-return
async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await userService.findOneByEmail(email, next);
    if (!user || !user.isActive) {
      throw new ErrorHandler(406, 'User Not Found || Not Verified');
    }

    const payload = await userService.comparePasswords(password, user);
    const token = await authService.generateJwtToken(payload, secret);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
}

/**
 * view profile of logged in user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function viewProfile(req, res, next) {
  try {
    const user = await userService.findOneByEmail(req.user.email, next);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * update profile of logged in user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function updateProfile(req, res, next) {
  try {
    const { newpassword, oldpassword } = req.body;
    const userPayload = req.body;
    const query = { email: req.user.email };

    if (newpassword && oldpassword) {
      const user = await userService.findOneByEmail(query.email, next);

      if (!user) {
        throw new ErrorHandler(406, 'User Not Found ');
      }

      await userService.comparePasswords(oldpassword, user);
      const newHashedPassword = await hashPassword.getHashedPassword(
        newpassword
      );
      userPayload.password = newHashedPassword;
      userPayload.confirmPassword = newHashedPassword;
    }

    const updateUser = await userService.updateUser(userPayload, query);
    return res.json(updateUser);
  } catch (err) {
    next(err);
  }
}

/**
 * Email Verification of new user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
// eslint-disable-next-line consistent-return
async function confirmation(req, res, next) {
  try {
    const token = req.query.auth;
    const temp = await verifyToken.verifyToken(token, secret);

    if (temp) {
      const query = { email: temp.email };
      const activateAccount = await userService.updateUser({}, query);
      return res.send(
        `Congratulations ${activateAccount.name} !! \n \n Your Email Is Now Verified, Login To Njoy Our Services `
      );
    }
    throw new ErrorHandler(401, 'Invalid Email');
  } catch (err) {
    next(err);
  }
}

/**
 * Change Role To Seller.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

// eslint-disable-next-line consistent-return
async function changeRoleToSeller(req, res, next) {
  try {
    const { user } = req;
    if (user.role.includes('seller')) {
      throw new ErrorHandler(406, 'Your Already A Seller');
    }
    const changeRole = await userService.changeRole(user);
    return res.json('You Can Sell Items Now');
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
