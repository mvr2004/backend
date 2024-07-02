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

exports.checkUserExists = async (email) => {
  const user = await User.findOne({ where: { email } });
  return !!user;
};

exports.registerUser = async (name, email, password, photoUrl) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateConfirmationCode();

  // Check if user already exists with the same email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  try {
    const user = await User.create({ name, email, password: hashedPassword, photoUrl, confirmationCode });
    await sendConfirmationEmail(email, confirmationCode);
    return { success: true, user };
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return { success: false, reason: 'user_exists' };
    }
    throw err;
  }
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

exports.updateUserCentro = async (userId, centroId) => {
  console.log(`Tentando atualizar centro para o usuário com ID ${userId}`);
  const user = await User.findByPk(userId);
  if (!user) {
    console.error(`Usuário com ID ${userId} não encontrado`);
    throw new Error('Usuário não encontrado');
  }

  user.centroId = centroId;
  await user.save();

  return true;
};
