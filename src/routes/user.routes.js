/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/user.model.js.js';
import userController from '../controller/user.controller';

const router = express.Router();
module.exports = router;

router.get('/test', async (req, res) => {
  const user = await User.find({});

  console.log(user);

  return res.json(user);
});

router.post('/signup', userController.create);

// Login
router.post('/login', userController.login);

router.post(
  '/viewProfile',
  passport.authenticate('jwt', { session: false }),
  userController.viewProfile
);

router.post(
  '/updateProfile',
  passport.authenticate('jwt', { session: false }),
  userController.updateProfile
);
