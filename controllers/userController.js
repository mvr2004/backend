// src/controllers/userController.js
const { queryTable, registerUser } = require('../services/userService');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const success = await registerUser(name, email, password);
    if (success) {
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
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
