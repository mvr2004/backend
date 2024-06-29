// src/controllers/userController.js
const { queryTable, registerUser, confirmEmail  } = require('../services/userService');

exports.register = async (req, res) => {
  const { name, email, password, photoUrl } = req.body;
  try {
    const success = await registerUser(name, email, password, photoUrl);
    if (success) {
      res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu e-mail para confirmar.' });
    } else {
      res.status(400).json({ message: 'Falha ao registrar usuário' });
    }
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ message: `Erro ao registrar usuário: ${err.message}` });
  }
};

exports.getData = async (req, res) => {
  try {
    const data = await queryTable();
    res.json(data);
  } catch (err) {
    console.error('Erro ao obter dados da tabela:', err);
    res.status(500).json({ message: `Erro ao obter dados da tabela: ${err.message}` });
  }
};


exports.confirmEmail = async (req, res) => {
  const { email, code } = req.body; // Extrai email e code do corpo da requisição
  try {
    const success = await confirmEmail(email, code);
    if (success) {
      res.status(200).json({ message: 'E-mail confirmado com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao confirmar e-mail' });
    }
  } catch (err) {
    console.error('Erro ao confirmar e-mail:', err);
    res.status(500).json({ message: `Erro ao confirmar e-mail: ${err.message}` });
  }
};