/* eslint-disable max-len */
import validator from 'validator';
import bcrypt from 'bcryptjs';

import mongoose from './connect';

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    validate: [
      validator.isAlphanumeric,
      'Your name should only contain alphabets',
    ],
  },
  email: {
    type: String,
    unique: [true, 'Email-id Already exists'],
    lowercase: true, // Transform the email to lowercase
    validate: [validator.isEmail, 'Please enter a valid email-id'],
  },
  mobileNo: {
    type: String,
    unique: [true, 'Mobile no. Already exists'],
    validate: [validator.isMobilePhone, 'Please enter a valid mobile number'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password should have at least 8 characters'],
    select: false, // By this it will not be displayed the password in response this.password cannot be used
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on save and create!!
      validator(el) {
        // using simple function to get access to this keyword
        return el === this.password;
      },
      message: 'Password and Confirm-Password did not match',
    },
    select: false,
  },
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  role: {
    type: [
      {
        type: String,
        enum: ['user', 'admin', 'seller'],
      },
    ],
    default: ['user'],
  },
  address: { type: Array, default: [] },
  isActive: {
    type: Boolean,
    default: false,
  },
});

/*
userSchema.pre('save', async function (next) {
  console.log('presave hit');
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
*/

const User = mongoose.model('User', userSchema);

module.exports = User;
