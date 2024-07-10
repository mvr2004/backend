// services/eventService.js

const Evento = require('../models/Evento');
const Subarea = require('../models/Subarea');
const Utilizador = require('../models/User');
const Centro = require('../models/Centro');

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
        attributes: ['id', 'nome'],
      },
      {
        model: Centro,
        attributes: ['id', 'nome'],
      }
    ],
  });
  return events;
};

// Função para buscar eventos por centro e ordenar por área de interesse e data
const getEventsByCentro = async (centroId) => {
  const events = await Evento.findAll({
    where: {
      centroId: centroId
    },
    include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
      },
      {
        model: Utilizador,
        attributes: ['id', 'nome'],
      },
      {
        model: Centro,
        attributes: ['id', 'nome'],
      }
    ],
    order: [
      [Subarea, 'nomeSubarea', 'ASC'],  // Ordena pela área de interesse (nome da subárea)
      ['data', 'DESC']  // Ordena pela data, da mais recente para a mais antiga
    ]
  });
  return events;
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
        attributes: ['id', 'nome'],
      },
      {
        model: Centro,
        attributes: ['id', 'nome'],
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
