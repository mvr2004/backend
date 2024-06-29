// src/services/userService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendConfirmationEmail } = require('./emailService');
const { v4: uuidv4 } = require('uuid');

exports.queryTable = async () => {
  return await User.findAll({ limit: 10 });
};

// Função para gerar um código de 5 dígitos
const generateConfirmationCode = () => {
  return Math.floor(10000 + Math.random() * 90000); // Gera um número aleatório entre 10000 e 99999
};

exports.registerUser = async (name, email, password, photoUrl) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateConfirmationCode(); // Gera o código de confirmação
  const user = await User.create({ name, email, password: hashedPassword, photoUrl, confirmationCode });

  await sendConfirmationEmail(email, confirmationCode);

  return !!user;
};

exports.confirmEmail = async (email, code) => {
  const user = await User.findOne({ where: { email, confirmationCode: code } });
  if (!user) throw new Error('Código de confirmação inválido');

  user.emailConfirmed = true;
  user.confirmationCode = null;
  await user.save();

  return true;
};