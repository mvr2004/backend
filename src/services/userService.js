// src/services/userService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendConfirmationEmail } = require('./emailService');
const { v4: uuidv4 } = require('uuid');

exports.queryTable = async () => {
  return await User.findAll({ limit: 10 });
};

exports.registerUser = async (name, email, password, photoUrl) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = uuidv4();
  const user = await User.create({ name, email, password: hashedPassword, photoUrl, confirmationCode });

  await sendConfirmationEmail(email, confirmationCode);

  return !!user;
};

exports.confirmEmail = async (email, code) => {
  const user = await User.findOne({ where: { email, confirmationCode: code } });
  if (!user) throw new Error('Invalid confirmation code');

  user.emailConfirmed = true;
  user.confirmationCode = null;
  await user.save();

  return true;
};