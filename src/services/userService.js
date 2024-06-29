// src/services/userService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.queryTable = async () => {
  return await User.findAll({ limit: 10 });
};

exports.registerUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return !!user;
};
