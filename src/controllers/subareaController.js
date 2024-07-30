const Subarea = require('../models/Subarea');
const Area = require('../models/Area');

// Método para listar todas as subáreas
exports.listSubareas = async (req, res) => {
  try {
    const subareas = await Subarea.findAll({ include: Area });
    res.json(subareas);
  } catch (error) {
    console.error('Erro ao buscar subáreas:', error);
    res.status(500).json({ error: 'Erro ao buscar subáreas' });
  }
};

// Método para inserir uma nova subárea
exports.createSubarea = async (req, res) => {
  const { nomeSubarea, areaId } = req.body;
  try {
    const newSubarea = await Subarea.create({ nomeSubarea, areaId });
    res.json(newSubarea);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Já existe uma subárea com este nome' });
    } else {
      console.error('Erro ao criar subárea:', error);
      res.status(500).json({ error: 'Erro ao criar subárea' });
    }
  }
};

// Método para atualizar uma subárea existente
exports.updateSubarea = async (req, res) => {
  const { id } = req.params;
  const { nomeSubarea, areaId } = req.body;
  try {
    const subarea = await Subarea.findByPk(id);
    if (!subarea) {
      return res.status(404).json({ error: 'Subárea não encontrada' });
    }
    subarea.nomeSubarea = nomeSubarea;
    subarea.areaId = areaId;
    await subarea.save();
    res.json(subarea);
  } catch (error) {
    console.error('Erro ao atualizar subárea:', error);
    res.status(500).json({ error: 'Erro ao atualizar subárea' });
  }
};

// Método para deletar uma subárea existente
exports.deleteSubarea = async (req, res) => {
  const { id } = req.params;
  try {
    const subarea = await Subarea.findByPk(id);
    if (!subarea) {
      return res.status(404).json({ error: 'Subárea não encontrada' });
    }
    await subarea.destroy();
    res.json({ message: 'Subárea deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar subárea:', error);
    res.status(500).json({ error: 'Erro ao deletar subárea' });
  }
};


exports.countSubareasAndAreas = async (req, res) => {
  try {
    const subareaCount = await Subarea.count();
    const areaCount = await Area.count();
    res.json({ subareaCount, areaCount });
  } catch (error) {
    console.error('Erro ao contar subáreas e áreas:', error);
    res.status(500).json({ error: 'Erro ao contar subáreas e áreas' });
  }
};