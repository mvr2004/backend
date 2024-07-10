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

const getEstablishmentsByAreasAndCentro = async (req, res, next) => {
  const { areaIds, centroId } = req.query;

  try {
    // Verifica se areaIds foi fornecido e é uma string não vazia
    if (!areaIds || typeof areaIds !== 'string' || areaIds.trim() === '') {
      throw new Error('IDs de área não fornecidos ou inválidos');
    }

    // Converte areaIds para um array de números inteiros
    const areaIdsArray = areaIds.split(',').map(id => parseInt(id.trim(), 10));

    // Valida se todos os elementos de areaIdsArray são números inteiros válidos
    if (areaIdsArray.some(isNaN)) {
      throw new Error('IDs de área inválidos');
    }

    const establishments = await establishmentService.getEstablishmentsByAreasAndCentro(areaIdsArray, centroId);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por áreas de interesse e centro:', error.message);
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
