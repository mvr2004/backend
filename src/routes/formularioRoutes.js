const express = require('express');
const router = express.Router();
const formularioController = require('../controllers/formularioController');

// Rotas de formulário
router.post('/formularios', formularioController.createFormulario);
router.put('/formularios/:formularioId/estado', formularioController.updateFormularioStatus);

// Rotas de campo de formulário
router.post('/formularios/:formularioId/campos', formularioController.createCampoFormulario);

// Rotas de resposta ao formulário
router.post('/formularios/respostas', formularioController.submitFormularioResponse);
router.get('/formularios/:formularioId/respostas', formularioController.getResponsesByFormulario);

// Rotas para obter formulários respondidos
router.get('/utilizadores/:utilizadorId/formularios/respondidos', formularioController.getFormulariosRespondidos);
router.get('/utilizadores/:utilizadorId/eventos/:eventoId/formularios/:formularioId/respostas', formularioController.getFormularioResponsesByUserAndEvent);

// Nova rota para pesquisar formulários respondidos de um evento
router.get('/utilizadores/:utilizadorId/eventos/:eventoId/formularios/respondidos', formularioController.getFormulariosRespondidosPorEvento);

// Nova rota para obter formulários de um evento
router.get('/eventos/:eventoId/formularios', formularioController.getFormulariosByEvento);


module.exports = router;
