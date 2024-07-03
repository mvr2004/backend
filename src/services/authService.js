/ src/services/authService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyLogin = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Utilizador não encontrado');
  
  if (!user.isActive) throw new Error('Utilizador inativo');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Palavra passe inválida');
  
  return user;
};



exports.verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    userid: payload.sub,
    email: payload.email,
    name: payload.name,
  };
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.registerUser = async (name, email, password, photoUrl) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, photoUrl });
  return !!user;
};

exports.verifyUserIsActive = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (user && !user.isActive) throw new Error('Utilizador inativo');
  return user;
};