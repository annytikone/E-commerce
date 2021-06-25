import bcrypt from 'bcryptjs';

const getHashedPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

module.exports = {
  getHashedPassword,
};
