// src/controllers/authController.js
const { verifyLogin, verifyGoogleToken, findUserByEmail, registerUser, verifyUserIsActive } = require('../services/authService');
const { v4: uuidv4 } = require('uuid');


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await verifyLogin(email, password);
    console.log(`Utilizador ${user.email} autenticado com sucesso.`);
    if (user.firstLogin) {
      console.log(`Usuário ${user.email} precisa atualizar a senha.`);
      res.json({ message: 'Login bem-sucedido', user, firstLogin: true });
    } else {
      console.log(`Login bem-sucedido para o usuário ${user.email}.`);
      res.json({ message: 'Login bem-sucedido', user, firstLogin: false });
    }
  } catch (err) {
    console.error(`Erro ao fazer login: ${err.message}`);
    res.status(400).json({ message: `Erro ao fazer login: ${err.message}` });
  }
};



exports.googleLogin = async (req, res) => {
  const { token, photoUrl } = req.body;
  console.log('Token recebido:', token);

  try {
    const googleUser = await verifyGoogleToken(token);
    let user = await findUserByEmail(googleUser.email);

    if (user && !user.isActive) throw new Error('Utilizador inativo');

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
    // Verifica se o usuário é inativo antes de permitir o login
    if (user && !user.isActive) throw new Error('Utilizador inativo');

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
    const photoUrl = userData.picture?.data?.url || ''; // Verificar a presença do campo foto
    const firstName = userData.name || '';
    const newUser = await registerUser(firstName, email, password, photoUrl);
    if (!newUser) {
      throw new Error('Falha ao registrar utilizador');
    }
    user = await findUserByEmail(email);
  }

  return user;
};
