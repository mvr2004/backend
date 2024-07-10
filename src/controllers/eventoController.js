// controllers/eventoController.js

const eventService = require('../services/eventoService');

// Controlador para criar um novo evento
const createEvent = async (req, res, next) => {
  try {
    await eventService.createEvent(req, res, next);
  } catch (error) {
    console.error('Erro no controlador de evento:', error);
    next(error);
  }
};

// Controlador para buscar todos os eventos
const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar todos os eventos:', error);
    next(error);
  }
};

// Controlador para buscar eventos por centro e ordenar por área de interesse e data
const getEventsByCentro = async (req, res, next) => {
  const { centroId } = req.query;
  try {
    const events = await eventService.getEventsByCentro(centroId);
    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos por centro:', error);
    next(error);
  }
};

// Controlador para buscar um evento pelo ID
const getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    res.json({ event });
  } catch (error) {
    console.error('Erro ao buscar evento por ID:', error);
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByCentro,
  getEventById,
};
