const Centro = require('../models/Centro');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const centroController = {};

// Função auxiliar para criar um admin
const createAdminForCentro = async (adminPassword, centro) => {
  const adminName = `admin_${centro.centro}`;

  // Não criptografa novamente, assume que adminPassword já está criptografada
  const admin = await Admin.create({
    nome: adminName,
    password: adminPassword,
    centroId: centro.id
  });

  return admin;
};


// Função auxiliar para excluir admins de um centro
const deleteAdminsForCentro = async (centroId) => {
  try {
    // Encontra todos os admins com o centroId especificado
    const admins = await Admin.findAll({ where: { centroId } });

    // Exclui todos os admins encontrados
    await Promise.all(admins.map(async (admin) => {
      await admin.destroy();
    }));

    return true;
  } catch (error) {
    throw error;
  }
};

// Listar todos os centros
centroController.listCentros = async (req, res) => {
  try {
    const centros = await Centro.findAll();
    res.status(200).json(centros);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar encontrar os centros', error });
  }
};

// Criar um centro com um administrador
centroController.createCentro = async (req, res) => {
  const { centro, adminPassword } = req.body;

  try {
    // Verifica se já existe um centro com o mesmo nome
    const existingCentro = await Centro.findOne({ where: { centro } });
    if (existingCentro) {
      return res.status(400).json({ message: 'Já existe um centro com esse nome' });
    }

    // Cria o centro
    const newCentro = await Centro.create({ centro });

    // Cria o admin associado ao centro
    const admin = await createAdminForCentro(adminPassword, newCentro);

    res.status(201).json({ success: true, message: 'Centro e conta admin criados com sucesso', centro: newCentro, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar o centro e a conta admin', error });
  }
};

// Editar um centro e atualizar o nome do administrador
centroController.updateCentro = async (req, res) => {
  const { id } = req.params;
  const { centro } = req.body;

  try {
    const centroToUpdate = await Centro.findByPk(id);

    if (!centroToUpdate) {
      return res.status(404).json({ message: 'Centro não encontrado' });
    }

    // Atualizar o nome do centro
    centroToUpdate.centro = centro;
    await centroToUpdate.save();

    // Encontrar o administrador associado ao centro
    const admin = await Admin.findOne({ where: { centroId: id } });

    if (admin) {
      // Atualizar o nome do administrador
      admin.nome = `admin_${centro}`;
      await admin.save();
    }

    res.status(200).json({ message: 'Centro e nome do administrador atualizados com sucesso', centro: centroToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o centro e o nome do administrador', error });
  }
};

// Eliminar um centro
centroController.deleteCentro = async (req, res) => {
  const { id } = req.params;

  try {
    const centroToDelete = await Centro.findByPk(id);

    if (!centroToDelete) {
      return res.status(404).json({ message: 'Centro não encontrado' });
    }

    await centroToDelete.destroy();

    res.status(200).json({ message: 'Centro eliminado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao eliminar o centro', error });
  }
};

// Eliminar um centro
centroController.deleteCentro = async (req, res) => {
  const { id } = req.params;

  try {
    const centroToDelete = await Centro.findByPk(id);

    if (!centroToDelete) {
      return res.status(404).json({ message: 'Centro não encontrado' });
    }

    // Exclui os admins associados ao centro
    await deleteAdminsForCentro(id);

    // Agora pode excluir o centro
    await centroToDelete.destroy();

    res.status(200).json({ message: 'Centro eliminado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao eliminar o centro', error });
  }
};


centroController.countCentros = async (req, res) => {
  try {
    const count = await Centro.count();
    res.status(200).json({ totalCentros: count });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar contar os centros', error });
  }
};

module.exports = centroController;
