const participacaoService = require('../services/participacaoService');

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

const getEventsByUser = async (req, res, next) => {
  try {
    const { utilizadorId } = req.params;
    const eventos = await participacaoService.getEventsByUser(utilizadorId);
    res.json({ eventos });
  } catch (error) {
    console.error('Erro ao obter eventos do usuário:', error);
    next(error);
  }
};

module.exports = {
    addUserToEvent,
    removeUserFromEvent,
    getUsersByEvent,
    getEventsByUser
};
