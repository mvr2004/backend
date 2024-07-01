// src/services/userService.js
const User = require('../models/User');
const Centro = require('../models/Centro');
const bcrypt = require('bcrypt');
const { sendConfirmationEmail } = require('./emailService');
const { v4: uuidv4 } = require('uuid');

exports.queryTable = async () => {
  return await User.findAll({
    limit: 10,
    include: Centro
  });
};

// Função para gerar um código de 5 dígitos
const generateConfirmationCode = () => {
  return Math.floor(10000 + Math.random() * 90000); // Gera um número aleatório entre 10000 e 99999
};

exports.registerUser = async (name, email, password, photoUrl, centroId) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateConfirmationCode();
  const user = await User.create({ name, email, password: hashedPassword, photoUrl, centroId, confirmationCode });

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

exports.updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Usuário não encontrado');
  
  user.password = hashedPassword;
  user.firstLogin = false;
  await user.save();

  return true;
};