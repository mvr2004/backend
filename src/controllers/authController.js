// src/controllers/authController.js
const { verifyLogin, verifyGoogleToken, findUserByEmail, registerUser, updateUserPassword  } = require('../services/authService');
const { v4: uuidv4 } = require('uuid');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Tentativa de login: ${email}`); // Log para verificar a tentativa de login
  try {
    const user = await verifyLogin(email, password);
    console.log(`Usuário ${user.email} autenticado com sucesso.`);
    if (user.firstLogin) {
      console.log(`Usuário ${user.email} precisa atualizar a senha.`);
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

  try {
    const googleUser = await verifyGoogleToken(token);
    let user = await findUserByEmail(googleUser.email);

    if (!user) {
      // Generate a random password for Google registered users
      const password = Math.random().toString(36).slice(-8); 
      const newUser = await registerUser(googleUser.name, googleUser.email, password, photoUrl); 
      if (!newUser) {
        throw new Error('Failed to register user');
      }
      user = await findUserByEmail(googleUser.email);
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ message: `Error logging in with Google: ${err.message}` });
  }
};



exports.facebookLogin = async (req, res) => {
  const { accessToken, userData } = req.body;

  try {
    const user = await findOrCreateUserWithFacebook(accessToken, userData);
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ message: `Error logging in with Facebook: ${err.message}` });
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

exports.updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const success = await updateUserPassword(userId, newPassword);
    if (success) {
      res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao atualizar a senha' });
    }
  } catch (err) {
    console.error('Erro ao atualizar a senha:', err);
    res.status(500).json({ message: `Erro ao atualizar a senha: ${err.message}` });
  }
};

