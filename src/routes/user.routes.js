/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import userController from '../controller/user.controller';
import roleAuth from '../middlewares/roleAuthentication';

const router = express.Router();

// SignUp
router.post('/signup', userController.create);

// Login
router.post('/login', userController.login);

router.post(
  '/viewProfile',
  passport.authenticate('jwt', { session: false }),
  userController.viewProfile
);

// Update Profile
router.post(
  '/updateProfile',
  passport.authenticate('jwt', { session: false }),
  userController.updateProfile
);

// email verification
router.get('/confirmation', userController.confirmation);

// Change Role to seller
router.post(
  '/becomeSeller',
  passport.authenticate('jwt', { session: false }),
  userController.changeRoleToSeller
);

router.post(
  '/roleauth',
  passport.authenticate('jwt', { session: false }),
  roleAuth,
  userController.changeRoleToSeller
);

module.exports = router;
