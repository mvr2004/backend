// controllers/participacaoController.js

const participacaoService = require('../services/participacaoService');

// Controlador para adicionar um usuário a um evento
const addUserToEvent = async (req, res, next) => {
    try {
        const { utilizadorId, eventoId } = req.body;
        const participacao = await participacaoService.addUserToEvent(utilizadorId, eventoId);
        res.status(201).json({ participacao });
    } catch (error) {
        console.error('Erro ao adicionar usuário ao evento:', error);
        next(error);
    }
};

// Controlador para remover um usuário de um evento
const removeUserFromEvent = async (req, res, next) => {
    try {
        const { utilizadorId, eventoId } = req.body;
        await participacaoService.removeUserFromEvent(utilizadorId, eventoId);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover usuário do evento:', error);
        next(error);
    }
};

// Controlador para obter todos os usuários de um evento
const getUsersByEvent = async (req, res, next) => {
    try {
        const { eventoId } = req.params;
        const utilizadores = await participacaoService.getUsersByEvent(eventoId);
        res.json({ utilizadores });
    } catch (error) {
        console.error('Erro ao obter usuários do evento:', error);
        next(error);
    }
};

// Controlador para obter todos os eventos de um usuário
const getEventsByUser = async (utilizadorId) => {
  try {
    console.log(`Buscando eventos para o utilizador com ID: ${utilizadorId}`);
    const eventos = await Evento.findAll({
      include: {
        model: Utilizador,
        where: { id: utilizadorId },
        through: { attributes: [] }
      }
    });
    console.log('Eventos encontrados:', eventos);
    return eventos;
  } catch (error) {
    console.error('Erro ao obter eventos do usuário:', error);
    throw new Error('Erro ao obter eventos do usuário: ' + error.message);
  }
};



module.exports = {
    addUserToEvent,
    removeUserFromEvent,
    getUsersByEvent,
    getEventsByUser
};
