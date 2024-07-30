const Area = require('../models/Area');

// Método para listar todas as áreas
exports.listAreas = async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.json(areas);
  } catch (error) {
    console.error('Erro ao buscar áreas:', error);
    res.status(500).json({ error: 'Erro ao buscar áreas' });
  }
};

// Método para inserir uma nova área
exports.createArea = async (req, res) => {
  const { nomeArea } = req.body;
  try {
    const newArea = await Area.create({ nomeArea });
    res.json(newArea);
  } catch (error) {
    console.error('Erro ao criar área:', error);
    res.status(500).json({ error: 'Erro ao criar área' });
  }
};

// Método para atualizar uma área existente
exports.updateArea = async (req, res) => {
  const { id } = req.params;
  const { nomeArea } = req.body;
  try {
    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }
    area.nomeArea = nomeArea;
    await area.save();
    res.json(area);
  } catch (error) {
    console.error('Erro ao atualizar área:', error);
    res.status(500).json({ error: 'Erro ao atualizar área' });
  }
};

// Método para deletar uma área existente
exports.deleteArea = async (req, res) => {
  const { id } = req.params;
  try {
    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }
    await area.destroy();
    res.json({ message: 'Área deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar área:', error);
    res.status(500).json({ error: 'Erro ao deletar área' });
  }
};
