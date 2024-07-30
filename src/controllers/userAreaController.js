const User = require('../models/User');
const Area = require('../models/Area');
const UserArea = require('../models/UserArea');


// Adicionar uma área de interesse a um usuário
exports.addUserArea = async (req, res) => {
  const { userId, areaIds } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Remove todas as áreas de interesse atuais do usuário
    await UserArea.destroy({ where: { userId } });

    // Adiciona as novas áreas de interesse
    const newUserAreas = areaIds.map(areaId => ({ userId, areaId }));
    await UserArea.bulkCreate(newUserAreas);

    return res.status(201).json({ message: 'Áreas de interesse atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar áreas de interesse do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Listar áreas de interesse de um usuário
exports.listUserAreas = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Area, through: UserArea }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const areas = user.Areas.map(area => ({
      id: area.id,
      nomeArea: area.nomeArea
    }));

    return res.status(200).json(areas);
  } catch (error) {
    console.error('Erro ao listar áreas de interesse do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
