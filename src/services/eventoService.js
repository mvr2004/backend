// services/eventoService.js

const Evento = require('../models/Evento');
const Subarea = require('../models/Subarea');
const Utilizador = require('../models/Utilizador');
const Centro = require('../models/Centro');
const moment = require('moment');

// Função para criar um novo evento
const createEvent = async (req, res, next) => {
  try {
    const { nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId, ativo } = req.body;

    // Check if the user exists
    const userExists = await Utilizador.findByPk(utilizadorId);
    if (!userExists) {
      return res.status(400).json({ error: 'Utilizador não encontrado.' });
    }

    // Format date using moment
    const formattedDate = moment(data, 'YYYY-MM-DD').toDate();  // Formata a data para 'YYYY-MM-DD'

    // Format time to HH:mm format
    const formattedTime = moment(hora, 'HH:mm').format('HH:mm');  // Formata a hora para 'HH:mm'

    // Cria o evento no banco de dados
    const event = await Evento.create({
      nome,
      localizacao,
      data: formattedDate,
      hora: formattedTime,
      descricao,
      subareaId,
      utilizadorId,
      centroId, 
      ativo
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error('Erro no serviço de evento:', error);
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
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
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
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
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
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      }
    ],
  });
  return event;
};

const getEventsByUserId = async (userId) => {
  try {
    const events = await Event.findAll({ where: { userId } });
    return events;
  } catch (error) {
    console.error('Erro ao buscar eventos por usuário:', error);
    throw error;
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByCentro,
  getEventById,
  getEventsByUserId, 
};
