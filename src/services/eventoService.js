// services/eventoService.js

const Evento = require('../models/Evento');
const Subarea = require('../models/Subarea');
const Utilizador = require('../models/User');
const Centro = require('../models/Centro');
const AreaInteresse = require('../models/AreaInteresse'); //

// Função para criar um novo evento
const createEvent = async (req, res, next) => {
  try {
    const { nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId } = req.body;

    // Cria o evento no banco de dados
    const event = await Evento.create({
      nome,
      localizacao,
      data,
      hora,
      descricao,
      subareaId,
      utilizadorId,
      centroId
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error('Erro ao criar o evento:', error);
    next(error);
  }
};

// Função para buscar todos os eventos
const getAllEvents = async () => {
  const events = await Evento.findAll({
    include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
      },
      {
        model: Utilizador,
        attributes: ['id', 'name'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      }
    ],
  });
  return events;
};

// Função para buscar eventos por centro e ordenar por área de interesse do utilizador e data
const getEventsByCentro = async (centroId, userId) => {
  try {
    // Busca as áreas de interesse do usuário
    const userAreas = await AreaInteresse.findAll({
      where: {
        userId: userId
      },
      attributes: ['subareaId'], // Apenas precisa dos IDs das subáreas
      raw: true // Retorna apenas os dados crus
    });

    // Extrai apenas os IDs das subáreas das áreas de interesse do usuário
    const userSubareaIds = userAreas.map(area => area.subareaId);

    // Busca os eventos filtrando pelas subáreas de interesse do usuário e pelo centroId
    const events = await Evento.findAll({
      where: {
        centroId: centroId,
        subareaId: userSubareaIds // Filtra pelos IDs das subáreas de interesse do usuário
      },
      include: [
        {
          model: Subarea,
          attributes: ['id', 'nomeSubarea'],
        },
        {
          model: Utilizador,
          attributes: ['id', 'name'],
        },
        {
          model: Centro,
          attributes: ['id', 'centro'],
        }
      ],
      order: [
        ['data', 'DESC'] // Ordena pela data, da mais recente para a mais antiga
      ]
    });

    return events;
  } catch (error) {
    throw new Error(`Erro ao buscar eventos por centro: ${error.message}`);
  }
};


// Função para buscar um evento pelo ID
const getEventById = async (id) => {
  const event = await Evento.findByPk(id, {
    include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
      },
      {
        model: Utilizador,
        attributes: ['id', 'name'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      }
    ],
  });
  return event;
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByCentro,
  getEventById,
};
