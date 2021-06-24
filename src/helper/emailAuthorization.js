import jwt from 'jsonwebtoken';
import User from '../model/user.model';

exports.verifyToken = (token, accessTokenSecret) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, accessTokenSecret, (err, result) => {
      if (err) {
        return reject(err);
      }
      return User.findById(result.id).then((user) => {
        if (user) {
          console.log(user);
          return resolve({
            id: user.id,
            name: user.name,
            email: user.email,
          });
        }
        return reject(err);
      });
    })
  );
