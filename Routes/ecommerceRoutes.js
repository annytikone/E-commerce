/* eslint-disable no-console */
import express from 'express';
import { ErrorHandler } from '../ErrorHandler/error';
import { User, createUser } from '../Model/User';
import Product from '../Model/Product';

const router = express.Router();
module.exports = router;

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
