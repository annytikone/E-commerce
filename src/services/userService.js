import bcrypt from 'bcryptjs';
import Boom from '@hapi/boom';
import hashPassword from '../helper/getHashedPassword';
import User from '../model/user.model';

/**
 * Compare Passwords.
 *
 * @param   {Object}  password
 * @param   {Object}  user
 * @returns {Promise}
 */
async function comparePasswords(password, user) {
  return bcrypt
    .compare(password, user.password)
    .then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        return payload;
      }

      throw Boom.notAcceptable('Password is incorrect');
    })
    .catch(User.NotFoundError, () => {
      throw Boom.notAcceptable('Password is incorrect');
    });
}

/**
 * findOne By Email.
 *
 * @param   {Object}  email
 * @returns {Promise}
 */
async function findOneByEmail(email, next) {
  try {
    return await User.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          return false;
        }
        return user;
      });
  } catch (err) {
    next(err);
    return err;
  }
}

/**
 * Create new user.
 *
 * @param   {Object}  user
 * @returns {Promise}
 */
async function createUser(user) {
  const newUser = user;
  try {
    const hashedPassword = await hashPassword.getHashedPassword(
      newUser.password
    );
    newUser.password = hashedPassword;
    newUser.passwordConfirm = hashedPassword;

    return User.create(newUser)
      .then((createdUser) => createdUser)
      .catch(User.NotFoundError, () => {
        throw Boom.notFound('User not found');
      });
  } catch (err) {
    return err;
  }
}

/**
 * Update User.
 *
 * @param   {Object}  userPayload
 * @param   {Object}  query
 * @returns {Promise}
 */
async function updateUser(userPayload, query) {
  console.log('userPayload, query:', userPayload, query);
  return User.findOneAndUpdate(
    query,
    // { $set: { isActive: true } },
    userPayload,
    { upsert: true },
    async (err, user) => {
      if (err) {
        throw Boom.notAcceptable(`something went wrong during update ${err}`);
      }
      if (!user.isActive) user.isActive = true;
      user.save();
      return user;
    }
  );
}

/**
 * update  user role.
 *
 * @param   {Object}  user
 * @returns {Promise}
 */
async function changeRole(user) {
  return User.updateOne(
    { email: user.email },
    { $addToSet: { role: ['seller'] } }
  );
}
/**
 * view  user cart.
 *
 * @param   {Object}  user
 * @returns {Promise}
 */
async function viewUserCart(query) {
  return Promise.all([User.find(query).select('cart').populate('cart').exec()])
    .then((result) => result)
    .catch((err) => err);
}
module.exports = {
  createUser,
  findOneByEmail,
  comparePasswords,
  updateUser,
  changeRole,
  viewUserCart,
};
