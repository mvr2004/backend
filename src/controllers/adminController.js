const Admin = require('../models/Admin');
const Centro = require('../models/Centro');
const bcrypt = require('bcrypt'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para geração de token JWT
const crypto = require('crypto'); //para o token

// Gera uma chave JWT secreta
const JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');

const controllers = {};

//listar todos os administradores
controllers.listAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      include: [
        {
          model: Centro,
          attributes: ['centro']
        }
      ]
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar encontrar os administradores', error });
  }
};

controllers.login = async (req, res) => {
  const { nome, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { nome } });

    if (!admin) {
      return res.status(404).json({ message: 'Administradores não encontrados' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Palavra passe inválida' });
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'O login foi bem-sucedido', token, idCentro: admin.centroId });
  } catch (error) {
    res.status(500).json({ message: 'Erro durante ao fazer o login', error });
  }
};


controllers.createAdmin = async (req, res) => {
  const { nome, password, centroId } = req.body;

  try {
    // Verifica se já existe um admin para esse centro
    const existingAdmin = await Admin.findOne({ where: { centroId } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Já existe um administrador para esse centro' });
    }

    // Verifica se o centro existe
    const centro = await Centro.findByPk(centroId);
    if (!centro) {
      return res.status(404).json({ message: 'O centro não foi encontrado' });
    }

    // Cria o nome do admin com o prefixo 'admin_' + nome do centro
    const adminName = `admin_${centro.centro}`;

    // Hash da palavrapasse antes de criar o admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria o admin
    const admin = await Admin.create({
      nome: adminName,
      password: hashedPassword,
      centroId
    });

    res.status(201).json({ success: true, message: 'Conta admin criado com sucesso', admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar a conta admin', error });
  }
};


controllers.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    // Encontra o admin pelo ID
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin não encontrado' });
    }

    // Hash da nova senha antes de atualizar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Atualiza a palavra passe do admin
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ success: true, message: 'Palavra-passe da conta admin atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar palavra passe da conta admin', error });
  }
};


module.exports = controllers;
