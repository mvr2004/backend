const { Area, Subarea } = require('../models');

// Controller para consultar todas as áreas
const getAllAreas = async (req, res, next) => {
  try {
    const areas = await Area.findAll();
    res.json({ areas });
  } catch (error) {
    console.error('Erro ao buscar todas as áreas:', error);
    next(error);
  }
};

// Controller para consultar as subáreas de uma área específica
const getSubareasByAreaId = async (req, res, next) => {
  const { areaId } = req.params;
  try {
    const subareas = await Subarea.findAll({
      where: { areaId: areaId },
      include: [{ model: Area, attributes: ['id', 'nomeArea'] }],
    });
    res.json({ subareas });
  } catch (error) {
    console.error('Erro ao buscar subáreas por área:', error);
    next(error);
  }
};

module.exports = {
  getAllAreas,
  getSubareasByAreaId,
};
