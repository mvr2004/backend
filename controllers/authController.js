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
