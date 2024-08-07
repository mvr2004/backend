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
const getEventsByUser = async (req, res) => {
  try {
    const utilizadorId = parseInt(req.params.utilizadorId, 10);
    if (isNaN(utilizadorId)) {
      return res.status(400).json({ error: 'ID do utilizador inválido' });
    }
    const eventos = await participacaoService.getEventsByUser(utilizadorId);
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Erro no controller ao obter eventos do utilizador:', error);  // Log de erro
    res.status(500).json({ error: 'Erro ao obter eventos do utilizador' });
  }
};



module.exports = {
    addUserToEvent,
    removeUserFromEvent,
    getUsersByEvent,
    getEventsByUser
};
