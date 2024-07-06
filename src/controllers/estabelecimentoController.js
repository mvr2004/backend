// controllers/establishmentController.js

const establishmentService = require('../services/estabelecimentoService');

// Controlador para criar um novo estabelecimento
const createEstablishment = async (req, res, next) => {
  try {
    await establishmentService.createEstablishment(req, res, next);
  } catch (error) {
    console.error('Erro no controlador de estabelecimento:', error);
    next(error);
  }
};

// Controlador para buscar todos os estabelecimentos
const getAllEstablishments = async (req, res, next) => {
  try {
    const establishments = await establishmentService.getAllEstablishments();
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar todos os estabelecimentos:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos por nome
const getEstablishmentsByName = async (req, res, next) => {
  const { nome } = req.query;
  try {
    const establishments = await establishmentService.getEstablishmentsByName(nome);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por nome:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos por uma ou várias áreas de interesse e centro
const getEstablishmentsByAreasAndCentro = async (req, res, next) => {
  const { areaIds, centroId } = req.query;
  try {
    const establishments = await establishmentService.getEstablishmentsByAreasAndCentro(areaIds, centroId);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por áreas de interesse e centro:', error);
    next(error);
  }
};

// Controlador para buscar um estabelecimento pelo ID
const getEstablishmentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const establishment = await establishmentService.getEstablishmentById(id);
    if (!establishment) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }
    res.json({ establishment });
  } catch (error) {
    console.error('Erro ao buscar estabelecimento por ID:', error);
    next(error);
  }
};

module.exports = {
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
};
