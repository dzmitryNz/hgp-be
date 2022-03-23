const { OK, NO_CONTENT } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const tokenService = require('../token/token.service');
const { NOT_FOUND_ERROR, ENTITY_EXISTS } = require('../../errors/appErrors');
const ENTITY_NAME = 'user';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate
} = require('../../utils/email');


const getUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }
  return user;
};

const get = async (reg) => {
  return await User.find(reg);
};

const getId = async id => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }

  return user;
};

const save = async user => {
  try {
    return await User.create(user);
  } catch (err) {
    if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this e-mail exists`);
    } else {
      throw err;
    }
  }
};

const update = async (id, user) =>
  User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

const remove = async id => User.deleteOne({ _id: id });

const recovery = async email => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }
  
  const tokens = await tokenService.getTokens(user._id);

  const url = getPasswordResetURL(user, tokens.token);
  const emailTemplate = resetPasswordTemplate(user, url); 
  const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        res.status(500).json("Error sending email")
        console.log("Error sending email")
      } else { console.log(`** Email sent **`, info.response) }
    })
  };
  sendEmail()
};



module.exports = { get, getId, getUserByEmail, save, update, remove, recovery };
