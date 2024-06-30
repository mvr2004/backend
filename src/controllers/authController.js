// src/controllers/authController.js
const { verifyLogin, verifyGoogleToken, findUserByEmail, registerUser } = require('../services/authService');
const { v4: uuidv4 } = require('uuid');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await verifyLogin(email, password);
    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    res.status(400).json({ message: `Erro ao fazer login: ${err.message}` });
  }
};

exports.googleLogin = async (req, res) => {
  const { token, photoUrl } = req.body; 
  console.log('Token recebido:', token);

  try {
    const googleUser = await verifyGoogleToken(token);
    let user = await findUserByEmail(googleUser.email);

    if (!user) {
      const password = Math.random().toString(36).slice(-8); // Gerar uma senha aleatória
      const newUser = await registerUser(googleUser.name, googleUser.email, password, photoUrl); // Passa a URL da foto
      if (!newUser) {
        throw new Error('Falha ao registrar usuário');
      }
      user = await findUserByEmail(googleUser.email);
    }

    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    res.status(400).json({ message: `Erro ao fazer login com Google: ${err.message}` });
  }
};


exports.facebookLogin = async (req, res) => {
  const { accessToken, userData } = req.body;
  console.log('Token recebido:', accessToken);

  try {
    const user = await findOrCreateUserWithFacebook(accessToken, userData);
    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    res.status(400).json({ message: `Erro ao fazer login com Facebook: ${err.message}` });
  }
};

const findOrCreateUserWithFacebook = async (accessToken, userData) => {
  const email = userData.email;
  let user = await findUserByEmail(email);

  if (!user) {
    const password = Math.random().toString(36).slice(-8); // Gerar uma senha aleatória
    const photoUrl = userData.picture.data.url;
    const newUser = await registerUser(`${userData.first_name} ${userData.last_name}`, email, password, photoUrl);
    if (!newUser) {
      throw new Error('Falha ao registrar usuário');
    }
    user = await findUserByEmail(email);
  }

  return user;
};