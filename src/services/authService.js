import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import hashPassword from '../helper/getHashedPassword';
import User from '../model/user.model';
import { ErrorHandler } from '../middlewares/errorHandler';
import config from '../config/config';
import mail from '../utils/nodemailer';

const secret = config.JWTSecret;

const generateJwtToken = async (payload, jwtSecret) => {
  console.log('generating token for:', payload);
  return jwt.sign(payload, jwtSecret, { expiresIn: 36000 });
};

async function verifyEmail(req, user) {
  try {
    const payload = {
      id: user.id,
      name: user.userName,
    };

    const token = await generateJwtToken(payload, secret);

    const message = {
      subject: 'Account Verification Token',
      html: `Hello ${user.name},\n\n Please verify your account by clicking the link: \n  <a href=http://${req.headers.host}/v1/ecommerce/confirmation/?auth=${token}\n>here</a>\n`,
      text: `\n ${user.name},Link Will Expire in 1 hour`,
    };

    const isMailSent = await mail.sendEmailByNodemailer(user.email, message);

    if (isMailSent) return true; // res.json('Please verify your mail');
    return false; // res.json('something went wrong while sending mail..');
  } catch (err) {
    return err;
  }
}

module.exports = { generateJwtToken, verifyEmail };
