// estabelecimentoService.js
const { Op, fn, col } = require('sequelize'); // Import required functions and objects from Sequelize
const sequelize = require('../config/dbConfig'); // Import the Sequelize instance
const Estabelecimento = require('../models/Estabelecimento');
const Subarea = require('../models/Subarea');
const Area = require('../models/Area');
const Centro = require('../models/Centro');
const AvEstabelecimento = require('../models/AvaliacaoEstabelecimento');

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

// Função para buscar estabelecimentos por áreas de interesse e centro com média de avaliações
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
      subareaId: {
        [Op.in]: subareaIds
      }
    };

    // Adiciona filtro por centroId, se fornecido
    if (centroId) {
      whereClause.centroId = centroId;
    }

    // Consulta os estabelecimentos com média das avaliações
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
        {
          model: AvEstabelecimento,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [fn('AVG', col('AvEstabelecimentos.rating')), 'averageRating']
        ]
      },
      group: ['Estabelecimento.id', 'Subarea.id', 'Subarea.Area.id', 'Centro.id'],
      raw: true
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

module.exports = {
  checkExistingEstablishment,
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
};
