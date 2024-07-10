const Estabelecimento = require('../models/Estabelecimento');
const Subarea = require('../models/Subarea');
const Area = require('../models/Area');
const Centro = require('../models/Centro');
const upload = require('../config/uploadConfig');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Função para verificar se já existe um estabelecimento com o mesmo nome ou localização
const checkExistingEstablishment = async (nome, localizacao) => {
  const existingEstablishment = await Estabelecimento.findOne({
    where: {
      nome,
      localizacao
    }
  });
  return existingEstablishment;
};

// Função para criar um novo estabelecimento com upload de fotografia
const createEstablishment = async (data) => {
  const {
    nome,
    localizacao,
    contacto,
    descricao,
    pago,
    subareaId,
    centroId,
    foto
  } = data;

  try {
    const establishment = await Estabelecimento.create({
		  nome,
		  localizacao,
		  contacto,
		  descricao,
		  pago,
		  foto: `https://backend-9hij.onrender.com/uploads/${filename}`,
		  subareaId,
		  centroId
		});

    return establishment;
  } catch (error) {
    throw new Error(`Erro ao criar o estabelecimento: ${error.message}`);
  }
};

// Função para buscar todos os estabelecimentos
const getAllEstablishments = async () => {
  const establishments = await Estabelecimento.findAll({
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishments;
};

// Função para buscar estabelecimentos por nome
const getEstablishmentsByName = async (name) => {
  const establishments = await Estabelecimento.findAll({
    where: {
      nome: name
    },
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishments;
};

// Função para buscar estabelecimentos por áreas de interesse e centro
const getEstablishmentsByAreasAndCentro = async (areaIdsArray, centroId) => {
  try {
    // Encontra as subáreas que pertencem às áreas de interesse fornecidas
    const subareas = await Subarea.findAll({
      where: {
        areaId: areaIdsArray
      }
    });

    // Extrai os IDs das subáreas encontradas
    const subareaIds = subareas.map(subarea => subarea.id);

    // Constrói a cláusula where para a consulta de estabelecimentos
    const whereClause = {
      subareaId: subareaIds
    };

    // Adiciona filtro por centroId, se fornecido
    if (centroId) {
      whereClause.centroId = centroId;
    }

    // Consulta os estabelecimentos
    const establishments = await Estabelecimento.findAll({
      where: whereClause,
      include: [
        {
          model: Subarea,
          attributes: ['id', 'nomeSubarea'],
          include: {
            model: Area,
            attributes: ['id', 'nomeArea'],
          },
        },
        {
          model: Centro,
          attributes: ['id', 'centro'],
        },
      ],
    });

    return establishments;
  } catch (error) {
    // Captura e relança o erro com uma mensagem específica
    throw new Error(`Erro ao buscar estabelecimentos por áreas de interesse e centro: ${error.message}`);
  }
};

// Função para buscar um estabelecimento pelo ID
const getEstablishmentById = async (id) => {
  const establishment = await Estabelecimento.findByPk(id, {
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
      include: {
        model: Area,
        attributes: ['id', 'nomeArea'],
      },
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishment;
};


// Função para criar uma avaliação de estabelecimento
const createEstabelecimentoReview = async (data) => {
  const { establishmentId, userId, rating } = data;

  try {
    // Fetch the establishment by ID
    const estabelecimento = await Estabelecimento.findByPk(establishmentId);

    if (!estabelecimento) {
      throw new Error('Estabelecimento não encontrado.');
    }

    // Create the review
    const review = await AvEstabelecimento.create({
      establishmentId,
      userId,
      rating,
    });

    return review;
  } catch (error) {
    throw new Error(`Erro ao criar avaliação de estabelecimento: ${error.message}`);
  }
};

// Função para listar as avaliações de um estabelecimento
const listEstabelecimentoReviews = async (estabelecimentoId) => {
  const reviews = await AvEstabelecimento.findAll({
    where: { establishmentId: estabelecimentoId },
  });

  return reviews;
};

// Função para calcular a média das avaliações de um estabelecimento
const calculateEstabelecimentoAverageRating = async (estabelecimentoId) => {
  const averageRating = await AvEstabelecimento.findOne({
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']],
    where: { establishmentId: estabelecimentoId },
  });

  return averageRating;
};


module.exports = {
 createEstabelecimentoReview,
  listEstabelecimentoReviews,
  calculateEstabelecimentoAverageRating,
  checkExistingEstablishment,
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
};
