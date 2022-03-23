const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { addMethods } = require('../../utils/toResponse');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    fullname: {
      type: String,
      default: ''
    },
    admin: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: true
    },
    rated: {
      type: Boolean,
      default: true
    },
    nickname: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    },
    organization: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { collection: 'users' }
);

User.pre('save', async function preSave(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

User.pre('findOneAndUpdate', async function preUpdate(next) {
  if (this._update.$set.password) {
    this._update.$set.password = await bcrypt.hash(
      this._update.$set.password,
      10
    );
  }

  next();
});

addMethods(User);

module.exports = mongoose.model('users', User);
