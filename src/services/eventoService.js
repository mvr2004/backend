// services/eventoService.js

const Evento = require('../models/Evento');
const Subarea = require('../models/Subarea');
const Utilizador = require('../models/User');
const Centro = require('../models/Centro');

// Função para criar um novo evento
const createEvent = async (req, res, next) => {
  try {
    const { nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId } = req.body;

    // Check if the user exists
    const userExists = await Utilizador.findByPk(utilizadorId);
    if (!userExists) {
      return res.status(400).json({ error: 'Utilizador não encontrado.' });
    }

    // Check if the subarea exists
    const subareaExists = await Subarea.findByPk(subareaId);
    if (!subareaExists) {
      return res.status(400).json({ error: 'Subarea não encontrada.' });
    }

    // Check if the centro exists
    const centroExists = await Centro.findByPk(centroId);
    if (!centroExists) {
      return res.status(400).json({ error: 'Centro não encontrado.' });
    }

    // Create the event in the database
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
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
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
