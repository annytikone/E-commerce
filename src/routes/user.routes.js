/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import User from '../model/user.model';
import userController from '../controller/user.controller';
import sendMailByNodemailer from '../utils/nodemailer';
import verifyToken from '../helper/emailAuthorization';

const router = express.Router();

router.get('/test', async (req, res) => {
  const user = await User.find({});
  return res.json(user);
});

router.post('/testauth', async (req, res) => {
  const { token } = req.body;
  const temp = await verifyToken.verifyToken(token, 'Amaterasu');
  console.log('temp', temp);
  res.json(temp);
});

// SignUp
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

// email verification
router.get('/confirmation', userController.confirmation);

module.exports = router;
