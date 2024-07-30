const { Op } = require('sequelize');
const User = require('../models/User');
const Centro = require('../models/Centro');
const upload = require('../configs/multer');
const bcrypt = require('bcrypt');


const userController = {};



userController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password, centroId, Ativo, notas, fotoUrl } = req.body;

    // Verifica se o utilizador existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza os campos do utilizador
    user.nome = nome;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.centroId = centroId;
    user.Ativo = Ativo;

    // Outros campos
    user.notas = notas;
    user.fotoUrl = fotoUrl;

    await user.save();

    // Retorna o utilizador atualizado
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o utilizador', error });
  }
};


// Adicionar um novo utilizador
userController.addUser = async (req, res) => {
  try {
    const { nome, email, password, centroId, fotoUrl } = req.body;

    // Definir fotoUrl como padrão se não for fornecida
    const defaultFotoUrl = 'https://backend-ai2-proj.onrender.com/uploads/profile.jpg';
    const foto = fotoUrl || defaultFotoUrl;

    // Verifique se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Verifique se o centro existe
    const centro = await Centro.findByPk(centroId);
    if (!centro) {
      return res.status(404).json({ message: 'Centro não encontrado' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crie o novo utilizador
    const user = await User.create({ nome, email, password: hashedPassword, fotoUrl: foto, centroId });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar adicionar o utilizador', error });
  }
};




// Atualizar um utilizador
userController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password, centroId, Ativo, notas, fotoUrl } = req.body;

    // Verifica se o utilizador existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza os campos do utilizador
    user.nome = nome;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.centroId = centroId;
    user.Ativo = Ativo;

    // Outros campos
    user.notas = notas;
    user.fotoUrl = fotoUrl;

    await user.save();

    // Retorna o utilizador atualizado
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o utilizador', error });
  }
};



// Listar todos os utilizadores
userController.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar os utilizadores', error });
  }
};

// Buscar utilizadores por nome, ID ou email
userController.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const searchQuery = search.toLowerCase(); // Converta para minúsculas para busca insensível a maiúsculas/minúsculas

    let users;
    if (!isNaN(searchQuery)) { // Verifica se searchQuery é um número
      users = await User.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${searchQuery}%` } }, // iLike para busca insensível a maiúsculas/minúsculas no PostgreSQL
            { email: { [Op.iLike]: `%${searchQuery}%` } },
            { id: searchQuery } // Procura por ID apenas se searchQuery for um número
          ]
        },
        include: Centro // Inclua o modelo Centro para acessar os dados do centro
      });
    } else {
      users = await User.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${searchQuery}%` } },
            { email: { [Op.iLike]: `%${searchQuery}%` } }
          ]
        },
        include: Centro // Inclua o modelo Centro para acessar os dados do centro
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o utilizador', error });
  }
};

// Filtrar utilizadores por estado ativo ou inativo
userController.filterUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const isActive = status === 'ativo';
    const users = await User.findAll({
      where: { ativo: isActive },
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar os utilizadores', error });
  }
};

// Filtrar utilizadores por centroId
userController.filterUsersByCentro = async (req, res) => {
  const { centroId } = req.params;

  try {
    const users = await User.findAll({
      where: { centroId },
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar os utilizadores por centro', error });
  }
};

// Deletar (inativar) um utilizador
userController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Tentar excluir o utilizador
    const deletedUser = await User.destroy({
      where: { id }
    });

    if (deletedUser === 0) {
      // Se o utilizador não foi excluído (deletedUser === 0), inative o utilizador
      user.ativo = false;
      await user.save();
      return res.status(200).json({ message: 'Usuário inativado com sucesso' });
    }

    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar excluir ou inativar o utilizador', error });
  }
};


// Contar utilizadores totais, ativos e inativos
userController.countUsers = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { Ativo: true } });
    const inactiveUsers = await User.count({ where: { Ativo: false } });

    res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contar os utilizadores', error });
  }
};


module.exports = userController;
