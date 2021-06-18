/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ErrorHandler } from '../ErrorHandler/error';
import Product from '../Model/Product';
import { User, createUser } from '../Model/User';
import { sendEmailByNodemailer } from '../Email-config/nodemailerUtils';

const router = express.Router();
module.exports = router;

const sendVerifyEmailLink = (user) => {
  const emailBody = {};
  sendEmailByNodemailer();
};

router.get('/test', async (req, res) => {
  const user = await User.find({});

  console.log(user);

  res.json(user);
});

router.post('/signup', async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    console.log('newuser:', newUser);

    res.json(newUser);
  } catch (err) {
    console.log('signup catch:', err);
    next(
      new ErrorHandler(
        401,
        `Email Or Mobile Number Already Exist ||${err.message}`
      )
    );
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const secret = 'secret';
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        errors.email = 'No Account Found';
        return res.status(404).json(errors);
      }
      console.log('Login user found:', user);
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user._id,
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
});
router.post(
  '/path',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('protected path', req.user);
    res.json(('protected path', req.user));
  }
);
